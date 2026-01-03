import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { BadgeComponent } from '../../../components/ui/badge.component';
import { Role } from '../../../models/user.model';

/**
 * Status cell renderer using the existing BadgeComponent
 * Displays status values as colored badges
 */
@Component({
  selector: 'ag-grid-status-cell',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="flex items-center h-full">
      <ui-badge [variant]="getBadgeVariant()">
        {{ getDisplayValue() }}
      </ui-badge>
    </div>
  `,
})
export class StatusCellComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  /**
   * Map status values to badge variants
   * @returns Badge variant based on status value
   */
  getBadgeVariant(): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
    const value = this.params.value;

    // Boolean values (isArchived)
    if (typeof value === 'boolean') {
      return value ? 'warning' : 'success'; // true = archived (warning), false = active (success)
    }

    // Status strings
    if (value === 'published' || value === 'active') {
      return 'success';
    }
    if (value === 'draft' || value === 'archived') {
      return 'warning';
    }

    // Role strings
    if (value === Role.ADMIN) {
      return 'primary';
    }
    if (value === Role.REPORTER) {
      return 'success';
    }
    if (value === Role.USER) {
      return 'secondary';
    }

    return 'default';
  }

  /**
   * Get display text for the status value
   * @returns Formatted display value
   */
  getDisplayValue(): string {
    const value = this.params.value;

    // Boolean to text
    if (typeof value === 'boolean') {
      return value ? 'Archived' : 'Active';
    }

    // Status mapping
    if (value === 'published') {
      return 'Active';
    }
    if (value === 'draft') {
      return 'Archived';
    }

    // Capitalize first letter
    return value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : '';
  }
}
