import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../ui/container.component';
import { ButtonComponent } from '../ui/button.component';
import { NewsService } from '../../services/news.service';
import { LatestReportSummary } from '../../models/news.model';

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <section id="news" class="py-20 lg:py-32 bg-secondary-50">
      <ui-container>
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Latest News & Reports
          </h2>
          <p class="text-lg text-secondary-600">
            Stay updated with our latest announcements and community insights
          </p>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
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

        <!-- News Cards Grid -->
        @if (!isLoading() && latestReports().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (report of latestReports(); track report.id) {
              <article
                class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              >
                <!-- Featured Image -->
                <a [routerLink]="['/news', report.slug]" class="block relative">
                  @if (report.featuredImage) {
                    <img
                      [src]="report.featuredImage"
                      [alt]="report.title"
                      class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  } @else {
                    <div class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <svg
                        class="w-16 h-16 text-white opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  }
                  <!-- Category Badge -->
                  @if (report.category) {
                    <span
                      class="absolute top-3 right-3 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                      [style.background-color]="report.category.color || '#22c55e'"
                    >
                      {{ report.category.name }}
                    </span>
                  }
                </a>

                <!-- Content -->
                <div class="p-6">
                  <!-- Title -->
                  <a [routerLink]="['/news', report.slug]">
                    <h3
                      class="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2"
                    >
                      {{ report.title }}
                    </h3>
                  </a>

                  <!-- Excerpt -->
                  <p class="text-secondary-600 mb-4 line-clamp-3">
                    {{ report.excerpt }}
                  </p>

                  <!-- Date -->
                  <div class="text-sm text-secondary-500">
                    {{ formatDate(report.publishedAt) }}
                  </div>
                </div>
              </article>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && latestReports().length === 0) {
          <div class="text-center py-12">
            <svg
              class="w-16 h-16 text-secondary-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p class="text-secondary-600">No news reports available yet</p>
          </div>
        }

        <!-- View All Button -->
        @if (!isLoading() && latestReports().length > 0) {
          <div class="text-center mt-12">
            <ui-button routerLink="/news" size="lg">
              Alle Nachrichten
              <svg
                class="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </ui-button>
          </div>
        }
      </ui-container>
    </section>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class NewsSectionComponent implements OnInit {
  latestReports = signal<LatestReportSummary[]>([]);
  isLoading = signal(false);

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadLatestReports();
  }

  loadLatestReports() {
    this.isLoading.set(true);
    this.newsService.getLatestReports(3).subscribe({
      next: reports => {
        console.log('Latest reports loaded:', reports);
        this.latestReports.set(reports);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading latest reports:', error);
        this.isLoading.set(false);
      },
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
