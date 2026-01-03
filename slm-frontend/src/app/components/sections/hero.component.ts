import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../ui/container.component';
import { ButtonComponent } from '../ui/button.component';
import { BadgeComponent } from '../ui/badge.component';
import { siteConfig } from '@/config/site.config';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ContainerComponent, ButtonComponent, BadgeComponent],
  template: `
    <section [id]="heroConfig.id" class="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <!-- Background Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 -z-10"
      ></div>
      <div
        class="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-full blur-3xl -z-10"
      ></div>

      <ui-container>
        <div class="relative">
          <!-- Carousel Container -->
          <div class="max-w-4xl mx-auto text-center relative">
            <!-- Carousel Items -->
            @for (item of heroConfig.items; track $index; let i = $index) {
              <div
                [class]="
                  'transition-all duration-700 ease-in-out ' +
                  (currentIndex() === i
                    ? 'opacity-100 translate-x-0 relative'
                    : 'opacity-0 absolute inset-0 pointer-events-none ' +
                      (currentIndex() > i ? '-translate-x-full' : 'translate-x-full'))
                "
              >
                <!-- Badge -->
                @if (item.badge) {
                  <ui-badge class="mb-6">{{ item.badge }}</ui-badge>
                }

                <!-- Headline -->
                <h1
                  class="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 tracking-tight mb-6"
                >
                  {{ item.title }}
                </h1>

                <!-- Subheadline -->
                <p
                  class="text-lg sm:text-xl text-secondary-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  {{ item.subtitle }}
                </p>

                <!-- CTAs -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <ui-button size="lg" class="group">
                    {{ item.primaryCTA.label }}
                    <svg
                      class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  <ui-button variant="outline" size="lg" class="group">
                    <svg class="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ item.secondaryCTA.label }}
                  </ui-button>
                </div>

                <!-- Social Proof -->
                <div
                  class="flex flex-col sm:flex-row items-center justify-center gap-4 text-secondary-600"
                >
                  <div class="flex -space-x-2">
                    @for (i of [1, 2, 3, 4, 5]; track i) {
                      <div
                        class="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-primary-600"
                      ></div>
                    }
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex">
                      @for (i of [1, 2, 3, 4, 5]; track i) {
                        <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          />
                        </svg>
                      }
                    </div>
                    <span class="text-sm font-medium">{{ item.socialProof }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Navigation Buttons -->
          @if (heroConfig.items.length > 1) {
            <div
              class="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none"
            >
              <button
                (click)="previousSlide()"
                class="pointer-events-auto w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-secondary-900 hover:text-primary-600 transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                (click)="nextSlide()"
                class="pointer-events-auto w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-secondary-900 hover:text-primary-600 transition-all hover:scale-110"
                aria-label="Next slide"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          }

          <!-- Dot Indicators -->
          @if (heroConfig.items.length > 1) {
            <div class="flex justify-center gap-2 mt-8">
              @for (item of heroConfig.items; track $index; let i = $index) {
                <button
                  (click)="goToSlide(i)"
                  [class]="
                    'transition-all duration-300 rounded-full ' +
                    (currentIndex() === i
                      ? 'w-8 h-3 bg-primary-600'
                      : 'w-3 h-3 bg-secondary-300 hover:bg-secondary-400')
                  "
                  [attr.aria-label]="'Go to slide ' + (i + 1)"
                ></button>
              }
            </div>
          }
        </div>

        <!-- Hero Image Placeholder -->
        <div class="mt-16 relative">
          <!-- Decorative blur -->
          <div
            class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-primary-500/20 blur-3xl rounded-full"
          ></div>
        </div>
      </ui-container>
    </section>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  heroConfig = siteConfig.hero;
  currentIndex = signal(0);
  private autoPlayInterval: any;
  private autoPlayDelay = 5000; // 5 seconds

  ngOnInit(): void {
    if (this.heroConfig.items.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  nextSlide(): void {
    this.stopAutoPlay();
    this.currentIndex.update(index => (index === this.heroConfig.items.length - 1 ? 0 : index + 1));
    this.startAutoPlay();
  }

  previousSlide(): void {
    this.stopAutoPlay();
    this.currentIndex.update(index => (index === 0 ? this.heroConfig.items.length - 1 : index - 1));
    this.startAutoPlay();
  }

  goToSlide(index: number): void {
    this.stopAutoPlay();
    this.currentIndex.set(index);
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    if (this.heroConfig.items.length > 1) {
      this.autoPlayInterval = setInterval(() => {
        this.currentIndex.update(index =>
          index === this.heroConfig.items.length - 1 ? 0 : index + 1
        );
      }, this.autoPlayDelay);
    }
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
