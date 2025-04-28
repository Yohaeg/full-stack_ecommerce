import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/products/add-product/add-product.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: ProductListComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'addproduct', component: ProductComponent },
    { path: 'cart', component: CartComponent },
];
  

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}