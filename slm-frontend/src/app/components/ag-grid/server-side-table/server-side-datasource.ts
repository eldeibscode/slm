import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortModelItem, FilterModel } from 'ag-grid-community';

/**
 * Parameters for datasource requests
 */
export interface DatasourceParams {
  page: number;
  pageSize: number;
  sortModel?: SortModelItem[];
  filterModel?: FilterModel;
}

/**
 * Result from datasource
 */
export interface DatasourceResult<T> {
  data: T[];
  total: number;
}

/**
 * Adapter to convert AG Grid requests to REST API calls
 */
export class ServerSideDatasourceAdapter {
  /**
   * Convert AG Grid sort model to API sort params
   */
  static convertSortModel(sortModel?: SortModelItem[]): { sortBy?: string; sortOrder?: 'asc' | 'desc' } {
    if (!sortModel || sortModel.length === 0) {
      return {};
    }
    const firstSort = sortModel[0];
    return {
      sortBy: firstSort.colId,
      sortOrder: firstSort.sort as 'asc' | 'desc',
    };
  }

  /**
   * Convert AG Grid filter model to API filter params
   */
  static convertFilterModel(filterModel?: FilterModel): Record<string, any> {
    if (!filterModel) {
      return {};
    }

    const filters: Record<string, any> = {};

    Object.keys(filterModel).forEach((key) => {
      const filter = filterModel[key];

      if (filter.filterType === 'text') {
        filters[key] = filter.filter;
      } else if (filter.filterType === 'number') {
        filters[key] = filter.filter;
      } else if (filter.filterType === 'date') {
        filters[key] = filter.dateFrom;
      }
    });

    return filters;
  }

  /**
   * Create a datasource for users (client-side sorting/filtering)
   */
  static createUsersDatasource(apiService: any): (params: DatasourceParams) => Observable<DatasourceResult<any>> {
    return (params: DatasourceParams) => {
      return apiService.getAllUsers().pipe(
        map((users: any[]) => {
          let filtered = [...users];

          // Apply filters
          if (params.filterModel) {
            const filters = this.convertFilterModel(params.filterModel);
            Object.keys(filters).forEach((key) => {
              const filterValue = filters[key];
              if (filterValue != null && filterValue !== '') {
                filtered = filtered.filter((user) => {
                  const fieldValue = user[key];
                  if (fieldValue == null) return false;
                  return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
                });
              }
            });
          }

          // Apply sorting
          if (params.sortModel && params.sortModel.length > 0) {
            const sort = params.sortModel[0];
            filtered.sort((a, b) => {
              const aVal = a[sort.colId];
              const bVal = b[sort.colId];

              if (aVal == null && bVal == null) return 0;
              if (aVal == null) return sort.sort === 'asc' ? -1 : 1;
              if (bVal == null) return sort.sort === 'asc' ? 1 : -1;

              // Handle dates
              if (typeof aVal === 'string' && !isNaN(Date.parse(aVal))) {
                const aDate = new Date(aVal).getTime();
                const bDate = new Date(bVal).getTime();
                return sort.sort === 'asc' ? aDate - bDate : bDate - aDate;
              }

              // Handle strings
              const aStr = String(aVal).toLowerCase();
              const bStr = String(bVal).toLowerCase();
              if (aStr === bStr) return 0;
              return sort.sort === 'asc' ? (aStr > bStr ? 1 : -1) : (aStr < bStr ? 1 : -1);
            });
          }

          // Apply pagination
          const startRow = params.page * params.pageSize;
          const endRow = startRow + params.pageSize;
          const paginatedData = params.pageSize === -1 ? filtered : filtered.slice(startRow, endRow);

          return {
            data: paginatedData,
            total: filtered.length,
          };
        })
      );
    };
  }
}
