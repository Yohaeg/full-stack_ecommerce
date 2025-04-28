import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
// export class CartComponent
export class CartComponent implements OnInit {
  cartItems$: BehaviorSubject<CartItem[]>;
  total = 0;
  token: any;
  isLoading: boolean = false;
  cartItems: CartItem[] = [];

  // constructor
  constructor(private cartService: CartService,
    public authService: AuthService,
    private http: HttpClient
    ) {
    this.cartItems$ = this.cartService.cartItems$;
  }
  // ngOnInit intialize data
  ngOnInit(): void {
    this.loadCartItems();
    this.cartItems$.subscribe(items => {
      this.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });
  }

 // loadCartItems
  loadCartItems(){
    this.isLoading = true;
    this.token = this.authService.getToken();
    if (this.authService.isAuthenticated()) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      console.log('Token:', this.token);
      this.http.get<{cartItems: CartItem[], total: number }>(`${environment.apiUrl}/cart/getcart`, { headers })
      .subscribe({
        next: (response) => {
          // alert('API Items:'+ apiItems);
          this.cartItems = response.cartItems; 
          this.total = response.total;  
          this.cartItems$.next(response.cartItems); 
        },
        error: (err) => {
          console.error('Failed to load cart:', err);
        }
      });
    }
  }
  // update quantity in cart
  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.id, quantity);
  }
  // remove item from cart
  removeItem(itemId: number): void {
    this.token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.delete(`${environment.apiUrl}/cart/${itemId}`, { headers }).subscribe({
      next: (response: any) => {
        this.cartService.removeFromCart(itemId);
      },
      error: (error) => {
      }
    });
  }
  // remove all items from cart
  clearCart(): void {
    this.token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(`${environment.apiUrl}/cart/delete`, { headers }).subscribe({
      next: (response: any) => {
        this.cartService.clearCart();
        this.cartItems$.next([]);
        this.total = 0;
        this.cartItems = [];
        this.isLoading = false;
      },
      error: (error) => {
      }
    });
    
  }
} 