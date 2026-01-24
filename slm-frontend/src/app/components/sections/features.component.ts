import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../ui/container.component';
import { FeatureService } from '../../services/feature.service';
import { Feature } from '../../models/feature.model';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <!-- Only show section if there are published features -->
    @if (!isLoading() && features().length > 0) {
      <section id="features" class="py-20 lg:py-32 bg-white">
        <ui-container>
          <!-- Section Header -->
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Everything you need to think smarter
            </h2>
            <p class="text-lg text-secondary-600">
              Powerful features designed to help you make better decisions faster. Built for teams of
              all sizes.
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (feature of features(); track feature.id) {
              <div
                class="group p-6 rounded-2xl border border-secondary-100 hover:border-primary-100 hover:bg-primary-50/50 transition-all duration-300"
              >
                <!-- Icon - only show if icon is set -->
                @if (feature.icon) {
                  <div
                    class="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors"
                  >
                    <ng-container [ngSwitch]="feature.icon">
                      <svg
                        *ngSwitchCase="'zap'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <svg
                        *ngSwitchCase="'shield'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <svg
                        *ngSwitchCase="'bar-chart-3'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <svg
                        *ngSwitchCase="'users'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <svg
                        *ngSwitchCase="'globe'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <svg
                        *ngSwitchCase="'sparkles'"
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <svg
                        *ngSwitchDefault
                        class="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </ng-container>
                  </div>
                }

                <!-- Title - only show if title is set -->
                @if (feature.title) {
                  <h3 class="text-xl font-semibold text-secondary-900 mb-2">
                    {{ feature.title }}
                  </h3>
                }

                <!-- Description - only show if description is set -->
                @if (feature.description) {
                  <p class="text-secondary-600 leading-relaxed">
                    {{ feature.description }}
                  </p>
                }
              </div>
            }
          </div>
        </ui-container>
      </section>
    }

    <!-- Loading State -->
    @if (isLoading()) {
      <section id="features" class="py-20 lg:py-32 bg-white">
        <ui-container>
          <div class="text-center max-w-3xl mx-auto mb-16">
            <div class="h-10 bg-secondary-200 rounded w-2/3 mx-auto mb-4 animate-pulse"></div>
            <div class="h-6 bg-secondary-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="p-6 rounded-2xl border border-secondary-100 animate-pulse">
                <div class="w-12 h-12 rounded-xl bg-secondary-200 mb-4"></div>
                <div class="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-secondary-200 rounded w-full mb-1"></div>
                <div class="h-4 bg-secondary-200 rounded w-5/6"></div>
              </div>
            }
          </div>
        </ui-container>
      </section>
    }
  `,
})
export class FeaturesComponent implements OnInit {
  features = signal<Feature[]>([]);
  isLoading = signal(false);

  constructor(private featureService: FeatureService) {}

  ngOnInit() {
    this.loadFeatures();
  }

  loadFeatures() {
    this.isLoading.set(true);
    this.featureService.getPublishedFeatures().subscribe({
      next: features => {
        console.log('Features loaded:', features);
        this.features.set(features);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading features:', error);
        this.isLoading.set(false);
      },
    });
  }
}
