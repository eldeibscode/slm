import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

/**
 * Configuration for custom actions
 */
export interface ActionConfig {
  icon?: string;
  label?: string;
  tooltip?: string;
  color?: string;
  visible?: (data: any) => boolean;
  handler: (data: any) => void;
}

/**
 * Parameters for ActionsCellComponent
 */
export interface ActionsCellParams extends ICellRendererParams {
  actions?: ActionConfig[];
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  onToggleArchive?: (data: any) => void;
}

/**
 * Actions cell renderer with edit, delete, and archive/activate toggle
 * Supports both default actions and custom actions
 */
@Component({
  selector: 'ag-grid-actions-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 h-full">
      <!-- Toggle Archive (default action) - Animated toggle switch -->
      @if (params.onToggleArchive && !hasCustomActions) {
        <button
          (click)="handleToggleArchive()"
          [title]="getToggleTooltip()"
          class="p-1.5 rounded hover:bg-secondary-100 transition-colors"
        >
          @if (isArchived()) {
            <!-- Off state - gray -->
            <svg class="w-8 h-6" viewBox="0 0 36 24" fill="none">
              <rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-gray-300" />
              <circle cx="12" cy="12" r="6" fill="white" />
            </svg>
          } @else {
            <!-- On state - green -->
            <svg class="w-8 h-6" viewBox="0 0 36 24" fill="none">
              <rect x="2" y="4" width="32" height="16" rx="8" fill="currentColor" class="text-green-500" />
              <circle cx="24" cy="12" r="6" fill="white" />
            </svg>
          }
        </button>
      }

      <!-- Edit (default action) -->
      @if (params.onEdit && !hasCustomActions) {
        <button
          (click)="handleEdit()"
          title="Edit"
          class="p-1.5 rounded hover:bg-secondary-100 transition-colors text-blue-600 hover:text-blue-700"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      }

      <!-- Delete (default action) -->
      @if (params.onDelete && !hasCustomActions) {
        <button
          (click)="handleDelete()"
          title="Delete"
          class="p-1.5 rounded hover:bg-secondary-100 transition-colors text-red-600 hover:text-red-700"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      }

      <!-- Custom Actions -->
      @if (hasCustomActions) {
        @for (action of visibleActions; track action.label) {
          <button (click)="handleCustomAction(action)" [title]="action.tooltip || action.label" [class]="getActionClass(action)">
            @if (action.icon) {
              <span [innerHTML]="action.icon"></span>
            }
            @if (action.label && !action.icon) {
              {{ action.label }}
            }
          </button>
        }
      }
    </div>
  `,
})
export class ActionsCellComponent implements ICellRendererAngularComp {
  params!: ActionsCellParams;
  hasCustomActions = false;
  visibleActions: ActionConfig[] = [];

  agInit(params: ActionsCellParams): void {
    this.params = params;
    this.hasCustomActions = !!(params.actions && params.actions.length > 0);

    if (this.hasCustomActions && params.actions) {
      this.visibleActions = params.actions.filter((action) => !action.visible || action.visible(params.data));
    }
  }

  refresh(params: ActionsCellParams): boolean {
    this.params = params;
    return true;
  }

  /**
   * Check if the row is archived
   * @returns True if archived
   */
  isArchived(): boolean {
    return this.params.data?.isArchived || this.params.data?.status === 'archived';
  }

  /**
   * Get tooltip text for toggle button
   * @returns Tooltip text
   */
  getToggleTooltip(): string {
    return this.isArchived() ? 'Click to activate' : 'Click to archive';
  }

  /**
   * Handle toggle archive action
   */
  handleToggleArchive(): void {
    if (this.params.onToggleArchive) {
      this.params.onToggleArchive(this.params.data);
    }
  }

  /**
   * Handle edit action
   */
  handleEdit(): void {
    if (this.params.onEdit) {
      this.params.onEdit(this.params.data);
    }
  }

  /**
   * Handle delete action
   */
  handleDelete(): void {
    if (this.params.onDelete) {
      this.params.onDelete(this.params.data);
    }
  }

  /**
   * Handle custom action
   * @param action Action configuration
   */
  handleCustomAction(action: ActionConfig): void {
    action.handler(this.params.data);
  }

  /**
   * Get CSS classes for custom action button
   * @param action Action configuration
   * @returns CSS class string
   */
  getActionClass(action: ActionConfig): string {
    const base = 'p-1.5 rounded hover:bg-secondary-100 transition-colors';
    return `${base} ${action.color || 'text-secondary-600'}`;
  }
}
