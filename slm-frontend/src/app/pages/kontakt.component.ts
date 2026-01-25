import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../components/ui/container.component';

@Component({
  selector: 'app-kontakt',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <ui-container>
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-secondary-200 p-4 sm:p-6 md:p-12">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-4 sm:mb-6 md:mb-8">
              Kontakt / Impressum
            </h1>
            <img
              src="/assets/kontakt.jpg"
              alt="Kontakt und Impressum - Salam Förderverein e.V."
              class="w-full h-auto max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      </ui-container>
    </div>
  `,
})
export class KontaktComponent {}
