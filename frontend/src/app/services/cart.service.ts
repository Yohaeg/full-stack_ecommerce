import { Injectable } from '@angular/core';
import { cp } from 'fs';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_key: string;
}

@Injectable({
  providedIn: 'root'
})
// this service is responsible for managing the shopping cart
export class CartService {
  private cart: any[] = [];
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems;

  constructor() {}
  // this method is used to add items to the cart
  addToCart(product: CartItem) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.id === product.id);
    // alert('existingItem: '+product.id);
    if (existingItem) {
      // existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
      const updatedItems = currentItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      this.cartItems.next(updatedItems);
    } else {
      this.cartItems.next([...currentItems, { ...product, quantity: 1 }]);
    }
  }
  
  getTotalPrice(): number {
    return this.cartItems.getValue().reduce((total, item) => total + item.price * item.quantity, 0);
  }
  getCartItems(): any[] {
    return this.cart;
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter(item => item.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    this.cartItems.next(updatedItems);
  }

  clearCart() {
    this.cartItems.next([]);
  }
} 