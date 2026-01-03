import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { TestimonialsService } from '../services/testimonials.service';

@Component({
  selector: 'app-testimonial-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <div class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-secondary-900 mb-4">Share Your Experience</h1>
            <p class="text-lg text-secondary-600">
              We'd love to hear about your experience with UltraThink. Your feedback helps us improve!
            </p>
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
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div>
                  <p class="font-semibold">{{ successMessage() }}</p>
                  <p class="text-sm mt-1">
                    Thank you for your feedback! Our team will review it shortly.
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Form -->
          @if (!successMessage()) {
            <form [formGroup]="testimonialForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Quote -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Your Testimonial <span class="text-red-500">*</span>
                </label>
                <textarea
                  formControlName="quote"
                  rows="5"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your experience with UltraThink..."
                ></textarea>
                @if (testimonialForm.get('quote')?.invalid && testimonialForm.get('quote')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Please share your experience</p>
                }
              </div>

              <!-- Personal Info -->
              <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">
                      Your Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="author"
                      class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John Doe"
                    />
                    @if (testimonialForm.get('author')?.invalid && testimonialForm.get('author')?.touched) {
                      <p class="text-red-500 text-sm mt-1">Name is required</p>
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
                      placeholder="CEO, Manager, Developer, etc."
                    />
                    @if (testimonialForm.get('title')?.invalid && testimonialForm.get('title')?.touched) {
                      <p class="text-red-500 text-sm mt-1">Job title is required</p>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Company <span class="text-secondary-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    formControlName="company"
                    class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              <!-- Rating -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <label class="block text-sm font-medium text-secondary-900 mb-3">
                  Rating <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <button
                      type="button"
                      (click)="setRating(star)"
                      class="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg
                        class="w-10 h-10 transition-colors"
                        [class.text-yellow-400]="star <= testimonialForm.get('rating')?.value"
                        [class.text-secondary-300]="star > testimonialForm.get('rating')?.value"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </button>
                  }
                </div>
                <p class="text-sm text-secondary-500 mt-2">
                  Click to rate ({{ testimonialForm.get('rating')?.value }} star{{
                    testimonialForm.get('rating')?.value !== 1 ? 's' : ''
                  }})
                </p>
              </div>

              <!-- Privacy Notice -->
              <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p class="text-sm text-secondary-700">
                  <strong>Privacy Notice:</strong> Your testimonial will be reviewed by our team before being
                  published. We respect your privacy and will only display the information you provide here.
                </p>
              </div>

              <!-- Actions -->
              <div class="flex gap-4">
                <ui-button type="submit" [disabled]="testimonialForm.invalid || isSubmitting()" class="flex-1">
                  {{ isSubmitting() ? 'Submitting...' : 'Submit Testimonial' }}
                </ui-button>
                <ui-button type="button" variant="outline" (click)="goHome()">Cancel</ui-button>
              </div>
            </form>
          }

          @if (successMessage()) {
            <div class="text-center mt-8">
              <ui-button (click)="goHome()">Return to Home</ui-button>
            </div>
          }
        </div>
      </ui-container>
    </div>
  `,
})
export class TestimonialSubmitComponent {
  testimonialForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private testimonialsService: TestimonialsService,
    private router: Router
  ) {
    this.testimonialForm = this.fb.group({
      quote: ['', [Validators.required, Validators.minLength(10)]],
      author: ['', Validators.required],
      title: ['', Validators.required],
      company: [''],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  setRating(rating: number) {
    this.testimonialForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.testimonialForm.invalid) {
      Object.keys(this.testimonialForm.controls).forEach(key => {
        this.testimonialForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.testimonialForm.value;

    this.testimonialsService.createTestimonial(formData).subscribe({
      next: response => {
        this.successMessage.set('Your testimonial has been submitted successfully!');
        this.isSubmitting.set(false);
        this.testimonialForm.reset({ rating: 5 });
      },
      error: error => {
        console.error('Error submitting testimonial:', error);
        this.errorMessage.set(
          error.error?.error || 'Failed to submit testimonial. Please try again.'
        );
        this.isSubmitting.set(false);
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
