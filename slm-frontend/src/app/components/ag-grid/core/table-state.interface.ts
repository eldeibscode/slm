import { ColumnState, FilterModel, SortModelItem } from 'ag-grid-community';

/**
 * Interface for persisting AG Grid table state
 */
export interface TableState {
  columnState?: ColumnState[];
  filterModel?: FilterModel;
  sortModel?: SortModelItem[];
  pageSize?: number;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
}
