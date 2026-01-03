/**
 * AG Grid Configuration
 * Registers required modules for AG Grid v34+
 *
 * This file should be imported once at application startup (in main.ts or app.config.ts)
 */
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

/**
 * Register AG Grid Community modules
 * Using AllCommunityModule for complete functionality
 */
export function registerAgGridModules(): void {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

// Auto-register on import
registerAgGridModules();
