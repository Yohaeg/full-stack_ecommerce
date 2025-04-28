import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterModule, RouterLink], //RouterLink Required for *ngIf
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
// this component is used to register a new user
export class RegisterComponent {
  isLoading: boolean = false;
  errorMessage: string = '';
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: null as File | null
  };

  imagePreview: string | ArrayBuffer | null = null;
 // upload image
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.file = file;      
      // preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  // remove image
  removeImage() {
    this.user.file = null;
    this.imagePreview = null;
  }
  // constructor has all  initializtion
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
  // onSubmit is used to submit the form
  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const params = new HttpParams();
   
    // Create FormData to send both text and file data
    const formData = new FormData();
    formData.append('email', this.user.email.trim());
    formData.append('password', this.user.password);
    formData.append('name', this.user.name.trim());
    if (this.user.file) {
      formData.append('file', this.user.file, this.user.file.name);

    }

    this.http.post(`${environment.apiUrl}/user/register`, formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Register response:', response);   
        this.router.navigate(['/login']); 
      },
      // (error) => {
      //   this.isLoading = false;
      //   console.error('Login error:', error); // See the exact error
      //   this.errorMessage = 'Login failed. Please check your credentials and try again.';
      // }
    );
  }
}