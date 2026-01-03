import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private tokenKey = 'auth_token';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('🚀 AuthService constructor called');
    console.log('  ├─ Platform:', this.isBrowser ? 'Browser' : 'Server');
    console.log('  └─ Timestamp:', new Date().toISOString());

    if (this.isBrowser) {
      // Defer token loading to avoid circular dependency during initialization
      setTimeout(() => this.loadUserFromToken(), 0);
    }
  }

  private loadUserFromToken(): void {
    console.log('═══════════════════════════════════════');
    console.log('🔐 LOADING USER FROM TOKEN');
    console.log('═══════════════════════════════════════');

    const token = this.getToken();
    console.log('  ├─ Token exists:', !!token);
    console.log('  ├─ Token preview:', token ? `${token.substring(0, 40)}...` : 'No token');
    console.log('  └─ LocalStorage key:', this.tokenKey);

    if (token) {
      console.log('  ▶ Calling backend to validate token...');

      this.apiService
        .getCurrentUser()
        .pipe(
          tap(user => {
            console.log('✅ USER LOADED SUCCESSFULLY');
            console.log('  ├─ User ID:', user.id);
            console.log('  ├─ User email:', user.email);
            console.log('  ├─ User name:', user.name);
            console.log('  ├─ User role:', user.role);
            console.log('  └─ Setting user signal...');
            this.currentUserSignal.set(user);
            console.log('  ✓ User signal set successfully');
            console.log('═══════════════════════════════════════\n');
          }),
          catchError(error => {
            console.log('═══════════════════════════════════════');
            console.error('❌ FAILED TO LOAD USER FROM TOKEN');
            console.log('═══════════════════════════════════════');
            console.error('  ├─ Error status:', error.status);
            console.error('  ├─ Error message:', error.message);
            console.error('  ├─ Error details:', error);
            console.log('  ├─ Removing invalid token...');
            this.removeToken();
            console.log('  ├─ Clearing user signal...');
            this.currentUserSignal.set(null);
            console.log('  └─ User logged out');
            console.log('═══════════════════════════════════════\n');
            return of(null);
          })
        )
        .subscribe();
    } else {
      console.log('  ⚠️  No token found - user not authenticated');
      console.log('═══════════════════════════════════════\n');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('═══════════════════════════════════════');
    console.log('🔑 LOGIN ATTEMPT');
    console.log('  ├─ Email:', credentials.email);
    console.log('  └─ Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════');

    return this.apiService.login(credentials).pipe(
      tap(response => {
        console.log('✅ LOGIN SUCCESSFUL');
        console.log('  ├─ User:', response.user.email);
        console.log('  ├─ Role:', response.user.role);
        console.log('  ├─ Token received (length):', response.token.length);
        this.setToken(response.token);
        this.currentUserSignal.set(response.user);
        console.log('  └─ Navigating to home...');
        console.log('═══════════════════════════════════════\n');
        this.router.navigate(['/']);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('═══════════════════════════════════════');
    console.log('📝 REGISTRATION ATTEMPT');
    console.log('  ├─ Email:', userData.email);
    console.log('  ├─ Name:', userData.name);
    console.log('  └─ Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════');

    return this.apiService.register(userData).pipe(
      tap(response => {
        console.log('✅ REGISTRATION SUCCESSFUL');
        console.log('  ├─ User:', response.user.email);
        console.log('  ├─ Role:', response.user.role);
        this.setToken(response.token);
        this.currentUserSignal.set(response.user);
        console.log('  └─ Navigating to home...');
        console.log('═══════════════════════════════════════\n');
        this.router.navigate(['/']);
      })
    );
  }

  logout(): void {
    console.log('═══════════════════════════════════════');
    console.log('🚪 LOGOUT');
    console.log('  ├─ Removing token...');
    this.removeToken();
    console.log('  ├─ Clearing user signal...');
    this.currentUserSignal.set(null);
    console.log('  ├─ Navigating to login page...');
    console.log('  └─ Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════\n');
    this.router.navigate(['/login']);
  }

  updateCurrentUser(user: User): void {
    console.log('🔄 UPDATING CURRENT USER');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User email:', user.email);
    console.log('  ├─ User name:', user.name);
    console.log('  └─ User role:', user.role);
    this.currentUserSignal.set(user);
    console.log('  ✓ User signal updated successfully');
  }

  private setToken(token: string): void {
    console.log('💾 SAVING TOKEN');
    console.log('  ├─ Platform:', this.isBrowser ? 'Browser' : 'Server');
    console.log('  ├─ Token length:', token.length);
    console.log('  ├─ Token preview:', `${token.substring(0, 40)}...`);

    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
      console.log('  └─ ✓ Token saved to localStorage');

      // Verify it was saved
      const saved = localStorage.getItem(this.tokenKey);
      console.log('  └─ Verification: Token exists in localStorage:', !!saved);
    } else {
      console.log('  └─ ⚠️  Not in browser - token NOT saved');
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem(this.tokenKey);
      console.log('🔍 Getting token from localStorage:', token ? 'Token exists' : 'No token');
      return token;
    }
    console.log('🔍 Getting token: Not in browser - returning null');
    return null;
  }

  private removeToken(): void {
    console.log('🗑️  REMOVING TOKEN');
    console.log('  ├─ Platform:', this.isBrowser ? 'Browser' : 'Server');

    if (this.isBrowser) {
      const hadToken = !!localStorage.getItem(this.tokenKey);
      console.log('  ├─ Token existed before removal:', hadToken);
      localStorage.removeItem(this.tokenKey);
      const stillHasToken = !!localStorage.getItem(this.tokenKey);
      console.log('  ├─ Token still exists after removal:', stillHasToken);
      console.log('  └─ ✓ Token removed from localStorage');
    } else {
      console.log('  └─ ⚠️  Not in browser - no token to remove');
    }
  }
}
