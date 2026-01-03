import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BadgeComponent } from './badge.component';
import {
  TableConfig,
  TableStats,
  TableColumn,
  TableAction,
  StatusFilter,
  SortOrder,
} from './table.types';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Stats Cards (optional) -->
      @if (config.showStats && stats) {
        <div class="grid md:grid-cols-3 gap-6">
          @for (stat of statsArray(); track stat.key) {
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-secondary-600 text-sm">{{ stat.label }}</div>
              <div class="text-3xl font-bold mt-2" [class]="stat.colorClass">
                {{ stat.value }}
              </div>
            </div>
          }
        </div>
      }

      <!-- Filters & Search (optional) -->
      @if (config.showFilters !== false && !config.hideSearchBar) {
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-secondary-900 mb-2">Search</label>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchChange($event)"
                [placeholder]="config.searchPlaceholder || 'Search...'"
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Status Filter Buttons (optional) -->
            @if (config.statusFilters && config.statusFilters.length > 0) {
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">Status</label>
                <div class="flex gap-2">
                  @for (filter of config.statusFilters; track filter.value) {
                    <button
                      (click)="onStatusFilterChange(filter.value)"
                      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      [class]="getFilterButtonClass(filter)"
                    >
                      {{ filter.label }}
                      @if (filter.count !== undefined) {
                        <span class="ml-1">({{ filter.count }})</span>
                      }
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Results count -->
          <div class="text-sm text-secondary-600 mt-4">
            Showing {{ paginatedData().length }} of {{ filteredData().length }} items
            @if (filteredData().length !== allData().length) {
              (filtered from {{ allData().length }} total)
            }
          </div>
        </div>
      }

      <!-- Table -->
      @if (loading) {
        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="animate-pulse space-y-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="h-16 bg-secondary-200 rounded"></div>
            }
          </div>
        </div>
      }

      @if (!loading && paginatedData().length > 0) {
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                @for (column of config.columns; track column.key) {
                  <th
                    [class]="getHeaderClass(column)"
                    [style.width]="column.width"
                    (click)="column.sortable ? onSortChange(column.key) : null"
                  >
                    <div class="flex items-center gap-1">
                      {{ column.label }}
                      @if (column.sortable && sortBy() === column.key) {
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          @if (sortOrder() === 'asc') {
                            <path
                              fill-rule="evenodd"
                              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                            />
                          } @else {
                            <path
                              fill-rule="evenodd"
                              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            />
                          }
                        </svg>
                      }
                    </div>
                  </th>
                }
                @if (config.actions.length > 0) {
                  <th class="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase">
                    Actions
                  </th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-secondary-200">
              @for (item of paginatedData(); track item) {
                <tr class="hover:bg-secondary-50">
                  @for (column of config.columns; track column.key) {
                    <td class="px-6 py-4">
                      @switch (column.type) {
                        @case ('badge') {
                          <ui-badge [variant]="column.badgeVariant!(item)">
                            {{ getCellValue(item, column) }}
                          </ui-badge>
                        }
                        @case ('date') {
                          <span class="text-sm text-secondary-600">
                            {{ formatDate(getCellValue(item, column), column.dateFormat) }}
                          </span>
                        }
                        @case ('custom') {
                          <ng-container
                            *ngTemplateOutlet="column.customTemplate!; context: { $implicit: item }"
                          ></ng-container>
                        }
                        @default {
                          <span class="text-sm text-secondary-900">
                            {{ getCellValue(item, column) }}
                          </span>
                        }
                      }
                    </td>
                  }
                  @if (config.actions.length > 0) {
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        @for (action of config.actions; track action.label) {
                          @if (!action.visible || action.visible(item)) {
                            <button
                              (click)="action.handler(item)"
                              [class]="getActionButtonClass(action)"
                              [title]="getActionTooltip(action, item)"
                              [attr.aria-label]="action.label"
                            >
                              @if (action.icon) {
                                <span [innerHTML]="sanitizeHtml(getActionIcon(action, item))" class="inline-flex"></span>
                              }
                              @if (!action.iconOnly) {
                                <span [class.ml-1]="action.icon">{{ action.label }}</span>
                              }
                            </button>
                          }
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          @if (config.showPagination) {
            <div class="px-6 py-4 border-t border-secondary-200 flex items-center justify-between">
              <!-- Page info -->
              <div class="text-sm text-secondary-600">
                {{ (currentPage() - 1) * (config.pageSize || 10) + 1 }} to
                {{ Math.min(currentPage() * (config.pageSize || 10), filteredData().length) }} of
                {{ filteredData().length }}
              </div>

              <!-- Pagination controls -->
              <div class="flex items-center gap-2">
                <!-- First page -->
                <button
                  (click)="goToPage(1)"
                  [disabled]="currentPage() === 1"
                  class="px-3 py-1 text-sm border border-secondary-300 rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  «
                </button>

                <!-- Previous page -->
                <button
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() === 1"
                  class="px-3 py-1 text-sm border border-secondary-300 rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                <!-- Page info -->
                <span class="text-sm text-secondary-600">
                  Page {{ currentPage() }} of {{ totalPages() }}
                </span>

                <!-- Next page -->
                <button
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() === totalPages()"
                  class="px-3 py-1 text-sm border border-secondary-300 rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>

                <!-- Last page -->
                <button
                  (click)="goToPage(totalPages())"
                  [disabled]="currentPage() === totalPages()"
                  class="px-3 py-1 text-sm border border-secondary-300 rounded hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>

              <!-- Page size selector -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-secondary-600">Show</label>
                <select
                  [value]="config.pageSize || 10"
                  (change)="changePageSize(+($any($event.target).value))"
                  class="px-2 py-1 text-sm border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <label class="text-sm text-secondary-600">items per page</label>
              </div>
            </div>
          }
        </div>
      }

      @if (!loading && filteredData().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <p class="text-secondary-600">
            {{ config.emptyMessage || 'No data available.' }}
          </p>
        </div>
      }
    </div>
  `,
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) config!: TableConfig<T>;
  @Input() loading = false;
  @Input() stats?: TableStats;

  @Output() dataChange = new EventEmitter<T[]>();

  allData = signal<T[]>([]);
  filteredData = signal<T[]>([]);
  paginatedData = signal<T[]>([]);
  searchQuery = signal('');
  statusFilter = signal<string>('all');
  sortBy = signal<string>('');
  sortOrder = signal<SortOrder>('desc');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  // Expose Math for template
  Math = Math;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.allData.set(this.data);
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.allData.set(this.data);
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.allData()];

    // Apply status filter
    if (this.statusFilter() !== 'all' && this.config.statusFilters) {
      filtered = filtered.filter(item => {
        return (item as any)['status'] === this.statusFilter();
      });
    }

    // Apply search filter
    const query = this.searchQuery().toLowerCase();
    if (query && this.config.searchKeys) {
      filtered = filtered.filter(item =>
        this.config.searchKeys!.some(key => {
          const value = this.getNestedValue(item, key as string);
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply sorting
    if (this.sortBy()) {
      filtered.sort((a, b) => {
        const column = this.config.columns.find(c => c.key === this.sortBy());
        if (!column) return 0;

        const aVal = this.getCellValue(a, column);
        const bVal = this.getCellValue(b, column);

        let comparison = 0;
        if (column.type === 'date') {
          comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
        } else if (typeof aVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return this.sortOrder() === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredData.set(filtered);
    this.applyPagination();
  }

  applyPagination() {
    if (this.config.showPagination) {
      const pageSize = this.config.pageSize || 10;
      const startIndex = (this.currentPage() - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      this.paginatedData.set(this.filteredData().slice(startIndex, endIndex));
      this.totalPages.set(Math.ceil(this.filteredData().length / pageSize));
    } else {
      this.paginatedData.set(this.filteredData());
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.applyPagination();
    }
  }

  changePageSize(size: number) {
    this.config.pageSize = size;
    this.currentPage.set(1);
    this.applyPagination();
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.applyFilters();
  }

  onStatusFilterChange(status: string) {
    this.statusFilter.set(status);
    this.applyFilters();
  }

  onSortChange(columnKey: string) {
    if (this.sortBy() === columnKey) {
      this.sortOrder.update(order => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(columnKey);
      this.sortOrder.set('desc');
    }
    this.applyFilters();
  }

  getCellValue(item: T, column: TableColumn<T>): any {
    if (column.valueFormatter) {
      return column.valueFormatter(item);
    }

    return this.getNestedValue(item, column.key);
  }

  private getNestedValue(item: any, key: string): any {
    // Support nested keys like 'author.name'
    const keys = key.split('.');
    let value: any = item;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }

  formatDate(date: Date | undefined, format?: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getHeaderClass(column: TableColumn<T>): string {
    const base = 'px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase';
    return column.sortable ? `${base} cursor-pointer hover:bg-secondary-100` : base;
  }

  getFilterButtonClass(filter: StatusFilter): string {
    const isActive = this.statusFilter() === filter.value;
    return isActive
      ? `${filter.color || 'bg-primary-600'} text-white`
      : 'bg-secondary-100 text-secondary-700';
  }

  getActionButtonClass(action: TableAction<T>): string {
    const baseClasses = action.iconOnly
      ? 'p-1.5 rounded hover:bg-secondary-100 transition-colors inline-flex items-center justify-center'
      : 'text-sm font-medium inline-flex items-center';
    return `${baseClasses} ${action.color || 'text-primary-600 hover:text-primary-900'}`;
  }

  statsArray() {
    if (!this.stats) return [];
    return Object.entries(this.stats).map(([key, value]) => ({
      key,
      label: this.getStatLabel(key),
      value,
      colorClass: this.getStatColorClass(key),
    }));
  }

  getStatLabel(key: string): string {
    switch (key) {
      case 'published':
        return 'Active';
      case 'drafts':
        return 'Archived';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }

  getStatColorClass(key: string): string {
    switch (key) {
      case 'published':
        return 'text-primary-600';
      case 'drafts':
        return 'text-yellow-600';
      default:
        return '';
    }
  }

  getActionIcon(action: TableAction<T>, item: T): string {
    if (typeof action.icon === 'function') {
      return action.icon(item);
    }
    return action.icon || '';
  }

  getActionTooltip(action: TableAction<T>, item: T): string {
    if (typeof action.tooltip === 'function') {
      return action.tooltip(item);
    }
    return action.tooltip || action.label;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
