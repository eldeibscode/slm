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
            <h1 class="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">Kontakt</h1>

            <!-- Organization Name -->
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-secondary-900 mb-2">Salam Förderverein e. V.</h2>
              <p class="text-secondary-600">Sitz: Bonn</p>
            </div>

            <!-- Address -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-2">Anschrift des Vereins</h3>
              <p class="text-secondary-600">
                Drachenburgstr. 65<br />
                53179 Bonn
              </p>
            </div>

            <!-- Contact Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-2">Kontaktdaten</h3>
              <div class="space-y-2">
                <p class="text-secondary-600">
                  <span class="font-medium">E-Mail:</span>
                  <a href="mailto:info@salam-ev.de" class="text-primary-600 hover:text-primary-700 ml-2">
                    info&#64;salam-ev.de
                  </a>
                </p>
                <p class="text-secondary-600">
                  <span class="font-medium">Tel:</span>
                  <a href="tel:+4922836013280" class="text-primary-600 hover:text-primary-700 ml-2">
                    0228.36013280
                  </a>
                </p>
              </div>
            </div>

            <!-- Board Members -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-2">Vertretungsberechtigter Vorstand</h3>
              <p class="text-secondary-600 mb-4">
                Gemäß Vereinsregister gilt: Jeweils zwei Vorstandsmitglieder vertreten den Verein gemeinsam.
              </p>
              <ul class="space-y-2 text-secondary-600">
                <li><span class="font-medium">1. Vorsitzender:</span> Basel Alah Rachi</li>
                <li><span class="font-medium">Stellvertretender Vorsitzender:</span> Ghalib Alah Rachi</li>
                <li><span class="font-medium">Schriftführer und Kassenwart:</span> Talha Alah Rachi</li>
              </ul>
            </div>

            <!-- Registration -->
            <div>
              <h3 class="text-lg font-semibold text-secondary-900 mb-2">Registereintrag</h3>
              <p class="text-secondary-600">
                Eingetragen im Vereinsregister.<br />
                Amtsgericht Bonn<br />
                Registernummer: VR 9260
              </p>
            </div>
          </div>
        </div>
      </ui-container>
    </div>
  `,
})
export class KontaktComponent {}
