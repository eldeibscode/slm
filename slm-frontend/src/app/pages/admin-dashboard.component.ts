import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { AuthService } from '../services/auth.service';
import { TestimonialsService } from '../services/testimonials.service';
import { NewsService } from '../services/news.service';
import { ApiService } from '../services/api.service';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">Admin Panel</h1>
          <p class="text-secondary-600">Manage your platform content and users</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid md:grid-cols-4 gap-6 mb-12">
          <!-- Reports Stats -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-secondary-900 font-semibold">Reports</div>
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">All</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().reports.all }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Active</span>
                <span class="text-lg font-bold text-green-600">{{ stats().reports.active }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Archived</span>
                <span class="text-lg font-bold text-yellow-600">{{ stats().reports.archived }}</span>
              </div>
            </div>
          </div>

          <!-- Testimonials Stats -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-secondary-900 font-semibold">Testimonials</div>
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">All</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().testimonials.all }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Active</span>
                <span class="text-lg font-bold text-green-600">{{ stats().testimonials.active }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Archived</span>
                <span class="text-lg font-bold text-yellow-600">{{ stats().testimonials.archived }}</span>
              </div>
            </div>
          </div>

          <!-- Users Stats -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-secondary-900 font-semibold">Users</div>
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">All</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().users.all }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Active</span>
                <span class="text-lg font-bold text-green-600">{{ stats().users.active }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Archived</span>
                <span class="text-lg font-bold text-yellow-600">{{ stats().users.archived }}</span>
              </div>
            </div>
          </div>

          <!-- Heroes Stats -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-secondary-900 font-semibold">Hero Slides</div>
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">All</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().heroes.all }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Published</span>
                <span class="text-lg font-bold" [class]="stats().heroes.published >= 5 ? 'text-red-600' : 'text-green-600'">{{ stats().heroes.published }}/5</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Draft/Archived</span>
                <span class="text-lg font-bold text-yellow-600">{{ stats().heroes.archived }}</span>
              </div>
            </div>
          </div>

          <!-- Archived Items -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-secondary-900 font-semibold">Archived Items</div>
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Reports</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().reports.archived }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Testimonials</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().testimonials.archived }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Users</span>
                <span class="text-lg font-bold text-secondary-900">{{ stats().users.archived }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Panels -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Users Management Panel -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1">User Management</h2>
                  <p class="text-green-100">Manage platform users and permissions</p>
                </div>
                <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>

            <div class="p-6">
              <ul class="space-y-3 mb-6">
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  View all registered users
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Manage user roles & permissions
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Block or delete user accounts
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Monitor user activity
                </li>
              </ul>

              <ui-button routerLink="/admin/users" class="w-full">
                Manage Users
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </ui-button>
            </div>
          </div>

          <!-- Testimonials Management Panel -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1">Testimonials</h2>
                  <p class="text-yellow-100">Review and publish customer feedback</p>
                </div>
                <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>

            <div class="p-6">
              <ul class="space-y-3 mb-6">
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Review pending testimonials
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Publish or reject submissions
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Edit testimonial content
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Manage display order
                </li>
              </ul>

              <ui-button routerLink="/admin/testimonials" class="w-full">
                Manage Testimonials
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </ui-button>
            </div>
          </div>

          <!-- Heroes Management Panel -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1">Hero Slides</h2>
                  <p class="text-purple-100">Manage homepage hero carousel</p>
                </div>
                <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="p-6">
              <ul class="space-y-3 mb-6">
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Create and edit hero slides
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Max 5 published slides
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Manage display order
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Configure CTA buttons
                </li>
              </ul>

              <ui-button routerLink="/admin/heroes" class="w-full">
                Manage Heroes
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </ui-button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h3>
          <div class="grid md:grid-cols-4 gap-4">
            <ui-button variant="outline" routerLink="/admin/news/create">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Report
            </ui-button>
            <ui-button variant="outline" routerLink="/admin/testimonials/create">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Testimonial
            </ui-button>
            <ui-button variant="outline" routerLink="/admin/heroes/create">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Hero
            </ui-button>
            <ui-button variant="outline" routerLink="/admin/news">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              View Reports
            </ui-button>
          </div>
        </div>
      </ui-container>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  stats = signal({
    reports: {
      all: 0,
      active: 0,
      archived: 0,
    },
    testimonials: {
      all: 0,
      active: 0,
      archived: 0,
    },
    users: {
      all: 0,
      active: 0,
      archived: 0,
    },
    heroes: {
      all: 0,
      published: 0,
      archived: 0,
    },
  });

  constructor(
    private testimonialsService: TestimonialsService,
    private newsService: NewsService,
    public authService: AuthService,
    private apiService: ApiService,
    private heroService: HeroService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load testimonials stats
    Promise.all([
      this.testimonialsService.getTestimonials('published').toPromise(),
      this.testimonialsService.getTestimonials('draft').toPromise(),
    ]).then(([published, drafts]) => {
      const active = published?.length || 0;
      const archived = drafts?.length || 0;
      const all = active + archived;

      this.stats.update(s => ({
        ...s,
        testimonials: {
          all,
          active,
          archived,
        },
      }));
    });

    // Load reports stats
    this.newsService.getMyReports().subscribe({
      next: response => {
        const active = response.reports.filter(r => r.status === 'published').length;
        const archived = response.reports.filter(r => r.status === 'draft').length;
        const all = response.reports.length;

        this.stats.update(s => ({
          ...s,
          reports: {
            all,
            active,
            archived,
          },
        }));
      },
      error: error => {
        console.error('Error loading reports:', error);
      },
    });

    // Load users stats
    this.apiService.getAllUsers().subscribe({
      next: users => {
        const active = users.filter(u => !u.isArchived).length;
        const archived = users.filter(u => u.isArchived).length;
        const all = users.length;

        this.stats.update(s => ({
          ...s,
          users: {
            all,
            active,
            archived,
          },
        }));
      },
      error: error => {
        console.error('Error loading users:', error);
      },
    });

    // Load heroes stats
    this.heroService.getHeroes('all').subscribe({
      next: heroes => {
        const published = heroes.filter(h => h.status === 'published').length;
        const archived = heroes.filter(h => h.status !== 'published').length;
        const all = heroes.length;

        this.stats.update(s => ({
          ...s,
          heroes: {
            all,
            published,
            archived,
          },
        }));
      },
      error: error => {
        console.error('Error loading heroes:', error);
      },
    });
  }
}
