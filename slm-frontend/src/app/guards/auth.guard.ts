import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';
import { filter, map, take, timeout, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Admin Guard Check:', {
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.currentUser(),
    hasToken: !!authService.getToken(),
  });

  // Check if token exists first
  const token = authService.getToken();
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user is already loaded
  const currentUser = authService.currentUser();
  if (currentUser) {
    // User is already loaded, check role immediately
    if (currentUser.role === Role.ADMIN) {
      console.log('✓ Admin access granted (user already loaded)');
      return true;
    }
    console.log('❌ Access denied: User is not an admin');
    router.navigate(['/']);
    return false;
  }

  // User not loaded yet - wait for it to load (max 5 seconds)
  console.log('⏳ User not loaded yet - waiting for user data...');
  return toObservable(authService.currentUser).pipe(
    filter(user => user !== null), // Wait until user is not null
    take(1), // Take only the first non-null value
    timeout(5000), // Wait max 5 seconds
    map(user => {
      if (user && user.role === Role.ADMIN) {
        console.log('✓ Admin access granted (user loaded)');
        return true;
      }
      console.log('❌ Access denied: User is not an admin');
      router.navigate(['/']);
      return false;
    }),
    catchError(error => {
      // Timeout or other error
      console.error('❌ Failed to load user data:', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};

export const reporterGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Reporter Guard Check:', {
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.currentUser(),
    hasToken: !!authService.getToken(),
  });

  // Check if token exists first
  const token = authService.getToken();
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user is already loaded
  const currentUser = authService.currentUser();
  if (currentUser) {
    // User is already loaded, check role immediately
    if (currentUser.role === Role.ADMIN || currentUser.role === Role.REPORTER) {
      console.log('✓ Reporter/Admin access granted (user already loaded)');
      return true;
    }
    console.log('❌ Access denied: User is not an admin or reporter');
    router.navigate(['/']);
    return false;
  }

  // User not loaded yet - wait for it to load (max 5 seconds)
  console.log('⏳ User not loaded yet - waiting for user data...');
  return toObservable(authService.currentUser).pipe(
    filter(user => user !== null), // Wait until user is not null
    take(1), // Take only the first non-null value
    timeout(5000), // Wait max 5 seconds
    map(user => {
      if (user && (user.role === Role.ADMIN || user.role === Role.REPORTER)) {
        console.log('✓ Reporter/Admin access granted (user loaded)');
        return true;
      }
      console.log('❌ Access denied: User is not an admin or reporter');
      router.navigate(['/']);
      return false;
    }),
    catchError(error => {
      // Timeout or other error
      console.error('❌ Failed to load user data:', error);
      router.navigate(['/']);
      return of(false);
    })
  );
};
