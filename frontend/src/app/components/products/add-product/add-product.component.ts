import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterModule],
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
// this component is used to add a new product
export class ProductComponent {
  isLoading: boolean = false;
  errorMessage: string = '';
  product = {
    name: '',
    description: '',
    price: 0,
    file: null as File | null
  };

  imagePreview: string | ArrayBuffer | null = null;
  // upload image
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.product.file = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.product.file = null;
    this.imagePreview = null;
  }
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
  // onSubmit is used to submit the form
  onSubmit() {
    // alert('Product added successfully');
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    if (this.product.file) {
      formData.append('file', this.product.file, this.product.file.name);
    }
 
    this.http.post(`${environment.apiUrl}/product/add-product`, formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Register response:', response);   
        this.router.navigate(['/home']); 
      },
      (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
}