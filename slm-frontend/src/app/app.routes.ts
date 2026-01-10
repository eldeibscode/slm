import { Routes } from '@angular/router';
import { publicGuard, adminGuard, reporterGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./components/auth/register.component').then(m => m.RegisterComponent),
  },

  // User profile route
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile.component').then(m => m.ProfileComponent),
  },

  // Public news routes
  {
    path: 'news',
    loadComponent: () => import('./pages/news-list.component').then(m => m.NewsListComponent),
  },
  {
    path: 'news/:slug',
    loadComponent: () => import('./pages/news-detail.component').then(m => m.NewsDetailComponent),
  },

  // Public testimonial submission
  {
    path: 'submit-testimonial',
    loadComponent: () => import('./pages/testimonial-submit.component').then(m => m.TestimonialSubmitComponent),
  },

  // Admin/Reporter news management routes
  {
    path: 'admin/news',
    canActivate: [reporterGuard],
    loadComponent: () => import('./pages/news-management.component').then(m => m.NewsManagementComponent),
  },
  {
    path: 'admin/news/create',
    canActivate: [reporterGuard],
    loadComponent: () => import('./pages/news-form.component').then(m => m.NewsFormComponent),
  },
  {
    path: 'admin/news/edit/:id',
    canActivate: [reporterGuard],
    loadComponent: () => import('./pages/news-form.component').then(m => m.NewsFormComponent),
  },

  // Admin testimonials management routes
  {
    path: 'admin/testimonials',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/testimonials-management.component').then(m => m.TestimonialsManagementComponent),
  },
  {
    path: 'admin/testimonials/create',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/testimonial-form.component').then(m => m.TestimonialFormComponent),
  },
  {
    path: 'admin/testimonials/edit/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/testimonial-form.component').then(m => m.TestimonialFormComponent),
  },

  // Admin heroes management routes
  {
    path: 'admin/heroes',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/heroes-management.component').then(m => m.HeroesManagementComponent),
  },
  {
    path: 'admin/heroes/create',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/hero-form.component').then(m => m.HeroFormComponent),
  },
  {
    path: 'admin/heroes/edit/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/hero-form.component').then(m => m.HeroFormComponent),
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-management.component').then(m => m.UserManagementComponent),
  },
];
