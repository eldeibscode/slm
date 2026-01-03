import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { TableComponent } from '../components/ui/table.component';
import { TableConfig, TableStats } from '../components/ui/table.types';
import { TestimonialsService } from '../services/testimonials.service';
import { Testimonial } from '../models/testimonial.model';

@Component({
  selector: 'app-testimonials-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, TableComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header with Create Button -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-secondary-900 mb-2">Testimonials</h1>
            <p class="text-secondary-600">Manage customer testimonials</p>
          </div>
          <ui-button routerLink="/admin/testimonials/create">Create New Testimonial</ui-button>
        </div>

        <!-- Table Component -->
        <ui-table
          [data]="allTestimonials()"
          [config]="tableConfig"
          [loading]="isLoading()"
          [stats]="stats()"
        />
      </ui-container>
    </div>
  `,
})
export class TestimonialsManagementComponent implements OnInit {
  allTestimonials = signal<Testimonial[]>([]);
  isLoading = signal(false);
  stats = signal<TableStats>({ total: 0, published: 0, drafts: 0 });

  tableConfig: TableConfig<Testimonial> = {
    columns: [
      {
        key: 'order',
        label: 'Order',
        type: 'text',
        sortable: true,
        width: '100px',
      },
      {
        key: 'quote',
        label: 'Quote',
        type: 'text',
        filterable: true,
        valueFormatter: (item) => item.quote.slice(0, 60) + '...',
      },
      {
        key: 'author',
        label: 'Author',
        type: 'text',
        sortable: true,
        filterable: true,
      },
      {
        key: 'rating',
        label: 'Rating',
        type: 'text',
        sortable: true,
        valueFormatter: (item) => '⭐'.repeat(item.rating),
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        badgeVariant: (item) =>
          item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary',
        valueFormatter: (item) => item.status === 'published' ? 'Active' : item.status === 'draft' ? 'Archived' : item.status,
      },
    ],
    actions: [
      {
        label: 'Toggle Status',
        icon: (item: any) => item.status === 'published'
          ? '<svg class="w-8 h-6" viewBox="0 0 36 24" fill="none"><rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-green-500"/><circle cx="24" cy="12" r="6" fill="white"/></svg>'
          : '<svg class="w-8 h-6" viewBox="0 0 36 24" fill="none"><rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-gray-300"/><circle cx="12" cy="12" r="6" fill="white"/></svg>',
        iconOnly: true,
        color: '',
        tooltip: (item: any) => item.status === 'published' ? 'Click to archive' : 'Click to activate',
        handler: (item) => this.toggleTestimonialStatus(item),
      },
      {
        label: 'Edit',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
        iconOnly: true,
        color: 'text-blue-600 hover:text-blue-700',
        tooltip: 'Edit testimonial',
        handler: (item) => this.editTestimonial(item.id),
      },
      {
        label: 'Delete',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
        iconOnly: true,
        color: 'text-red-600 hover:text-red-700',
        tooltip: 'Delete testimonial',
        handler: (item) => this.deleteTestimonial(item.id),
      },
    ],
    statusFilters: [
      { value: 'all', label: 'All', color: 'bg-primary-600' },
      { value: 'published', label: 'Active', color: 'bg-green-600' },
      { value: 'draft', label: 'Archived', color: 'bg-yellow-600' },
    ],
    searchPlaceholder: 'Search by author, quote, title, or company...',
    searchKeys: ['author', 'quote', 'title', 'company'],
    showStats: true,
    emptyMessage: 'No testimonials yet. Create your first one!',
  };

  constructor(
    private testimonialsService: TestimonialsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.isLoading.set(true);

    // Load all testimonials (not just published)
    Promise.all([
      this.testimonialsService.getTestimonials('published').toPromise(),
      this.testimonialsService.getTestimonials('draft').toPromise(),
    ])
      .then(([published, drafts]) => {
        const allTestimonials = [...(published || []), ...(drafts || [])];
        this.allTestimonials.set(allTestimonials);
        this.calculateStats(allTestimonials);
        this.isLoading.set(false);
      })
      .catch(error => {
        console.error('Error loading testimonials:', error);
        this.isLoading.set(false);
      });
  }

  calculateStats(testimonials: Testimonial[]) {
    this.stats.set({
      total: testimonials.length,
      published: testimonials.filter(t => t.status === 'published').length,
      drafts: testimonials.filter(t => t.status === 'draft').length,
    });
  }

  toggleTestimonialStatus(testimonial: any) {
    const newStatus = testimonial.status === 'published' ? 'draft' : 'published';
    this.testimonialsService.updateTestimonial(testimonial.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: error => {
        console.error('Error toggling testimonial status:', error);
        alert('Failed to update testimonial status');
      },
    });
  }

  publishTestimonial(id: number) {
    this.testimonialsService.updateTestimonial(id, { status: 'published' }).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: error => {
        console.error('Error publishing testimonial:', error);
        alert('Failed to publish testimonial');
      },
    });
  }

  unpublishTestimonial(id: number) {
    this.testimonialsService.updateTestimonial(id, { status: 'draft' }).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: error => {
        console.error('Error unpublishing testimonial:', error);
        alert('Failed to unpublish testimonial');
      },
    });
  }

  editTestimonial(id: number) {
    this.router.navigate(['/admin/testimonials/edit', id]);
  }

  deleteTestimonial(id: number) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      this.testimonialsService.deleteTestimonial(id).subscribe({
        next: () => {
          alert('Testimonial deleted successfully');
          this.loadTestimonials();
        },
        error: error => {
          console.error('Error deleting testimonial:', error);
          alert('Failed to delete testimonial');
        },
      });
    }
  }
}
