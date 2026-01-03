import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

/**
 * Parameters for LinkCellComponent
 */
export interface LinkCellParams extends ICellRendererParams {
  url?: string | ((data: any) => string);
  target?: '_blank' | '_self';
}

/**
 * Link cell renderer for clickable links
 * Supports static URLs or dynamic URL generation
 */
@Component({
  selector: 'ag-grid-link-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center h-full">
      <a [href]="getUrl()" [target]="params.target || '_blank'" class="text-primary-600 hover:text-primary-700 underline">
        {{ params.value }}
      </a>
    </div>
  `,
})
export class LinkCellComponent implements ICellRendererAngularComp {
  params!: LinkCellParams;

  agInit(params: LinkCellParams): void {
    this.params = params;
  }

  refresh(params: LinkCellParams): boolean {
    this.params = params;
    return true;
  }

  /**
   * Get the URL for the link
   * @returns URL string
   */
  getUrl(): string {
    if (typeof this.params.url === 'function') {
      return this.params.url(this.params.data);
    }
    return this.params.url || '#';
  }
}
