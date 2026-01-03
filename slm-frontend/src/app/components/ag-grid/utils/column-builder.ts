import { ColDef, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { StatusCellComponent } from '../cell-renderers/status-cell.component';
import { ActionsCellComponent, ActionsCellParams } from '../cell-renderers/actions-cell.component';
import { LinkCellComponent } from '../cell-renderers/link-cell.component';

/**
 * Utility class for building AG Grid column definitions with consistent configuration
 */
export class ColumnBuilder {
  /**
   * Create a text column
   * @param field Field name
   * @param headerName Column header
   * @param options Additional column options
   * @returns Column definition
   */
  static text(field: string, headerName: string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      filterParams: {
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
      ...options,
    };
  }

  /**
   * Create a date column with formatted display
   * @param field Field name
   * @param headerName Column header
   * @param options Additional column options
   * @returns Column definition
   */
  static date(field: string, headerName: string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
      filterParams: {
        filterOptions: ['equals', 'greaterThan', 'lessThan', 'notEqual', 'inRange'],
        defaultOption: 'equals',
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
      ...options,
    };
  }

  /**
   * Create a datetime column with formatted display
   * @param field Field name
   * @param headerName Column header
   * @param options Additional column options
   * @returns Column definition
   */
  static dateTime(field: string, headerName: string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
      filterParams: {
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      ...options,
    };
  }

  /**
   * Create a number column
   * @param field Field name
   * @param headerName Column header
   * @param options Additional column options
   * @returns Column definition
   */
  static number(field: string, headerName: string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      type: 'numericColumn',
      filterParams: {
        suppressAndOrCondition: true,
      },
      ...options,
    };
  }

  /**
   * Create an amount/currency column
   * @param field Field name
   * @param headerName Column header
   * @param currency Currency code (default: USD)
   * @param options Additional column options
   * @returns Column definition
   */
  static amount(field: string, headerName: string, currency: string = 'USD', options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      type: 'numericColumn',
      filterParams: {
        suppressAndOrCondition: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value == null) return '';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(params.value);
      },
      ...options,
    };
  }

  /**
   * Create a status badge column
   * @param field Field name
   * @param headerName Column header
   * @param options Additional column options
   * @returns Column definition
   */
  static status(field: string, headerName: string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agTextColumnFilter', // Using text filter (Set filter requires Enterprise)
      resizable: true,
      filterParams: {
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
      cellRenderer: StatusCellComponent,
      width: 120,
      ...options,
    };
  }

  /**
   * Create an actions column with default or custom actions
   * @param params Actions configuration
   * @param options Additional column options
   * @returns Column definition
   */
  static actions(
    params: {
      onEdit?: (data: any) => void;
      onDelete?: (data: any) => void;
      onToggleArchive?: (data: any) => void;
      customActions?: any[];
    },
    options?: Partial<ColDef>
  ): ColDef {
    return {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionsCellComponent,
      cellRendererParams: params as ActionsCellParams,
      sortable: false,
      filter: false,
      resizable: false,
      pinned: 'right',
      width: 155,
      ...options,
    };
  }

  /**
   * Create a link column with clickable links
   * Uses LinkCellComponent for XSS-safe rendering
   * @param field Field name
   * @param headerName Column header
   * @param urlGetter Function to generate URL from row data
   * @param options Additional column options
   * @returns Column definition
   */
  static link(field: string, headerName: string, urlGetter: (data: any) => string, options?: Partial<ColDef>): ColDef {
    return {
      field,
      headerName,
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      filterParams: {
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
      cellRenderer: LinkCellComponent,
      cellRendererParams: {
        url: urlGetter,
        target: '_blank',
      },
      ...options,
    };
  }

  /**
   * Create a value getter for nested properties
   * @param path Dot-separated property path (e.g., "author.name")
   * @returns Value getter function
   */
  static nestedValueGetter(path: string): (params: ValueGetterParams) => any {
    return (params: ValueGetterParams) => {
      const keys = path.split('.');
      let value: any = params.data;
      for (const key of keys) {
        value = value?.[key];
      }
      return value;
    };
  }
}
