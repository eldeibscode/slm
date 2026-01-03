import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { AbstractTableComponent } from '../core/abstract-table.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DatasourceParams } from './server-side-datasource';

/**
 * Configuration for server-side table
 */
export interface ServerSideTableConfig<T> {
  columnDefs: ColDef[];
  dataSource: (params: DatasourceParams) => Observable<{ data: T[]; total: number }>;
  pageSize?: number;
  pageSizeOptions?: number[];
  enableExport?: boolean;
  enableFilters?: boolean;
  storageKey: string;
  rowHeight?: number;
  headerHeight?: number;
  customActions?: any[];
}

/**
 * Server-side table component with infinite scroll model
 * Supports pagination, sorting, filtering, and CSV export
 */
@Component({
  selector: 'ag-grid-server-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
    <div class="ag-theme-alpine ag-theme-custom w-full h-full" style="position: relative; z-index: 1;">
      <!-- Toolbar -->
      <div class="bg-white border-b border-secondary-200 p-4 flex items-center justify-between"
           (click)="$event.stopPropagation()"
           (mousedown)="$event.stopPropagation()">
        <div class="flex items-center gap-4">
          <!-- Page size selector -->
          <select
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
            class="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            @for (size of pageSizeOptions; track size) {
              <option [value]="size">{{ size === -1 ? 'All' : size }} per page</option>
            }
          </select>
        </div>

        <div class="flex items-center gap-2">
          @if (config.enableExport) {
            <button
              (click)="exportToCsv()"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Export CSV
            </button>
          }

          <button
            (click)="autoSizeAllColumns()"
            class="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Auto-size
          </button>

          <button
            (click)="resetToDefaults()"
            class="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Grid -->
      <ag-grid-angular
        class="w-full"
        [style.height]="gridHeight"
        [gridOptions]="gridOptions"
        [columnDefs]="config.columnDefs"
        [defaultColDef]="defaultColDef"
        [rowModelType]="'infinite'"
        [pagination]="true"
        [paginationPageSize]="pageSize() === -1 ? 10000 : pageSize()"
        [paginationPageSizeSelector]="false"
        [cacheBlockSize]="pageSize() === -1 ? 10000 : pageSize()"
        [cacheOverflowSize]="2"
        [maxConcurrentDatasourceRequests]="2"
        [infiniteInitialRowCount]="1"
        [maxBlocksInCache]="10"
        (gridReady)="onGridReady($event)"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ServerSideTableComponent<T> extends AbstractTableComponent {
  @Input({ required: true }) config!: ServerSideTableConfig<T>;
  @Input() gridHeight: string = '600px';
  @Output() rowClicked = new EventEmitter<T>();
  @Output() actionTriggered = new EventEmitter<{ action: string; data: T }>();

  pageSize = signal(10);
  pageSizeOptions: number[] = [5, 10, 20, 50, 100, 500, -1]; // -1 = all

  // Default column definition - filters accessible via column menu only
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: false, // Filters in popup menu only (single row header)
    resizable: true,
    filterParams: {
      debounceMs: 300, // Debounce filter input to reduce API calls
    },
  };

  gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    rowModelType: 'infinite',
    pagination: true,
    paginationPageSize: 10,
    rowHeight: 44,
    headerHeight: 44,
    enableBrowserTooltips: true,
    suppressClickEdit: true,
    suppressScrollOnNewData: true,
    // Popup configuration - ensure menus render properly
    popupParent: document.body,
    suppressMenuHide: true,
  };

  override getColumnDefs(): ColDef[] {
    return this.config.columnDefs;
  }

  override getStorageKey(): string {
    return this.config.storageKey;
  }

  override onGridReady(params: any): void {
    super.onGridReady(params);

    // Set up the datasource for infinite row model
    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const currentPageSize = this.pageSize();
        const page = currentPageSize === -1 ? 0 : Math.floor(params.startRow / currentPageSize);
        const pageSize = currentPageSize === -1 ? -1 : currentPageSize;

        this.config
          .dataSource({
            page,
            pageSize,
            sortModel: params.sortModel,
            filterModel: params.filterModel,
          })
          .pipe(take(1)) // Ensure subscription completes after first emission to prevent memory leaks
          .subscribe({
            next: (result) => {
              params.successCallback(result.data, result.total);
            },
            error: (error) => {
              console.error('Error fetching data:', error);
              params.failCallback();
            },
          });
      },
    };

    this.gridApi.setGridOption('datasource', datasource);
  }

  /**
   * Handle page size change
   * @param event Select event
   */
  onPageSizeChange(event: Event): void {
    const size = parseInt((event.target as HTMLSelectElement).value);
    this.pageSize.set(size);
    const effectiveSize = size === -1 ? 10000 : size;
    this.gridApi?.setGridOption('paginationPageSize', effectiveSize);
    this.gridApi?.setGridOption('cacheBlockSize', effectiveSize);
    this.gridApi?.purgeInfiniteCache();
  }

  /**
   * Refresh the data in the grid
   */
  refreshData(): void {
    this.gridApi?.purgeInfiniteCache();
  }
}
