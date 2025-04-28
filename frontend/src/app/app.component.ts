import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  image_key: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'e-commerce_front';
  cartItemCount = 0;
  emailAddress = 'support@shopnow.com';
  products: Product[] = []
  isLoginPage = false;
  currentYear = new Date().getFullYear();
  profileImageUrl: string | null = null;
  token: string | null = null;
  isAuthenticated = false;
  private destroy$ = new Subject<void>();
  isLoadingProducts: boolean = false; 

  constructor(
    private cartService: CartService,
    private router: Router,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.setupRouterListener();
    this.checkInitialAuthState();
    this.fetchProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cartService.clearCart();
    this.cartItemCount = 0;
    this.isAuthenticated = false;
  }

  private setupRouterListener() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.url === '/login';
      this.updateAuthState();
    if (!event.url.includes('/login') && !event.url.includes('/cart')) {
      this.fetchProducts();
    }
    });
  }

  private setupCartSubscription() {
    this.cartService.cartItems$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  private checkInitialAuthState() {
    this.updateAuthState();
  }

  private updateAuthState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      this.loadProfileImage();
    } else {
      this.profileImageUrl = null;
    }
  }

  private loadProfileImage() {
    this.token = this.authService.getToken();
    if (!this.token) {
      this.profileImageUrl = '';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(`${environment.apiUrl}/user/profile`, { headers }).subscribe({
      next: (response: any) => {
        this.profileImageUrl = response.profilePicture || '';
      },
      error: (error) => {
        this.profileImageUrl = '';
        if (error.status === 401) {
          this.handleUnauthorized();
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/login']);
  }

  private handleUnauthorized() {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/login']);
  }

 
  addToCart(product: Product) {
    const cartItem: CartItem = {
      ...product,
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
    this.token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.post(`${environment.apiUrl}/cart`, cartItem, { headers }).subscribe({
      next: () => console.log('Cart updated'),
      error: (err) => {
        console.error(err);
        // Optional: Show toast message
      }
    });
  }
  private fetchProducts() {
    this.isLoadingProducts = true;
    this.http.get<Product[]>(`${environment.apiUrl}/product`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products) => {
        this.products = products;
        // alert(this.products);
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Failed to fetch products:', error);
        this.isLoadingProducts = false;
        // Optionally: this.products = FALLBACK_PRODUCTS;
      }
    });
  }
}
