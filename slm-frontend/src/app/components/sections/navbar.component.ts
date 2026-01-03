import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../ui/container.component';
import { ButtonComponent } from '../ui/button.component';
import { siteConfig } from '@/config/site.config';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <header
      [class]="
        'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ' +
        (isScrolled() ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white/10 backdrop-blur-sm')
      "
    >
      <ui-container>
        <nav class="flex items-center justify-between h-16 lg:h-20">
          <!-- Logo -->
          <a href="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
<!--              <span class="text-white font-bold text-xl">U</span>-->
              <img [src]="config.logo" [alt]="config.name + ' logo'" class="h-10 w-auto object-contain"/>
            </div>
            <span class="font-bold text-xl text-secondary-900">{{ config.name }}</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            @for (item of config.nav; track item.href) {
              <a
                [href]="item.href"
                class="text-secondary-600 hover:text-secondary-900 font-medium transition-colors"
              >
                {{ item.label }}
              </a>
            }
          </div>

          <!-- Desktop CTAs -->
          <div class="hidden lg:flex items-center space-x-4">
            @if (authService.isAuthenticated()) {
              <!-- User Dropdown Menu -->
              <div class="relative user-menu-container">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>{{ authService.currentUser()?.email }}</span>
                  <svg class="w-4 h-4 transition-transform" [class.rotate-180]="isUserMenuOpen()" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (isUserMenuOpen()) {
                  <div
                    class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    @if (isAdminOrReporter()) {
                      <a
                        routerLink="/admin/news"
                        (click)="closeUserMenu()"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                        Manage News
                      </a>
                    }
                    @if (isAdmin()) {
                      <a
                        routerLink="/admin"
                        (click)="closeUserMenu()"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Admin Panel
                      </a>
                    }
                    <div class="border-t border-secondary-200 my-2"></div>
                    <a
                      routerLink="/profile"
                      (click)="closeUserMenu()"
                      class="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Edit Profile
                    </a>
                    <button
                      (click)="logout()"
                      class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                }
              </div>
            } @else {
              <ui-button variant="ghost" routerLink="/login">Sign In</ui-button>
              <ui-button routerLink="/register">Get Started</ui-button>
            }
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="lg:hidden p-2 rounded-lg border-2 border-secondary-900 bg-white hover:bg-secondary-50 transition-colors shadow-md relative z-10"
            (click)="toggleMobileMenu()"
            aria-label="Toggle menu"
          >
            @if (isMobileMenuOpen()) {
              <svg class="w-6 h-6 text-secondary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            } @else {
              <svg class="w-6 h-6 text-secondary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            }
          </button>
        </nav>

        <!-- Mobile Menu -->
        @if (isMobileMenuOpen()) {
          <div class="lg:hidden py-4 border-t">
            <div class="flex flex-col space-y-4">
              @for (item of config.nav; track item.href) {
                <a
                  [href]="item.href"
                  class="text-secondary-600 hover:text-secondary-900 font-medium py-2"
                  (click)="closeMobileMenu()"
                >
                  {{ item.label }}
                </a>
              }
              <div class="flex flex-col space-y-2 pt-4 border-t">
                @if (authService.isAuthenticated()) {
                  <span class="text-secondary-600 text-sm px-2">{{
                      authService.currentUser()?.email
                    }}</span>
                  @if (isAdminOrReporter()) {
                    <ui-button
                      variant="outline"
                      class="w-full"
                      routerLink="/admin/news"
                      (click)="closeMobileMenu()"
                    >Manage News
                    </ui-button
                    >
                  }
                  @if (isAdmin()) {
                    <ui-button
                      variant="outline"
                      class="w-full"
                      routerLink="/admin"
                      (click)="closeMobileMenu()"
                    >Admin Panel
                    </ui-button
                    >
                  }
                  <ui-button
                    variant="outline"
                    class="w-full"
                    routerLink="/profile"
                    (click)="closeMobileMenu()"
                  >Edit Profile
                  </ui-button
                  >
                  <ui-button variant="outline" class="w-full" (click)="logout()">Logout</ui-button>
                } @else {
                  <ui-button
                    variant="outline"
                    class="w-full"
                    routerLink="/login"
                    (click)="closeMobileMenu()"
                  >Sign In
                  </ui-button
                  >
                  <ui-button class="w-full" routerLink="/register" (click)="closeMobileMenu()"
                  >Get Started
                  </ui-button
                  >
                }
              </div>
            </div>
          </div>
        }
      </ui-container>
    </header>
  `,
})
export class NavbarComponent {
  config = siteConfig;
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  constructor(public authService: AuthService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Ignore clicks inside AG Grid popups, filters, and menus
    if (target.closest('.ag-popup') ||
        target.closest('.ag-filter') ||
        target.closest('.ag-menu') ||
        target.closest('.ag-popup-wrapper') ||
        target.closest('.ag-header-cell') ||
        target.closest('.ag-root-wrapper')) {
      return;
    }

    if (!target.closest('.user-menu-container')) {
      this.isUserMenuOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMobileMenu();
    this.closeUserMenu();
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.role === Role.ADMIN;
  }

  isAdminOrReporter(): boolean {
    const role = this.authService.currentUser()?.role;
    return role === Role.ADMIN || role === Role.REPORTER;
  }
}
