import { HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Access localStorage directly to avoid circular dependency with AuthService
  const token = isBrowser ? localStorage.getItem('auth_token') : null;

  console.log('🔐 Auth Interceptor - ULTRA DETAILED LOG');
  console.log('  ├─ URL:', req.url);
  console.log('  ├─ Method:', req.method);
  console.log('  ├─ Platform:', isBrowser ? 'Browser' : 'Server');
  console.log('  ├─ Token exists:', !!token);
  console.log('  ├─ Token preview:', token ? `${token.substring(0, 30)}...` : 'No token');
  console.log('  └─ Timestamp:', new Date().toISOString());

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Authorization header added to request');
    return next(clonedRequest);
  }

  console.log('⚠️  No token - sending request without Authorization header');
  return next(req);
};
