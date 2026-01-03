import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../components/sections/hero.component';
import { MawaqitComponent } from '../components/sections/mawaqit.component';
import { FeaturesComponent } from '../components/sections/features.component';
import { PricingComponent } from '../components/sections/pricing/pricing.component';
import { TestimonialsComponent } from '../components/sections/testimonials.component';
import { FAQComponent } from '../components/sections/faq.component';
import { NewsSectionComponent } from '../components/sections/news-section.component';
import { CTAComponent } from '../components/sections/cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    MawaqitComponent,
    FeaturesComponent,
    PricingComponent,
    TestimonialsComponent,
    FAQComponent,
    NewsSectionComponent,
    CTAComponent,
  ],
  template: `
    <app-hero />
    <app-mawaqit />
    <app-features />
    <app-pricing />
    <app-news-section />
    <app-testimonials />
    <app-faq />
    <app-cta />
  `,
})
export class HomeComponent {}
