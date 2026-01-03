import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../ui/container.component';
import { ButtonComponent } from '../../ui/button.component';
import { siteConfig } from '@/config/site.config';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ContainerComponent, ButtonComponent],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent {
  pricingConfig = siteConfig.pricing;
  plans = siteConfig.pricing.plans;
  isAnnual = signal(true);

  getPrice(plan: (typeof this.plans)[0]): string {
    const price = this.isAnnual() ? plan.price.annually : plan.price.monthly;
    return '$' + price;
  }

  getToggleClass(forAnnual: boolean): string {
    const base = 'px-4 py-2 rounded-full text-sm font-medium transition-all';
    const active = 'bg-primary-600 text-white';
    const inactive = 'text-secondary-600 hover:text-secondary-900';
    return `${base} ${this.isAnnual() === forAnnual ? active : inactive}`;
  }

  getCardClass(highlighted: boolean): string {
    const base = 'relative rounded-2xl p-8 transition-all duration-300';
    if (highlighted) {
      return `${base} bg-primary-600 text-primary-970 scale-105 shadow-xl `;
    }
    return `${base} bg-white border border-secondary-200 hover:border-primary-200 hover:shadow-lg`;
  }

  getTitleClass(highlighted: boolean): string {
    return `text-xl font-semibold mb-2 ${highlighted ? 'text-primary-970' : 'text-secondary-900'}`;
  }

  getDescClass(highlighted: boolean): string {
    return `text-sm ${highlighted ? 'text-primary-100' : 'text-secondary-500'}`;
  }

  getPriceClass(highlighted: boolean): string {
    return `text-4xl font-bold ${highlighted ? 'text-white' : 'text-secondary-900'}`;
  }

  getPeriodClass(highlighted: boolean): string {
    return `text-sm ${highlighted ? 'text-primary-100' : 'text-secondary-500'}`;
  }

  getCheckClass(highlighted: boolean): string {
    return `w-5 h-5 flex-shrink-0 mt-0.5 ${highlighted ? 'text-primary-200' : 'text-primary-600'}`;
  }

  getFeatureClass(highlighted: boolean): string {
    return `text-sm ${highlighted ? 'text-primary-970' : 'text-secondary-600'}`;
  }

  getButtonClass(highlighted: boolean): string {
    if (highlighted) {
      return 'w-full bg-white text-primary-600 hover:bg-primary-50';
    }
    return 'w-full';
  }
}
