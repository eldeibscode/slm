import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">
            {{ isEditMode() ? 'Edit' : 'Create New' }} Hero
          </h1>
          <p class="text-secondary-600">{{ isEditMode() ? 'Update' : 'Add' }} hero slide content</p>
        </div>

        <!-- Published Count Warning -->
        @if (!isEditMode() && publishedCount() >= 5) {
          <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>Maximum 5 published heroes reached. You can only save as Draft or Archived.</span>
            </div>
          </div>
        }

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {{ errorMessage() }}
          </div>
        }

        <!-- Success Message -->
        @if (successMessage()) {
          <div class="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg mb-6">
            {{ successMessage() }}
          </div>
        }

        <!-- Form -->
        <form [formGroup]="heroForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Main Content Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Main Content</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="title"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter hero title..."
                />
                @if (heroForm.get('title')?.invalid && heroForm.get('title')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Title is required</p>
                }
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Subtitle <span class="text-red-500">*</span>
                </label>
                <textarea
                  formControlName="subtitle"
                  rows="3"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter hero subtitle/description..."
                ></textarea>
                @if (heroForm.get('subtitle')?.invalid && heroForm.get('subtitle')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Subtitle is required</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Badge <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="badge"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., New Feature, Limited Offer"
                />
                @if (heroForm.get('badge')?.invalid && heroForm.get('badge')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Badge is required</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Social Proof <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="socialProof"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Trusted by 10,000+ users"
                />
                @if (heroForm.get('socialProof')?.invalid && heroForm.get('socialProof')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Social proof is required</p>
                }
              </div>
            </div>
          </div>

          <!-- Primary CTA Section (Optional) -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-2">Primary CTA Button</h3>
            <p class="text-sm text-secondary-500 mb-4">Optional - Leave empty to hide the primary button</p>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">Button Label</label>
                <input
                  type="text"
                  formControlName="primaryCtaLabel"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Start Free Trial"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">Button Link</label>
                <input
                  type="text"
                  formControlName="primaryCtaHref"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., #pricing or /signup"
                />
              </div>
            </div>
          </div>

          <!-- Secondary CTA Section (Optional) -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-2">Secondary CTA Button</h3>
            <p class="text-sm text-secondary-500 mb-4">Optional - Leave empty to hide the secondary button</p>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">Button Label</label>
                <input
                  type="text"
                  formControlName="secondaryCtaLabel"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Watch Demo"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">Button Link</label>
                <input
                  type="text"
                  formControlName="secondaryCtaHref"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., #demo or /tour"
                />
              </div>
            </div>
          </div>

          <!-- Display Order & Status -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Display Settings</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Display Order <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  formControlName="displayOrder"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                  min="0"
                />
                <p class="text-xs text-secondary-500 mt-2">
                  Lower numbers appear first in the carousel
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-4 pt-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="status"
                      value="draft"
                      class="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="flex items-center gap-1">
                      Draft
                      <span class="text-xs text-secondary-500">(Hidden)</span>
                    </span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="status"
                      value="published"
                      class="mr-2 text-primary-600 focus:ring-primary-500"
                      [disabled]="!isEditMode() && publishedCount() >= 5"
                    />
                    <span class="flex items-center gap-1">
                      Published
                      <span class="text-xs text-secondary-500">({{ publishedCount() }}/5)</span>
                    </span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="status"
                      value="archived"
                      class="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="flex items-center gap-1">
                      Archived
                      <span class="text-xs text-secondary-500">(Inactive)</span>
                    </span>
                  </label>
                </div>
                <p class="text-xs text-secondary-500 mt-2">
                  Only published heroes are visible on the homepage (max 5)
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <ui-button type="submit" [disabled]="heroForm.invalid || isSubmitting()">
              {{ isSubmitting() ? 'Saving...' : isEditMode() ? 'Update' : 'Create' }} Hero
            </ui-button>
            <ui-button type="button" variant="outline" (click)="cancel()">Cancel</ui-button>
          </div>
        </form>
      </ui-container>
    </div>
  `,
})
export class HeroFormComponent implements OnInit {
  heroForm: FormGroup;
  heroId = signal<number | null>(null);
  isEditMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  publishedCount = signal(0);

  constructor(
    private fb: FormBuilder,
    private heroService: HeroService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.heroForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      badge: ['', Validators.required],
      socialProof: ['', Validators.required],
      displayOrder: [0],
      primaryCtaLabel: [''],
      primaryCtaHref: [''],
      secondaryCtaLabel: [''],
      secondaryCtaHref: [''],
      status: ['draft', Validators.required],
    });
  }

  ngOnInit() {
    this.loadPublishedCount();

    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = Number(params['id']);
        this.heroId.set(id);
        this.isEditMode.set(true);
        this.loadHero(id);
      }
    });
  }

  loadPublishedCount() {
    this.heroService.getPublishedCount().subscribe({
      next: response => {
        this.publishedCount.set(response.count);
      },
      error: error => {
        console.error('Error loading published count:', error);
      },
    });
  }

  loadHero(id: number) {
    this.heroService.getHeroById(id).subscribe({
      next: hero => {
        this.heroForm.patchValue({
          title: hero.title,
          subtitle: hero.subtitle,
          badge: hero.badge,
          socialProof: hero.socialProof,
          displayOrder: hero.displayOrder,
          primaryCtaLabel: hero.primaryCtaLabel || '',
          primaryCtaHref: hero.primaryCtaHref || '',
          secondaryCtaLabel: hero.secondaryCtaLabel || '',
          secondaryCtaHref: hero.secondaryCtaHref || '',
          status: hero.status,
        });
      },
      error: error => {
        console.error('Error loading hero:', error);
        this.errorMessage.set('Failed to load hero');
      },
    });
  }

  onSubmit() {
    if (this.heroForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.heroForm.value;

    if (this.isEditMode()) {
      this.heroService.updateHero(this.heroId()!, formData).subscribe({
        next: response => {
          this.successMessage.set(response.message);
          this.isSubmitting.set(false);
          setTimeout(() => this.router.navigate(['/admin/heroes']), 1500);
        },
        error: error => {
          console.error('Error updating hero:', error);
          this.errorMessage.set(error.error?.message || error.error?.error || 'Failed to update hero');
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.heroService.createHero(formData).subscribe({
        next: response => {
          this.successMessage.set(response.message);
          this.isSubmitting.set(false);
          setTimeout(() => this.router.navigate(['/admin/heroes']), 1500);
        },
        error: error => {
          console.error('Error creating hero:', error);
          this.errorMessage.set(error.error?.message || error.error?.error || 'Failed to create hero');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/heroes']);
  }
}
