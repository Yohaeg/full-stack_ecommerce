import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
// this reponable for authentication and authorization
export class AuthService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    console.log('Platform ID:', platformId);
    console.log('Is Browser:', isPlatformBrowser(platformId));
    // console.log('Is Server:', isPlatformServer(platformId))
  }

  getToken(): string | null {
    // console.log('Checking if running in browser:', isPlatformBrowser(this.platformId));
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }
}

