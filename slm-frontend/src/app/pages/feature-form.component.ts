import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { FeatureService } from '../services/feature.service';
import { Feature } from '../models/feature.model';

@Component({
  selector: 'app-feature-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <div class="max-w-2xl mx-auto">
          <h1 class="text-4xl font-bold text-secondary-900 mb-8">
            {{ isEditMode ? 'Edit Feature' : 'Create Feature' }}
          </h1>

          <form [formGroup]="featureForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Icon Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Icon
                <span class="text-xs font-normal text-secondary-500 ml-2">(optional)</span>
              </label>
              <select
                formControlName="icon"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select an icon</option>
                <option value="zap">Zap (Lightning)</option>
                <option value="shield">Shield (Security)</option>
                <option value="bar-chart-3">Bar Chart (Analytics)</option>
                <option value="users">Users (Team)</option>
                <option value="globe">Globe (Global)</option>
                <option value="sparkles">Sparkles (AI/Magic)</option>
              </select>
              <p class="mt-2 text-xs text-secondary-500">Choose an icon to display with the feature</p>
            </div>

            <!-- Title Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Title
                <span class="text-xs font-normal text-secondary-500 ml-2">(optional)</span>
              </label>
              <input
                type="text"
                formControlName="title"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter feature title"
              />
            </div>

            <!-- Description Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Description
                <span class="text-xs font-normal text-secondary-500 ml-2">(optional)</span>
              </label>
              <textarea
                formControlName="description"
                rows="4"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the feature"
              ></textarea>
            </div>

            <!-- Display Order & Status -->
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <!-- Display Order -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Display Order
                  <span class="text-xs font-normal text-secondary-500 ml-2">(optional)</span>
                </label>
                <input
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  formControlName="displayOrder"
                  class="w-full md:w-48 px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Auto"
                  (keydown)="onDisplayOrderKeyDown($event)"
                  (input)="onDisplayOrderInput($event)"
                />
                <p class="mt-2 text-xs text-secondary-500">
                  Lower numbers appear first. Leave empty for default date-based ordering.
                </p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Status
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="status"
                      value="draft"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                    />
                    <span class="ml-2 text-sm text-secondary-700">Archived</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="status"
                      value="published"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                    />
                    <span class="ml-2 text-sm text-secondary-700">Active</span>
                  </label>
                </div>
                <p class="mt-2 text-xs text-secondary-500">
                  Archived features are not visible on the homepage. Active features are visible to everyone.
                </p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-4">
              <ui-button type="button" routerLink="/admin/features" variant="outline">
                Cancel
              </ui-button>
              <ui-button type="submit" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Feature' : 'Create Feature') }}
              </ui-button>
            </div>
          </form>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </ui-container>
    </div>
  `,
})
export class FeatureFormComponent implements OnInit {
  featureForm!: FormGroup;
  isEditMode = false;
  featureId?: number | string;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private featureService: FeatureService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.featureId = params['id'];
        this.loadFeature(params['id']);
      }
    });
  }

  initForm() {
    this.featureForm = this.fb.group({
      icon: [''],
      title: [''],
      description: [''],
      displayOrder: [null],
      status: ['draft'],
    });
  }

  loadFeature(id: string) {
    this.featureService.getFeatureById(id).subscribe({
      next: (feature: Feature) => {
        this.featureForm.patchValue({
          icon: feature.icon || '',
          title: feature.title || '',
          description: feature.description || '',
          displayOrder: feature.displayOrder || null,
          status: feature.status,
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load feature';
        console.error('Error loading feature:', error);
      }
    });
  }

  private navigateToManagement() {
    this.isSubmitting = false;
    setTimeout(() => {
      this.router.navigate(['/admin/features']);
    }, 1500);
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Handle displayOrder: convert empty string or 0 to clear value
    const displayOrderValue = this.featureForm.value.displayOrder;
    const displayOrder = displayOrderValue && displayOrderValue > 0 ? displayOrderValue : (this.isEditMode ? 0 : undefined);

    const formData = {
      icon: this.featureForm.value.icon || undefined,
      title: this.featureForm.value.title || undefined,
      description: this.featureForm.value.description || undefined,
      displayOrder: displayOrder,
      status: this.featureForm.value.status,
    };

    if (this.isEditMode && this.featureId) {
      // UPDATE
      this.featureService.updateFeature(this.featureId, formData).subscribe({
        next: () => {
          this.successMessage = 'Feature updated successfully!';
          this.navigateToManagement();
        },
        error: (error) => {
          this.handleSubmitError(error);
        }
      });
    } else {
      // CREATE
      this.featureService.createFeature(formData).subscribe({
        next: () => {
          this.successMessage = 'Feature created successfully!';
          this.navigateToManagement();
        },
        error: (error) => {
          this.handleSubmitError(error);
        }
      });
    }
  }

  private handleSubmitError(error: any) {
    console.error('Error saving feature:', error);

    if (error.status === 0) {
      this.errorMessage = 'Unable to connect to the server. Please ensure the backend API is running.';
    } else if (error.status === 401) {
      this.errorMessage = 'Authentication required. Please log in first.';
    } else if (error.status === 403) {
      this.errorMessage = 'Permission denied. You do not have access to manage features.';
    } else if (error.status === 404) {
      this.errorMessage = 'API endpoint not found. The backend may not be properly configured.';
    } else if (error.status === 422 || error.status === 400) {
      const validationErrors = error.error?.message || error.error?.errors || 'Invalid data provided';
      this.errorMessage = `Validation error: ${validationErrors}`;
    } else if (error.status >= 500) {
      this.errorMessage = 'Server error. Please try again later or contact support.';
    } else {
      this.errorMessage = error.error?.message || 'Failed to save feature. Please try again.';
    }

    this.isSubmitting = false;
  }

  // Allow only numeric input for display order
  onDisplayOrderKeyDown(event: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }
    // Block if not a number
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Sanitize pasted content and ensure only numbers
  onDisplayOrderInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.featureForm.get('displayOrder')?.setValue(sanitized ? parseInt(sanitized, 10) : null);
    }
  }
}
