import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
// export class ProductListComponent
export class ProductListComponent implements OnInit {
  products = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}
  
  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}
