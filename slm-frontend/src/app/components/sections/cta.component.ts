import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../ui/container.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <section class="py-20 lg:py-32 bg-primary-600 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        ></div>
      </div>

      <ui-container>
        <div class="relative text-center max-w-3xl mx-auto">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to think smarter?
          </h2>
          <p class="text-lg sm:text-xl text-primary-100 mb-10 leading-relaxed">
            Join over 10,000 teams already using UltraThink to make better decisions. Start your
            free trial today.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button class="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md bg-white text-primary-600 hover:bg-primary-50 transition-colors group">
              Get Started Free
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
            </button>
            <button class="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all">
              Schedule a Demo
            </button>
          </div>

          <p class="mt-6 text-primary-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </ui-container>
    </section>
  `,
})
export class CTAComponent {}
