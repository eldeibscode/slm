import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../ui/container.component';
import { siteConfig } from '@/config/site.config';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <section [id]="faqConfig.id" class="py-20 lg:py-32 bg-secondary-50">
      <ui-container>
        <div class="max-w-3xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Frequently asked questions
            </h2>
            <p class="text-lg text-secondary-600">Everything you need to know about UltraThink.</p>
          </div>

          <!-- FAQ Items -->
          <div class="space-y-4">
            @for (item of faqConfig.items; track item.question; let i = $index) {
              <div class="bg-white rounded-xl border border-secondary-200 overflow-hidden">
                <button
                  (click)="toggleItem(i)"
                  class="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-colors"
                >
                  <span class="font-semibold text-secondary-900 pr-4">
                    {{ item.question }}
                  </span>
                  <svg
                    [class]="
                      'w-5 h-5 text-secondary-500 flex-shrink-0 transition-transform duration-200 ' +
                      (openIndex() === i ? 'rotate-180' : '')
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  [class]="
                    'overflow-hidden transition-all duration-200 ' +
                    (openIndex() === i ? 'max-h-96' : 'max-h-0')
                  "
                >
                  <p class="px-6 pb-6 text-secondary-600 leading-relaxed">
                    {{ item.answer }}
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Contact CTA -->
          <div class="text-center mt-12">
            <p class="text-secondary-600">
              Still have questions?
              <a href="/contact" class="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </ui-container>
    </section>
  `,
})
export class FAQComponent {
  faqConfig = siteConfig.faq;
  openIndex = signal<number | null>(0);

  toggleItem(index: number) {
    this.openIndex.update(current => (current === index ? null : index));
  }
}
