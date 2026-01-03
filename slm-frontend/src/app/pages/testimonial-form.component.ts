import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { TestimonialsService } from '../services/testimonials.service';

@Component({
  selector: 'app-testimonial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">
            {{ isEditMode() ? 'Edit' : 'Create New' }} Testimonial
          </h1>
          <p class="text-secondary-600">{{ isEditMode() ? 'Update' : 'Add' }} customer testimonial</p>
        </div>

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
        <form [formGroup]="testimonialForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Quote -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-secondary-900 mb-2">
              Quote <span class="text-red-500">*</span>
            </label>
            <textarea
              formControlName="quote"
              rows="4"
              class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter the customer's testimonial quote..."
            ></textarea>
            @if (testimonialForm.get('quote')?.invalid && testimonialForm.get('quote')?.touched) {
              <p class="text-red-500 text-sm mt-1">Quote is required</p>
            }
          </div>

          <!-- Author Info -->
          <div class="bg-white rounded-lg shadow-sm p-6 grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Author Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="author"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Doe"
              />
              @if (testimonialForm.get('author')?.invalid && testimonialForm.get('author')?.touched) {
                <p class="text-red-500 text-sm mt-1">Author name is required</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Job Title <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="title"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="CEO, Director, etc."
              />
              @if (testimonialForm.get('title')?.invalid && testimonialForm.get('title')?.touched) {
                <p class="text-red-500 text-sm mt-1">Job title is required</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">Company</label>
              <input
                type="text"
                formControlName="company"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">Avatar URL</label>
              <input
                type="text"
                formControlName="avatarUrl"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <!-- Rating & Status -->
          <div class="bg-white rounded-lg shadow-sm p-6 grid md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Rating <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="rating"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option [value]="5">5 Stars</option>
                <option [value]="4">4 Stars</option>
                <option [value]="3">3 Stars</option>
                <option [value]="2">2 Stars</option>
                <option [value]="1">1 Star</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-900 mb-2">Display Order</label>
              <input
                type="number"
                formControlName="order"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="1"
                min="1"
              />
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
                    Archived
                    <span class="text-xs text-secondary-500">(Hidden)</span>
                  </span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    formControlName="status"
                    value="published"
                    class="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="flex items-center gap-1">
                    Active
                    <span class="text-xs text-secondary-500">(Public)</span>
                  </span>
                </label>
              </div>
              <p class="text-xs text-secondary-500 mt-2">
                Only active testimonials are visible to the public
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <ui-button type="submit" [disabled]="testimonialForm.invalid || isSubmitting()">
              {{ isSubmitting() ? 'Saving...' : isEditMode() ? 'Update' : 'Create' }} Testimonial
            </ui-button>
            <ui-button type="button" variant="outline" (click)="cancel()">Cancel</ui-button>
          </div>
        </form>
      </ui-container>
    </div>
  `,
})
export class TestimonialFormComponent implements OnInit {
  testimonialForm: FormGroup;
  testimonialId = signal<number | null>(null);
  isEditMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private testimonialsService: TestimonialsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.testimonialForm = this.fb.group({
      quote: ['', Validators.required],
      author: ['', Validators.required],
      title: ['', Validators.required],
      company: [''],
      rating: [5, Validators.required],
      status: ['published', Validators.required],
      order: [1],
      avatarUrl: [''],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = Number(params['id']);
        this.testimonialId.set(id);
        this.isEditMode.set(true);
        this.loadTestimonial(id);
      }
    });
  }

  loadTestimonial(id: number) {
    this.testimonialsService.getTestimonialById(id).subscribe({
      next: testimonial => {
        this.testimonialForm.patchValue({
          quote: testimonial.quote,
          author: testimonial.author,
          title: testimonial.title,
          company: testimonial.company,
          rating: testimonial.rating,
          status: testimonial.status,
          order: testimonial.order,
          avatarUrl: testimonial.avatarUrl,
        });
      },
      error: error => {
        console.error('Error loading testimonial:', error);
        this.errorMessage.set('Failed to load testimonial');
      },
    });
  }

  onSubmit() {
    if (this.testimonialForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.testimonialForm.value;

    if (this.isEditMode()) {
      this.testimonialsService.updateTestimonial(this.testimonialId()!, formData).subscribe({
        next: response => {
          this.successMessage.set(response.message);
          this.isSubmitting.set(false);
          setTimeout(() => this.router.navigate(['/admin/testimonials']), 1500);
        },
        error: error => {
          console.error('Error updating testimonial:', error);
          this.errorMessage.set(error.error?.error || 'Failed to update testimonial');
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.testimonialsService.createTestimonial(formData).subscribe({
        next: response => {
          this.successMessage.set(response.message);
          this.isSubmitting.set(false);
          setTimeout(() => this.router.navigate(['/admin/testimonials']), 1500);
        },
        error: error => {
          console.error('Error creating testimonial:', error);
          this.errorMessage.set(error.error?.error || 'Failed to create testimonial');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/testimonials']);
  }
}
