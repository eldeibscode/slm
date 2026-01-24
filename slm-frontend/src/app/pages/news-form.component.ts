import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { NewsService } from '../services/news.service';
import { Category, Tag, Report } from '../models/news.model';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-bold text-secondary-900 mb-8">
            {{ isEditMode ? 'Edit Report' : 'Create Report' }}
          </h1>

          <form [formGroup]="reportForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Title Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="title"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter report title"
              />
              <div *ngIf="reportForm.get('title')?.invalid && reportForm.get('title')?.touched" class="mt-1 text-sm text-red-600">
                Title is required
              </div>
            </div>

            <!-- Excerpt Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Excerpt <span class="text-red-500">*</span>
              </label>
              <textarea
                formControlName="excerpt"
                rows="3"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief summary of the report"
              ></textarea>
              <div *ngIf="reportForm.get('excerpt')?.invalid && reportForm.get('excerpt')?.touched" class="mt-1 text-sm text-red-600">
                Excerpt is required
              </div>
            </div>

            <!-- Content Field -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Content <span class="text-red-500">*</span>
              </label>
              <textarea
                formControlName="content"
                rows="12"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Write your report content here... (Markdown supported)"
              ></textarea>
              <div *ngIf="reportForm.get('content')?.invalid && reportForm.get('content')?.touched" class="mt-1 text-sm text-red-600">
                Content is required
              </div>
              <p class="mt-2 text-xs text-secondary-500">Tip: You can use Markdown formatting</p>
            </div>

            <!-- Category & Tags -->
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Category
                </label>
                <select
                  formControlName="categoryId"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Tags
                </label>
                <div class="space-y-2">
                  <div *ngFor="let tag of tags" class="flex items-center">
                    <input
                      type="checkbox"
                      [id]="'tag-' + tag.id"
                      [checked]="selectedTagIds.includes(tag.id)"
                      (change)="toggleTag(tag.id)"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <label [for]="'tag-' + tag.id" class="ml-2 text-sm text-secondary-700">
                      {{ tag.name }}
                    </label>
                  </div>
                </div>
                <p class="mt-2 text-xs text-secondary-500">Select all that apply</p>
              </div>
            </div>

            <!-- Images Upload -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-secondary-900 mb-2">
                Images
                <span class="text-xs font-normal text-secondary-500 ml-2">
                  (Click the star to set featured image)
                </span>
              </label>

              <!-- Image Previews - Grid with Badges -->
              <div *ngIf="imagesPreviews.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div *ngFor="let preview of imagesPreviews; let i = index" class="relative group">
                  <img
                    [src]="preview"
                    alt="Preview"
                    class="w-full h-32 object-cover rounded-lg border-4 transition-all"
                    [class.border-yellow-400]="isFeaturedImage(i)"
                    [class.border-transparent]="!isFeaturedImage(i)"
                  />

                  <!-- Star Button Badge (top-left) - ALWAYS VISIBLE -->
                  <button
                    type="button"
                    (click)="setFeaturedImage(i)"
                    class="absolute top-2 left-2 p-2 rounded-full transition-all duration-200 shadow-lg border-2"
                    [class.bg-yellow-400]="isFeaturedImage(i)"
                    [class.border-yellow-600]="isFeaturedImage(i)"
                    [class.bg-white]="!isFeaturedImage(i)"
                    [class.border-gray-300]="!isFeaturedImage(i)"
                    [class.hover:bg-yellow-100]="!isFeaturedImage(i)"
                    [class.hover:border-yellow-400]="!isFeaturedImage(i)"
                    [title]="isFeaturedImage(i) ? 'Featured image' : 'Click to set as featured'"
                  >
                    <!-- Filled star (featured) -->
                    <svg *ngIf="isFeaturedImage(i)" class="h-6 w-6 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <!-- Hollow star (not featured) -->
                    <svg *ngIf="!isFeaturedImage(i)" class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>

                  <!-- Featured Text Badge (bottom) -->
                  <div *ngIf="isFeaturedImage(i)" class="absolute bottom-2 left-2 right-2">
                    <span class="inline-flex items-center justify-center w-full px-3 py-1.5 text-xs font-bold text-yellow-900 bg-yellow-400 rounded-md shadow-lg">
                      ⭐ FEATURED IMAGE
                    </span>
                  </div>

                  <!-- Remove Button (top-right) -->
                  <button
                    type="button"
                    (click)="removeImage(i)"
                    class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Upload Area -->
              <div
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onDrop($event)"
                [class.border-primary-500]="isDragging"
                [class.bg-primary-50]="isDragging"
                class="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center transition-colors"
              >
                <input
                  type="file"
                  #fileInput
                  (change)="onFileSelected($event)"
                  accept="image/*"
                  multiple
                  class="hidden"
                />

                <svg class="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-secondary-600">
                  <button type="button" (click)="fileInput.click()" class="text-primary-600 hover:text-primary-500 font-medium">
                    Click to upload
                  </button>
                  or drag and drop
                </p>
                <p class="text-xs text-secondary-500">PNG, JPG, GIF up to 10MB each. Select multiple files.</p>
              </div>
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
                  type="number"
                  formControlName="displayOrder"
                  min="1"
                  class="w-full md:w-48 px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Auto"
                />
                <p class="mt-2 text-xs text-secondary-500">
                  Lower numbers appear first. Leave empty for default date-based ordering.
                </p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Status <span class="text-red-500">*</span>
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
                  Archived reports are only visible to admins and reporters. Active reports are visible to everyone.
                </p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-4">
              <ui-button type="button" routerLink="/admin/news" variant="outline">
                Cancel
              </ui-button>
              <ui-button type="submit" [disabled]="reportForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Report' : 'Create Report') }}
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
export class NewsFormComponent implements OnInit {
  reportForm!: FormGroup;
  categories: Category[] = [];
  tags: Tag[] = [];
  selectedTagIds: number[] = [];
  isEditMode = false;
  reportId?: number | string;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isDragging = false;
  imagesPreviews: string[] = [];
  imagesFiles: File[] = [];
  existingImageIds: number[] = []; // Track existing images to avoid re-uploading
  featuredImageId: number | null = null; // Track featured image ID for existing images
  newImagesFeaturedIndex: number = -1; // Track featured index for new uploads (before IDs exist)

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.loadTags();

    // Clear arrays and reset state
    this.imagesPreviews = [];
    this.imagesFiles = [];
    this.existingImageIds = [];
    this.featuredImageId = null;
    this.newImagesFeaturedIndex = -1;

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.reportId = params['id'];
        this.loadReport(params['id']);
      }
    });
  }

  initForm() {
    this.reportForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      categoryId: [''],
      status: ['draft', Validators.required],
      displayOrder: [null],
    });
  }

  loadCategories() {
    this.newsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTags() {
    this.newsService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
      }
    });
  }

  loadReport(id: string) {
    this.newsService.getReportById(id).subscribe({
      next: (report: Report) => {
        this.reportForm.patchValue({
          title: report.title,
          excerpt: report.excerpt,
          content: report.content,
          categoryId: report.category?.id || '',
          status: report.status,
          displayOrder: report.displayOrder || null,
        });
        this.selectedTagIds = report.tags.map(tag => tag.id);

        // Load existing images
        if (report.images && report.images.length > 0) {
          report.images.forEach(image => {
            // image.url already contains the full URL from backend
            this.imagesPreviews.push(image.url);
            this.existingImageIds.push(image.id);

            // Check if this image is the featured one
            if (report.featuredImageId && image.id === report.featuredImageId) {
              this.featuredImageId = image.id;
            }
          });

          // If no featured image set but images exist, default to first
          if (!this.featuredImageId && report.images.length > 0) {
            this.featuredImageId = report.images[0].id;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load report';
        console.error('Error loading report:', error);
      }
    });
  }

  toggleTag(tagId: number) {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index > -1) {
      this.selectedTagIds.splice(index, 1);
    } else {
      this.selectedTagIds.push(tagId);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => this.handleFile(file));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => this.handleFile(file));
      input.value = ''; // Reset input to allow selecting the same file again
    }
  }

  handleFile(file: File) {
    console.log('=== handleFile called ===');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file';
      console.error('Invalid file type:', file.type);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = 'Image size must be less than 10MB';
      console.error('File too large:', file.size);
      return;
    }

    this.imagesFiles.push(file);
    console.log('File added to imagesFiles. Total files:', this.imagesFiles.length);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagesPreviews.push(e.target?.result as string);
      console.log('Preview added. Total previews:', this.imagesPreviews.length);

      // If this is the first image overall, set as featured
      if (this.imagesPreviews.length === 1 && this.existingImageIds.length === 0) {
        this.newImagesFeaturedIndex = 0;
        console.log('First image set as featured. newImagesFeaturedIndex:', this.newImagesFeaturedIndex);
      }
    };
    reader.readAsDataURL(file);
  }

  setFeaturedImage(index: number) {
    // Determine if this is an existing image or new image
    if (index < this.existingImageIds.length) {
      // Existing image - set ID
      this.featuredImageId = this.existingImageIds[index];
      this.newImagesFeaturedIndex = -1;
    } else {
      // New image - set index
      this.newImagesFeaturedIndex = index - this.existingImageIds.length;
      this.featuredImageId = null;
    }
  }

  isFeaturedImage(index: number): boolean {
    if (index < this.existingImageIds.length) {
      // Check existing images
      return this.featuredImageId === this.existingImageIds[index];
    } else {
      // Check new images
      const newImageIndex = index - this.existingImageIds.length;
      return this.newImagesFeaturedIndex === newImageIndex;
    }
  }

  removeImage(index: number) {
    // Check if removed image was featured
    const wasRemovedImageFeatured = this.isFeaturedImage(index);

    // Check if this is an existing image or a new one
    if (index < this.existingImageIds.length) {
      // It's an existing image - delete from backend
      const imageId = this.existingImageIds[index];
      if (this.reportId) {
        this.newsService.deleteImage(this.reportId, imageId).subscribe({
          next: () => {
            console.log('Image deleted from backend');
            this.imagesPreviews.splice(index, 1);
            this.existingImageIds.splice(index, 1);

            // If we removed the featured image, reassign to first available
            if (wasRemovedImageFeatured) {
              if (this.imagesPreviews.length > 0) {
                // Set first remaining image as featured
                this.setFeaturedImage(0);
              } else {
                // No images left
                this.featuredImageId = null;
                this.newImagesFeaturedIndex = -1;
              }
            }
          },
          error: (error) => {
            console.error('Error deleting image:', error);
            this.errorMessage = 'Failed to delete image';
          }
        });
      }
    } else {
      // It's a new image - just remove from arrays
      this.imagesPreviews.splice(index, 1);
      // Adjust index for imagesFiles array (it only contains new files)
      const fileIndex = index - this.existingImageIds.length;
      if (fileIndex >= 0) {
        this.imagesFiles.splice(fileIndex, 1);
      }

      // If we removed the featured image, reassign to first available
      if (wasRemovedImageFeatured) {
        if (this.imagesPreviews.length > 0) {
          // Set first remaining image as featured
          this.setFeaturedImage(0);
        } else {
          // No images left
          this.featuredImageId = null;
          this.newImagesFeaturedIndex = -1;
        }
      }
    }
  }

  uploadImages(reportId: number | string) {
    // Start order from the number of existing images
    const startOrder = this.existingImageIds.length;

    const uploadObservables = this.imagesFiles.map((file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);
      formData.append('order', (startOrder + index).toString());
      return this.newsService.uploadImage(reportId, formData);
    });

    // Use forkJoin to wait for all uploads to complete
    return uploadObservables.length > 0
      ? forkJoin(uploadObservables)
      : of([]);
  }

  private navigateToManagement() {
    this.isSubmitting = false;
    setTimeout(() => {
      this.router.navigate(['/admin/news']);
    }, 1500);
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      Object.keys(this.reportForm.controls).forEach(key => {
        this.reportForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode && this.reportId) {
      // EDIT MODE
      // Handle displayOrder: convert empty string or 0 to clear value (send 0 to backend to clear)
      const displayOrderValue = this.reportForm.value.displayOrder;
      const displayOrder = displayOrderValue && displayOrderValue > 0 ? displayOrderValue : 0;

      const formData = {
        ...this.reportForm.value,
        tagIds: this.selectedTagIds,
        featuredImageId: this.featuredImageId, // Include if we have an existing image selected
        displayOrder: displayOrder, // 0 clears the order, positive number sets it
      };

      this.newsService.updateReport(this.reportId, formData).subscribe({
        next: (report) => {
          // If there are new images to upload
          if (this.imagesFiles.length > 0) {
            this.uploadImages(report.id).subscribe({
              next: (uploadResponses) => {
                // If a new image was selected as featured
                if (this.newImagesFeaturedIndex >= 0 && uploadResponses.length > this.newImagesFeaturedIndex) {
                  const newFeaturedImageId = uploadResponses[this.newImagesFeaturedIndex].image.id;

                  // Update report with new featured image
                  this.newsService.updateReport(report.id, { featuredImageId: newFeaturedImageId }).subscribe({
                    next: () => {
                      this.successMessage = 'Report updated successfully!';
                      this.navigateToManagement();
                    },
                    error: (error) => {
                      console.error('Error setting featured image:', error);
                      this.successMessage = 'Report updated but failed to set featured image.';
                      this.navigateToManagement();
                    }
                  });
                } else {
                  this.successMessage = 'Report updated successfully!';
                  this.navigateToManagement();
                }
              },
              error: (error) => {
                console.error('Error uploading images:', error);
                this.errorMessage = 'Report updated but failed to upload images.';
                this.isSubmitting = false;
              }
            });
          } else {
            this.successMessage = 'Report updated successfully!';
            this.navigateToManagement();
          }
        },
        error: (error) => {
          this.handleSubmitError(error);
        }
      });
    } else {
      // CREATE MODE
      // Handle displayOrder: only include if set
      const displayOrderValue = this.reportForm.value.displayOrder;
      const displayOrder = displayOrderValue && displayOrderValue > 0 ? displayOrderValue : undefined;

      const formData = {
        ...this.reportForm.value,
        tagIds: this.selectedTagIds,
        displayOrder: displayOrder,
        // Don't include featuredImageId on create - images don't exist yet
      };

      this.newsService.createReport(formData).subscribe({
        next: (report) => {
          // If there are images to upload
          if (this.imagesFiles.length > 0) {
            this.uploadImages(report.id).subscribe({
              next: (uploadResponses) => {
                // Determine featured image ID from uploads
                let finalFeaturedImageId = null;

                if (this.newImagesFeaturedIndex >= 0 && uploadResponses.length > this.newImagesFeaturedIndex) {
                  finalFeaturedImageId = uploadResponses[this.newImagesFeaturedIndex].image.id;
                } else if (uploadResponses.length > 0) {
                  // Default to first uploaded image
                  finalFeaturedImageId = uploadResponses[0].image.id;
                }

                // Update report with featured image ID
                if (finalFeaturedImageId) {
                  this.newsService.updateReport(report.id, { featuredImageId: finalFeaturedImageId }).subscribe({
                    next: () => {
                      this.successMessage = 'Report created successfully!';
                      this.navigateToManagement();
                    },
                    error: (error) => {
                      console.error('Error setting featured image:', error);
                      this.successMessage = 'Report created but failed to set featured image.';
                      this.navigateToManagement();
                    }
                  });
                } else {
                  this.successMessage = 'Report created successfully!';
                  this.navigateToManagement();
                }
              },
              error: (error) => {
                console.error('Error uploading images:', error);
                this.errorMessage = 'Report created but failed to upload images. You can add them by editing the report.';
                this.isSubmitting = false;
              }
            });
          } else {
            this.successMessage = 'Report created successfully!';
            this.navigateToManagement();
          }
        },
        error: (error) => {
          this.handleSubmitError(error);
        }
      });
    }
  }

  private handleSubmitError(error: any) {
    console.error('Error saving report:', error);

    // Provide more detailed error messages
    if (error.status === 0) {
      this.errorMessage = 'Unable to connect to the server. Please ensure the backend API is running on http://localhost:3000';
    } else if (error.status === 401) {
      this.errorMessage = 'Authentication required. Please log in first.';
    } else if (error.status === 403) {
      this.errorMessage = 'Permission denied. You do not have access to create reports.';
    } else if (error.status === 404) {
      this.errorMessage = 'API endpoint not found. The backend may not be properly configured.';
    } else if (error.status === 422 || error.status === 400) {
      const validationErrors = error.error?.message || error.error?.errors || 'Invalid data provided';
      this.errorMessage = `Validation error: ${validationErrors}`;
    } else if (error.status >= 500) {
      this.errorMessage = 'Server error. Please try again later or contact support.';
    } else {
      this.errorMessage = error.error?.message || 'Failed to save report. Please try again.';
    }

    this.isSubmitting = false;
  }
}
