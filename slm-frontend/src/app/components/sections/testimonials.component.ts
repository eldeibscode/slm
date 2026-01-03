import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../ui/container.component';
import { ButtonComponent } from '../ui/button.component';
import { TestimonialsService } from '../../services/testimonials.service';
import { Testimonial } from '../../models/testimonial.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <section id="testimonials" class="py-20 lg:py-32 bg-white">
      <ui-container>
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Loved by thousands of teams
          </h2>
          <p class="text-lg text-secondary-600">
            See what our customers have to say about their experience with UltraThink.
          </p>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="grid md:grid-cols-3 gap-8">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-secondary-50 rounded-2xl p-8 animate-pulse">
                <div class="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-secondary-200 rounded w-full mb-4"></div>
                <div class="h-4 bg-secondary-200 rounded w-5/6"></div>
              </div>
            }
          </div>
        }

        <!-- Testimonials Grid with Navigation -->
        @if (!isLoading() && displayedTestimonials().length > 0) {
          <div class="relative">
            <!-- Previous Button -->
            @if (hasPrevious) {
              <button
                (click)="previousPage()"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Previous testimonials"
              >
                <svg class="w-6 h-6 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            }

            <!-- Testimonials Grid - Responsive: 1/2/3 columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (testimonial of displayedTestimonials(); track testimonial.id) {
            <div
              class="relative bg-secondary-50 rounded-2xl p-8 hover:bg-primary-50/50 transition-colors"
            >
              <!-- Quote Icon -->
              <svg
                class="absolute top-6 right-6 w-8 h-8 text-primary-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                />
              </svg>

              <!-- Stars -->
              <div class="flex gap-1 mb-4">
                @for (star of getStars(testimonial.rating); track star) {
                  <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                }
              </div>

              <!-- Quote -->
              <p class="text-secondary-700 mb-6 leading-relaxed">"{{ testimonial.quote }}"</p>

              <!-- Author -->
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold"
                >
                  {{ getInitials(testimonial.author) }}
                </div>
                <div>
                  <p class="font-semibold text-secondary-900">
                    {{ testimonial.author }}
                  </p>
                  <p class="text-sm text-secondary-500">{{ testimonial.title }}</p>
                </div>
              </div>
            </div>
          }
            </div>

            <!-- Next Button -->
            @if (hasNext) {
              <button
                (click)="nextPage()"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Next testimonials"
              >
                <svg class="w-6 h-6 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }

            <!-- Page Indicator -->
            @if (totalPages > 1) {
              <div class="flex justify-center gap-2 mt-8">
                @for (page of Array(totalPages); track page; let i = $index) {
                  <button
                    (click)="goToPage(i)"
                    class="w-2 h-2 rounded-full transition-all"
                    [class.bg-primary-600]="currentPage() === i"
                    [class.w-8]="currentPage() === i"
                    [class.bg-secondary-300]="currentPage() !== i"
                    [attr.aria-label]="'Go to page ' + (i + 1)"
                  ></button>
                }
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && allTestimonials().length === 0) {
          <div class="text-center py-12">
            <p class="text-secondary-600">No testimonials available yet</p>
          </div>
        }

        <!-- Call to Action -->
        <div class="text-center mt-12">
          <p class="text-secondary-600 mb-4">Have you used UltraThink? Share your experience!</p>
          <ui-button routerLink="/submit-testimonial">Share Your Experience</ui-button>
        </div>
      </ui-container>
    </section>
  `,
})
export class TestimonialsComponent implements OnInit {
  allTestimonials = signal<Testimonial[]>([]);
  displayedTestimonials = signal<Testimonial[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  maxPerPage = signal(6);
  Array = Array; // Make Array available in template

  constructor(private testimonialsService: TestimonialsService) {}

  ngOnInit() {
    this.updateMaxPerPage();
    this.loadTestimonials();
  }

  @HostListener('window:resize')
  onResize() {
    const oldMax = this.maxPerPage();
    this.updateMaxPerPage();

    // If max changed, update displayed testimonials
    if (oldMax !== this.maxPerPage()) {
      this.currentPage.set(0); // Reset to first page
      this.updateDisplayedTestimonials();
    }
  }

  updateMaxPerPage() {
    const width = window.innerWidth;

    if (width < 768) {
      // Small screens: 1 column × 2 rows = 2 testimonials
      this.maxPerPage.set(2);
    } else if (width < 1024) {
      // Medium screens: 2 columns × 2 rows = 4 testimonials
      this.maxPerPage.set(4);
    } else {
      // Large screens: 3 columns × 2 rows = 6 testimonials
      this.maxPerPage.set(6);
    }
  }

  loadTestimonials() {
    this.isLoading.set(true);
    this.testimonialsService.getTestimonials('published').subscribe({
      next: testimonials => {
        this.allTestimonials.set(testimonials);
        this.updateDisplayedTestimonials();
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading testimonials:', error);
        this.isLoading.set(false);
      },
    });
  }

  updateDisplayedTestimonials() {
    const start = this.currentPage() * this.maxPerPage();
    const end = start + this.maxPerPage();
    this.displayedTestimonials.set(this.allTestimonials().slice(start, end));
  }

  get totalPages(): number {
    return Math.ceil(this.allTestimonials().length / this.maxPerPage());
  }

  get hasNext(): boolean {
    return this.currentPage() < this.totalPages - 1;
  }

  get hasPrevious(): boolean {
    return this.currentPage() > 0;
  }

  nextPage() {
    if (this.hasNext) {
      this.currentPage.update(p => p + 1);
      this.updateDisplayedTestimonials();
    }
  }

  previousPage() {
    if (this.hasPrevious) {
      this.currentPage.update(p => p - 1);
      this.updateDisplayedTestimonials();
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.updateDisplayedTestimonials();
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  }
}
