import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { GridApi, GridOptions, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { TableState } from './table-state.interface';

/**
 * Abstract base class for AG Grid table components
 * Provides shared functionality for state management, export, and common operations
 */
@Directive()
export abstract class AbstractTableComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected gridApi!: GridApi;
  protected storageService = inject(StorageService);

  /**
   * Default grid options shared across all tables
   */
  defaultGridOptions: GridOptions = {
    animateRows: true,
    enableCellTextSelection: true,
    suppressCellFocus: false,
    rowSelection: 'single',
    overlayNoRowsTemplate: this.getNoRowsTemplate(),
    onGridReady: (params: GridReadyEvent) => this.onGridReady(params),
    // Popup configuration - ensure menus and filters render properly
    popupParent: document.body,
    suppressMenuHide: true,
  };

  /**
   * Get column definitions for the table
   * Must be implemented by subclasses
   */
  abstract getColumnDefs(): ColDef[];

  /**
   * Get storage key for state persistence
   * Must be implemented by subclasses
   */
  abstract getStorageKey(): string;

  ngOnInit(): void {
    this.loadState();
  }

  ngOnDestroy(): void {
    this.saveState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle grid ready event
   * @param params Grid ready event parameters
   */
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.applyState();
  }

  /**
   * Load saved state from localStorage
   */
  protected loadState(): void {
    const state = this.storageService.getTableState(this.getStorageKey());
    if (state) {
      // State will be applied after grid is ready
    }
  }

  /**
   * Save current state to localStorage
   */
  protected saveState(): void {
    if (!this.gridApi) {
      return;
    }

    const state: TableState = {
      columnState: this.gridApi.getColumnState(),
      filterModel: this.gridApi.getFilterModel(),
      sortModel: this.gridApi.getColumnState().filter(col => col.sort != null).map(col => ({
        colId: col.colId,
        sort: col.sort as 'asc' | 'desc'
      })),
      pageSize: this.gridApi.paginationGetPageSize(),
    };

    this.storageService.saveTableState(this.getStorageKey(), state);
  }

  /**
   * Apply saved state to the grid
   */
  protected applyState(): void {
    const state = this.storageService.getTableState(this.getStorageKey());
    if (!state || !this.gridApi) {
      return;
    }

    if (state.columnState) {
      this.gridApi.applyColumnState({ state: state.columnState, applyOrder: true });
    }
    if (state.filterModel) {
      this.gridApi.setFilterModel(state.filterModel);
    }
    if (state.pageSize) {
      this.gridApi.setGridOption('paginationPageSize', state.pageSize);
    }
  }

  /**
   * Get template for no rows overlay
   * @returns HTML template string
   */
  protected getNoRowsTemplate(): string {
    return '<div class="flex items-center justify-center h-full text-secondary-500">No data available</div>';
  }

  /**
   * Export grid data to CSV
   */
  exportToCsv(): void {
    this.gridApi?.exportDataAsCsv({
      fileName: `${this.getStorageKey()}_${new Date().toISOString()}.csv`,
    });
  }

  /**
   * Toggle column visibility
   * @param colId Column ID
   * @param visible Visibility state
   */
  toggleColumnVisibility(colId: string, visible: boolean): void {
    this.gridApi?.setColumnsVisible([colId], visible);
  }

  /**
   * Auto-size all columns to fit content
   */
  autoSizeAllColumns(): void {
    this.gridApi?.autoSizeAllColumns();
  }

  /**
   * Reset grid to default state
   */
  resetToDefaults(): void {
    this.storageService.clearTableState(this.getStorageKey());
    this.gridApi?.resetColumnState();
    this.gridApi?.setFilterModel(null);
  }
}
