import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { BadgeComponent } from '../components/ui/badge.component';
import { NewsService } from '../services/news.service';
import { Report } from '../models/news.model';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-white py-24">
      <ui-container>
        @if (isLoading()) {
          <div class="max-w-4xl mx-auto animate-pulse">
            <div class="h-4 bg-secondary-200 rounded w-1/4 mb-6"></div>
            <div class="h-12 bg-secondary-200 rounded mb-6"></div>
            <div class="h-64 bg-secondary-200 rounded mb-8"></div>
            <div class="space-y-4">
              <div class="h-4 bg-secondary-200 rounded"></div>
              <div class="h-4 bg-secondary-200 rounded"></div>
              <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
            </div>
          </div>
        }

        @if (!isLoading() && report()) {
          <!-- Breadcrumb -->
          <nav class="text-sm mb-6">
            <a routerLink="/news" class="text-primary-600 hover:text-primary-700">News</a>
            <span class="text-secondary-400 mx-2">/</span>
            <span class="text-secondary-600">{{ report()!.title }}</span>
          </nav>

          <!-- Article Header -->
          <header class="max-w-4xl mx-auto mb-8">
            @if (report()!.category) {
              <ui-badge variant="primary" class="mb-4">{{ report()!.category!.name }}</ui-badge>
            }
            <h1 class="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              {{ report()!.title }}
            </h1>
            <div class="flex items-center gap-4 text-secondary-600">
              <span>By {{ report()!.author.name }}</span>
              <span>•</span>
              <time>{{ formatDate(report()!.publishedAt) }}</time>
              <span>•</span>
              <span>{{ report()!.viewCount }} views</span>
            </div>
          </header>

          <!-- Featured Image -->
          @if (report()!.featuredImage) {
            <div class="max-w-4xl mx-auto mb-12">
              <img
                [src]="report()!.featuredImage"
                [alt]="report()!.title"
                class="w-full rounded-2xl"
              />
            </div>
          }

          <!-- All Images Gallery -->
          @if (report()!.images && report()!.images.length > 0) {
            <div class="max-w-4xl mx-auto mb-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (image of report()!.images; track image.id) {
                  <div class="relative group">
                    <img
                      [src]="image.url"
                      [alt]="image.alt"
                      class="w-full h-64 object-cover rounded-lg"
                    />
                    @if (image.caption) {
                      <p class="text-sm text-secondary-600 mt-2">{{ image.caption }}</p>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- Article Content -->
          <article
            class="max-w-4xl mx-auto prose prose-lg prose-secondary"
            [innerHTML]="sanitizedContent()"
          ></article>

          <!-- Tags -->
          @if (report()!.tags.length > 0) {
            <div class="max-w-4xl mx-auto mt-8 pt-8 border-t">
              <h3 class="text-sm font-medium text-secondary-600 mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                @for (tag of report()!.tags; track tag.id) {
                  <ui-badge variant="secondary">{{ tag.name }}</ui-badge>
                }
              </div>
            </div>
          }

          <!-- Back Button -->
          <div class="max-w-4xl mx-auto mt-12">
            <ui-button variant="outline" routerLink="/news">← Zurück</ui-button>
          </div>
        }

        @if (!isLoading() && !report()) {
          <div class="text-center py-16">
            <h2 class="text-2xl font-bold text-secondary-900 mb-4">Report not found</h2>
            <p class="text-secondary-600 mb-6">The report you're looking for doesn't exist</p>
            <ui-button routerLink="/news">Alle Nachrichten</ui-button>
          </div>
        }
      </ui-container>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .prose {
        color: #374151;
      }
      :host ::ng-deep .prose h2 {
        font-size: 1.875rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      :host ::ng-deep .prose p {
        margin-bottom: 1.25rem;
        line-height: 1.75;
      }
    `,
  ],
})
export class NewsDetailComponent implements OnInit {
  report = signal<Report | null>(null);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadReport(slug);
      }
    });
  }

  loadReport(slug: string) {
    this.isLoading.set(true);
    this.newsService.getReportBySlug(slug).subscribe({
      next: report => {
        this.report.set(report);
        this.isLoading.set(false);
        // Increment view count after loading report
        if (report.id) {
          this.newsService.incrementViewCount(report.id).subscribe({
            error: err => console.error('Failed to increment view count:', err),
          });
        }
      },
      error: error => {
        console.error('Error loading report:', error);
        this.isLoading.set(false);
      },
    });
  }

  sanitizedContent(): SafeHtml {
    const content = this.report()?.content || '';
    return this.sanitizer.sanitize(1, content) || '';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
