import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TableState } from '../core/table-state.interface';

/**
 * Service for persisting AG Grid table state to localStorage
 * SSR-safe with platform checks
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private readonly prefix = 'ag-grid-state-';

  /**
   * Get saved table state from localStorage
   * @param key Storage key for the table
   * @returns Table state or null if not found/error
   */
  getTableState(key: string): TableState | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.prefix + key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading table state:', error);
      return null;
    }
  }

  /**
   * Save table state to localStorage
   * @param key Storage key for the table
   * @param state Table state to save
   */
  saveTableState(key: string, state: TableState): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving table state:', error);
    }
  }

  /**
   * Clear saved state for a specific table
   * @param key Storage key for the table
   */
  clearTableState(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Error clearing table state:', error);
    }
  }

  /**
   * Clear all saved AG Grid table states
   */
  clearAllTableStates(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all table states:', error);
    }
  }
}
