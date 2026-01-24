import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { TableComponent } from '../components/ui/table.component';
import { TableConfig, TableStats } from '../components/ui/table.types';
import { FeatureService } from '../services/feature.service';
import { AuthService } from '../services/auth.service';
import { Feature } from '../models/feature.model';

@Component({
  selector: 'app-feature-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, TableComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header with Create Button -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-secondary-900 mb-2">Features</h1>
            <p class="text-secondary-600">Manage your feature cards displayed on the homepage</p>
          </div>
          <ui-button routerLink="/admin/features/create">Create New Feature</ui-button>
        </div>

        <!-- Table Component -->
        <ui-table
          [data]="allFeatures()"
          [config]="tableConfig"
          [loading]="isLoading()"
          [stats]="stats()"
        />
      </ui-container>
    </div>
  `,
})
export class FeatureManagementComponent implements OnInit {
  allFeatures = signal<Feature[]>([]);
  isLoading = signal(false);
  stats = signal<TableStats>({ total: 0, published: 0, drafts: 0 });

  tableConfig: TableConfig<Feature> = {
    columns: [
      {
        key: 'icon',
        label: 'Icon',
        type: 'text',
        valueFormatter: (item) => item.icon || '-',
      },
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        sortable: true,
        filterable: true,
        valueFormatter: (item) => item.title || '(No title)',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        valueFormatter: (item) => item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description) : '-',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        badgeVariant: (item) =>
          item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary',
        valueFormatter: (item) => item.status === 'published' ? 'Active' : item.status === 'draft' ? 'Archived' : item.status,
      },
      {
        key: 'displayOrder',
        label: 'Order',
        type: 'text',
        sortable: true,
        valueFormatter: (item) => item.displayOrder ? item.displayOrder.toString() : '-',
      },
      {
        key: 'updatedAt',
        label: 'Date',
        type: 'date',
        sortable: true,
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
        handler: (item) => this.toggleFeatureStatus(item),
      },
      {
        label: 'Edit',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
        iconOnly: true,
        color: 'text-blue-600 hover:text-blue-700',
        tooltip: 'Edit feature',
        handler: (item) => this.editFeature(item.id),
      },
      {
        label: 'Delete',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
        iconOnly: true,
        color: 'text-red-600 hover:text-red-700',
        tooltip: 'Delete feature',
        handler: (item) => this.deleteFeature(item.id),
      },
    ],
    statusFilters: [
      { value: 'all', label: 'All', color: 'bg-primary-600' },
      { value: 'published', label: 'Active', color: 'bg-green-600' },
      { value: 'draft', label: 'Archived', color: 'bg-yellow-600' },
    ],
    searchPlaceholder: 'Search by title or description...',
    searchKeys: ['title', 'description'],
    showStats: true,
    emptyMessage: 'No features yet. Create your first one!',
  };

  constructor(
    private featureService: FeatureService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFeatures();
  }

  loadFeatures() {
    this.isLoading.set(true);
    this.featureService.getAllFeatures({ pageSize: 100 }).subscribe({
      next: response => {
        this.allFeatures.set(response.features);
        this.calculateStats(response.features);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading features:', error);
        this.isLoading.set(false);
      },
    });
  }

  calculateStats(features: Feature[]) {
    this.stats.set({
      total: features.length,
      published: features.filter(f => f.status === 'published').length,
      drafts: features.filter(f => f.status === 'draft').length,
    });
  }

  toggleFeatureStatus(feature: Feature) {
    const newStatus = feature.status === 'published' ? 'draft' : 'published';
    this.featureService.updateFeature(feature.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadFeatures();
      },
      error: error => {
        console.error('Error toggling feature status:', error);
        alert('Failed to update feature status');
      },
    });
  }

  editFeature(id: number | string) {
    this.router.navigate(['/admin/features/edit', id]);
  }

  deleteFeature(id: number | string) {
    if (confirm('Are you sure you want to delete this feature?')) {
      this.featureService.deleteFeature(id).subscribe({
        next: () => {
          alert('Feature deleted successfully');
          this.loadFeatures();
        },
        error: error => {
          console.error('Error deleting feature:', error);
          alert('Failed to delete feature');
        },
      });
    }
  }
}
