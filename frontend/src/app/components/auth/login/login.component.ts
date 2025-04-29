import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, RouterLink], // Required for *ngIf
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
// export class LoginComponent
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
 // constuctor that initializes the component
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
 // ngOnInit lifecycle hook
  ngOnInit() {
    console.log('Login component initialized');
  }
 // onSubmit method that handles form submission
  onSubmit(value: any) {
    console.log('Login form submitted');
    // check if the form is valid
    if (!this.validateForm()) {
      return;
    }
    // Check if email and password are provided
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    // Prepare login data
    const loginData = {
      email: this.email.trim(),
      password: this.password
    };
    // Create HttpParams object
    const params = new HttpParams();

    const options = {
        params,
        reportProgress: true,
    };
    // Send login request
    this.http.post(`${environment.apiUrl}/user/login`, loginData, options).subscribe(
      (response: any) => {
         
        this.isLoading = false;
    
        const token = response.token;
        // Check if token is present in the response
        if (token) {
          localStorage.setItem('authToken', token);
          this.router.navigate(['/']);
          
        } else {
          this.errorMessage = 'Invalid response from server.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
  logout() {
    // Clear token from localStorage
    localStorage.removeItem('authToken');

    // Optionally navigate back to login
    this.router.navigate(['/login']);
  }
  private validateForm(): boolean {
    if (!this.email) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }
  // handle the login process
  private handleLoginSuccess(response: any): void {
    this.isLoading = false;
  }
  //  handle errors 
  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.errorMessage = this.getErrorMessage(error);
    console.error('Login error:', error);
  }
  // getErrorMessage method
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Invalid email or password';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Login failed. Please try again later.';
  }

  // ngOnDestroy() {
  //   console.log('Login component destroyed');
  //   this.logout();

  // }
}