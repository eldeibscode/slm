import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../components/ui/container.component';

@Component({
  selector: 'app-kontakt',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 md:p-12">
            <h1 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">Kontakt / Impressum</h1>
            <img
              src="/assets/kontakt.jpg"
              alt="Kontakt und Impressum - Salam Förderverein e.V."
              class="w-full h-auto"
            />
          </div>
        </div>
      </ui-container>
    </div>
  `,
})
export class KontaktComponent {}
