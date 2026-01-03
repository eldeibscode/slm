import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { NewsService } from '../services/news.service';
import { Report } from '../models/news.model';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-secondary-900 mb-4">News & Reports</h1>
          <p class="text-lg text-secondary-600">Browse our latest updates and announcements</p>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div class="h-48 bg-secondary-200"></div>
                <div class="p-6">
                  <div class="h-4 bg-secondary-200 rounded w-1/4 mb-3"></div>
                  <div class="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-secondary-200 rounded w-full mb-4"></div>
                  <div class="h-3 bg-secondary-200 rounded w-1/3"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- News Grid -->
        @if (!isLoading() && reports().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (report of reports(); track report.id) {
              <article class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative">
                <a [routerLink]="['/news', report.slug]" class="block relative">
                  @if (report.featuredImage) {
                    <img [src]="report.featuredImage" [alt]="report.title" class="w-full h-48 object-cover" />
                  } @else {
                    <div class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600"></div>
                  }
                  @if (report.category) {
                    <span
                      class="absolute top-3 right-3 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                      [style.background-color]="report.category.color || '#22c55e'"
                    >
                      {{ report.category.name }}
                    </span>
                  }
                </a>
                <div class="p-6">
                  <a [routerLink]="['/news', report.slug]">
                    <h3 class="text-xl font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                      {{ report.title }}
                    </h3>
                  </a>
                  <p class="text-secondary-600 mb-4">{{ report.excerpt }}</p>
                  <div class="text-sm text-secondary-500">
                    {{ formatDate(report.publishedAt) }}
                  </div>
                </div>
              </article>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="flex justify-center items-center gap-2 mt-12">
              <ui-button
                variant="outline"
                [disabled]="currentPage() === 1"
                (click)="goToPage(currentPage() - 1)"
              >
                Previous
              </ui-button>
              <span class="text-secondary-600">Page {{ currentPage() }} of {{ totalPages() }}</span>
              <ui-button
                variant="outline"
                [disabled]="currentPage() === totalPages()"
                (click)="goToPage(currentPage() + 1)"
              >
                Next
              </ui-button>
            </div>
          }
        }

        <!-- Empty State -->
        @if (!isLoading() && reports().length === 0) {
          <div class="text-center py-16">
            <p class="text-secondary-600 text-lg">No news reports available yet</p>
            <ui-button routerLink="/" variant="outline" class="mt-6">Back to Home</ui-button>
          </div>
        }
      </ui-container>
    </div>
  `,
})
export class NewsListComponent implements OnInit {
  reports = signal<Report[]>([]);
  isLoading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading.set(true);
    // Backend uses 0-based pagination, frontend uses 1-based for display
    this.newsService.getReports({ page: this.currentPage() - 1, pageSize: 9, status: 'published' }).subscribe({
      next: response => {
        this.reports.set(response.reports);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading reports:', error);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadReports();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
