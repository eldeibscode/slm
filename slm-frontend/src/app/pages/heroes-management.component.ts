import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { TableComponent } from '../components/ui/table.component';
import { TableConfig, TableStats } from '../components/ui/table.types';
import { HeroService } from '../services/hero.service';
import { Hero } from '../models/hero.model';

@Component({
  selector: 'app-heroes-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ContainerComponent, ButtonComponent, TableComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header with Create Button and Published Counter -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-secondary-900 mb-2">Hero Slides</h1>
            <p class="text-secondary-600">Manage homepage hero carousel items</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Published Counter Badge -->
            <div class="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span class="text-sm text-secondary-600">Published: </span>
              <span class="font-bold" [class]="publishedCount() >= 5 ? 'text-red-600' : 'text-green-600'">
                {{ publishedCount() }}/5
              </span>
            </div>
            <ui-button routerLink="/admin/heroes/create">Create New Hero</ui-button>
          </div>
        </div>

        <!-- Warning if at max -->
        @if (publishedCount() >= 5) {
          <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>Maximum 5 published heroes reached. Archive an existing hero to publish a new one.</span>
            </div>
          </div>
        }

        <!-- Table Component -->
        <ui-table
          [data]="allHeroes()"
          [config]="tableConfig"
          [loading]="isLoading()"
          [stats]="stats()"
        />
      </ui-container>
    </div>
  `,
})
export class HeroesManagementComponent implements OnInit {
  allHeroes = signal<Hero[]>([]);
  isLoading = signal(false);
  publishedCount = signal(0);
  stats = signal<TableStats>({ total: 0, published: 0, drafts: 0 });

  tableConfig: TableConfig<Hero> = {
    columns: [
      {
        key: 'displayOrder',
        label: 'Order',
        type: 'text',
        sortable: true,
        width: '80px',
      },
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        sortable: true,
        filterable: true,
        valueFormatter: (item) => item.title.length > 40 ? item.title.slice(0, 40) + '...' : item.title,
      },
      {
        key: 'badge',
        label: 'Badge',
        type: 'text',
        filterable: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        badgeVariant: (item) =>
          item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary',
        valueFormatter: (item) =>
          item.status === 'published' ? 'Published' : item.status === 'draft' ? 'Draft' : 'Archived',
      },
    ],
    actions: [
      {
        label: 'Toggle Status',
        icon: (item: any) =>
          item.status === 'published'
            ? '<svg class="w-8 h-6" viewBox="0 0 36 24" fill="none"><rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-green-500"/><circle cx="24" cy="12" r="6" fill="white"/></svg>'
            : '<svg class="w-8 h-6" viewBox="0 0 36 24" fill="none"><rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-gray-300"/><circle cx="12" cy="12" r="6" fill="white"/></svg>',
        iconOnly: true,
        color: '',
        tooltip: (item: any) => (item.status === 'published' ? 'Click to archive' : 'Click to publish'),
        handler: (item) => this.toggleHeroStatus(item),
      },
      {
        label: 'Edit',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
        iconOnly: true,
        color: 'text-blue-600 hover:text-blue-700',
        tooltip: 'Edit hero',
        handler: (item) => this.editHero(item.id),
      },
      {
        label: 'Delete',
        icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
        iconOnly: true,
        color: 'text-red-600 hover:text-red-700',
        tooltip: 'Delete hero',
        handler: (item) => this.deleteHero(item.id),
      },
    ],
    statusFilters: [
      { value: 'all', label: 'All', color: 'bg-primary-600' },
      { value: 'published', label: 'Published', color: 'bg-green-600' },
      { value: 'draft', label: 'Draft', color: 'bg-yellow-600' },
      { value: 'archived', label: 'Archived', color: 'bg-gray-600' },
    ],
    searchPlaceholder: 'Search by title, badge, or subtitle...',
    searchKeys: ['title', 'badge', 'subtitle'],
    showStats: true,
    emptyMessage: 'No hero slides yet. Create your first one!',
  };

  constructor(
    private heroService: HeroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHeroes();
    this.loadPublishedCount();
  }

  loadHeroes() {
    this.isLoading.set(true);

    // Load all heroes
    this.heroService.getHeroes('all').subscribe({
      next: heroes => {
        this.allHeroes.set(heroes);
        this.calculateStats(heroes);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading heroes:', error);
        this.isLoading.set(false);
      },
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

  calculateStats(heroes: Hero[]) {
    this.stats.set({
      total: heroes.length,
      published: heroes.filter(h => h.status === 'published').length,
      drafts: heroes.filter(h => h.status === 'draft').length,
    });
  }

  toggleHeroStatus(hero: Hero) {
    const newStatus = hero.status === 'published' ? 'archived' : 'published';

    // Check if trying to publish and already at max
    if (newStatus === 'published' && this.publishedCount() >= 5) {
      alert('Maximum 5 published heroes allowed. Please archive an existing hero first.');
      return;
    }

    this.heroService.updateHero(hero.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadHeroes();
        this.loadPublishedCount();
      },
      error: error => {
        console.error('Error toggling hero status:', error);
        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Failed to update hero status');
        }
      },
    });
  }

  editHero(id: number) {
    this.router.navigate(['/admin/heroes/edit', id]);
  }

  deleteHero(id: number) {
    if (confirm('Are you sure you want to delete this hero?')) {
      this.heroService.deleteHero(id).subscribe({
        next: () => {
          alert('Hero deleted successfully');
          this.loadHeroes();
          this.loadPublishedCount();
        },
        error: error => {
          console.error('Error deleting hero:', error);
          alert('Failed to delete hero');
        },
      });
    }
  }
}
