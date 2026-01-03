import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ServerSideTableComponent, ServerSideTableConfig } from '../components/ag-grid/server-side-table/server-side-table.component';
import { ServerSideDatasourceAdapter } from '../components/ag-grid/server-side-table/server-side-datasource';
import { ColumnBuilder } from '../components/ag-grid/utils/column-builder';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { User, Role } from '../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ContainerComponent, ServerSideTableComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">User Management</h1>
          <p class="text-secondary-600">Manage user roles and account status</p>
        </div>

        <!-- Messages -->
        @if (errorMessage) {
          <div class="rounded-md bg-red-50 p-4 mb-6">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>
        }

        @if (successMessage) {
          <div class="rounded-md bg-primary-50 p-4 mb-6">
            <p class="text-sm text-primary-800">{{ successMessage }}</p>
          </div>
        }

        <!-- AG Grid Server Table -->
        <ag-grid-server-table
          [config]="tableConfig"
          [gridHeight]="'calc(100vh - 400px)'"
        />

        <!-- Edit User Modal -->
        @if (editingUser) {
          <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- Background overlay -->
              <div class="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity" (click)="cancelEdit()"></div>

              <!-- Center modal -->
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-secondary-900 mb-4" id="modal-title">
                        Edit User: {{ editingUser.name || editingUser.email }}
                      </h3>

                      <div class="space-y-4">
                        <!-- Role Selection -->
                        <div>
                          <label class="block text-sm font-medium text-secondary-700 mb-2">Role</label>
                          <select
                            [(ngModel)]="selectedRole"
                            class="w-full border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option [value]="Role.USER">User</option>
                            <option [value]="Role.REPORTER">Reporter</option>
                            <option [value]="Role.ADMIN">Admin</option>
                          </select>
                        </div>

                        <!-- Reset Password Option -->
                        <div class="flex items-center">
                          <input
                            type="checkbox"
                            [(ngModel)]="resetPassword"
                            id="resetPassword"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                          />
                          <label for="resetPassword" class="ml-2 block text-sm text-secondary-700">
                            Reset password to default (testTest)
                          </label>
                        </div>

                        <div class="text-sm text-secondary-500">
                          <p><strong>Email:</strong> {{ editingUser.email }}</p>
                          <p><strong>Current Role:</strong> {{ editingUser.role }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="button"
                    (click)="saveUser()"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    (click)="cancelEdit()"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </ui-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  @ViewChild(ServerSideTableComponent) table?: ServerSideTableComponent<User>;

  allUsers = signal<User[]>([]);
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  editingUser: User | null = null;
  selectedRole: Role = Role.USER;
  resetPassword = false;
  Role = Role;

  get tableConfig(): ServerSideTableConfig<User> {
    return {
      columnDefs: [
        ColumnBuilder.text('name', 'User', {
          flex: 1,
          minWidth: 150,
          valueGetter: (params) => params.data?.name || 'No name',
        }),
        ColumnBuilder.text('email', 'Email', {
          flex: 1,
          minWidth: 200,
        }),
        ColumnBuilder.status('role', 'Role', {
          width: 120,
        }),
        ColumnBuilder.status('isArchived', 'Status', {
          width: 120,
        }),
        ColumnBuilder.date('createdAt', 'Joined', {
          width: 150,
        }),
        ColumnBuilder.actions({
          onEdit: (user) => this.editRole(user),
          onDelete: (user) => this.deleteUser(user),
          onToggleArchive: (user) => this.toggleUserStatus(user),
        }),
      ],
      dataSource: ServerSideDatasourceAdapter.createUsersDatasource(this.apiService),
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50, 100, 500, -1],
      enableExport: true,
      enableFilters: true,
      storageKey: 'user-management',
    };
  }

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    // Defense in depth: Verify user has admin role
    const currentUser = this.authService.currentUser();
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      console.error('❌ UNAUTHORIZED ACCESS ATTEMPT TO USER MANAGEMENT');
      console.error('  ├─ Current user:', currentUser);
      console.error('  └─ Required role: ADMIN');
      this.errorMessage = 'Unauthorized: Admin access required';
      // The guard should have prevented this, but as a safety measure, don't load data
      return;
    }

    // AG Grid will load data automatically through datasource
  }

  /**
   * Refresh the AG Grid data
   */
  refreshGrid(): void {
    this.table?.refreshData();
  }

  isCurrentUser(user: User): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.id === user.id;
  }

  editRole(user: User): void {
    this.editingUser = user;
    this.selectedRole = user.role;
    this.resetPassword = false;
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.resetPassword = false;
    this.clearMessages();
  }

  saveUser(): void {
    if (!this.editingUser) return;

    const user = this.editingUser;
    const userIdentifier = user.email || user.name || 'user';

    console.log('═══════════════════════════════════════');
    console.log('💾 SAVE USER ACTION');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User identifier:', userIdentifier);
    console.log('  ├─ Current role:', user.role);
    console.log('  ├─ New role:', this.selectedRole);
    console.log('  └─ Reset password:', this.resetPassword);
    console.log('═══════════════════════════════════════');

    // Check if role changed
    const roleChanged = this.selectedRole !== user.role;

    if (!roleChanged && !this.resetPassword) {
      console.log('⚠️  No changes made - cancelling edit');
      console.log('═══════════════════════════════════════\n');
      this.cancelEdit();
      return;
    }

    console.log('▶ Proceeding with user update...');

    // Build update payload
    const updatePayload: any = {};
    if (roleChanged) {
      updatePayload.role = this.selectedRole;
    }
    if (this.resetPassword) {
      updatePayload.password = 'testTest';
    }

    // For now, we'll update role via existing API
    if (roleChanged && !this.resetPassword) {
      // Only role change
      this.apiService.updateUserRole(user.id, this.selectedRole).subscribe({
        next: updatedUser => {
          console.log('✅ USER UPDATED SUCCESSFULLY');
          console.log('  ├─ Updated user:', updatedUser);
          console.log('  └─ New role:', updatedUser.role);

          this.refreshGrid();
          console.log('  └─ Grid refreshed');

          this.successMessage = `Successfully updated ${userIdentifier}'s role to ${this.selectedRole}`;
          this.cancelEdit();
          console.log('═══════════════════════════════════════\n');
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: error => {
          console.error('═══════════════════════════════════════');
          console.error('❌ UPDATE USER FAILED');
          console.error('  ├─ Error status:', error.status);
          console.error('  ├─ Error message:', error.error?.message);
          console.error('  └─ Full error:', error);
          console.error('═══════════════════════════════════════\n');
          this.errorMessage = error.error?.message || 'Failed to update user';
          this.cancelEdit();
        },
      });
    } else {
      // Role change with password reset, or just password reset
      // We need to call updateUser API with full payload
      this.apiService.updateUser(user.id, updatePayload).subscribe({
        next: updatedUser => {
          console.log('✅ USER UPDATED SUCCESSFULLY');
          console.log('  ├─ Updated user:', updatedUser);
          if (roleChanged) {
            console.log('  ├─ New role:', updatedUser.role);
          }
          if (this.resetPassword) {
            console.log('  └─ Password reset to: testTest');
          }

          this.refreshGrid();
          console.log('  └─ Grid refreshed');

          let message = `Successfully updated ${userIdentifier}`;
          if (roleChanged && this.resetPassword) {
            message += ` (role changed to ${this.selectedRole}, password reset)`;
          } else if (roleChanged) {
            message += ` (role changed to ${this.selectedRole})`;
          } else {
            message += ` (password reset)`;
          }
          this.successMessage = message;
          this.cancelEdit();
          console.log('═══════════════════════════════════════\n');
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: error => {
          console.error('═══════════════════════════════════════');
          console.error('❌ UPDATE USER FAILED');
          console.error('  ├─ Error status:', error.status);
          console.error('  ├─ Error message:', error.error?.message);
          console.error('  └─ Full error:', error);
          console.error('═══════════════════════════════════════\n');
          this.errorMessage = error.error?.message || 'Failed to update user';
          this.cancelEdit();
        },
      });
    }
  }

  toggleUserStatus(user: User): void {
    const userIdentifier = user.email || user.name || 'this user';
    const newStatus = !user.isArchived;
    const action = newStatus ? 'archive' : 'activate';

    console.log('═══════════════════════════════════════');
    console.log('🔄 TOGGLE USER STATUS ACTION');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User identifier:', userIdentifier);
    console.log('  ├─ Current status:', user.isArchived ? 'Archived' : 'Active');
    console.log('  └─ New status:', newStatus ? 'Archived' : 'Active');
    console.log('═══════════════════════════════════════');

    // Confirm only when archiving
    if (newStatus && !confirm(`Are you sure you want to archive ${userIdentifier}? They will no longer be able to log in.`)) {
      console.log('⚠️  Archive cancelled by user');
      console.log('═══════════════════════════════════════\n');
      return;
    }

    console.log('▶ Proceeding with status toggle...');

    this.apiService.archiveUser(user.id, newStatus).subscribe({
      next: updatedUser => {
        console.log('✅ USER STATUS TOGGLED SUCCESSFULLY');
        console.log('  ├─ Updated user:', updatedUser);
        console.log('  └─ New archive status:', updatedUser.isArchived);

        this.refreshGrid();
        console.log('  └─ Grid refreshed');

        this.successMessage = `Successfully ${newStatus ? 'archived' : 'activated'} ${userIdentifier}`;
        console.log('═══════════════════════════════════════\n');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: error => {
        console.error('═══════════════════════════════════════');
        console.error('❌ TOGGLE USER STATUS FAILED');
        console.error('  ├─ Error status:', error.status);
        console.error('  ├─ Error message:', error.error?.message);
        console.error('  └─ Full error:', error);
        console.error('═══════════════════════════════════════\n');
        this.errorMessage = error.error?.message || `Failed to ${action} user`;
      }
    });
  }

  archiveUser(user: User): void {
    const userIdentifier = user.email || user.name || 'this user';

    console.log('═══════════════════════════════════════');
    console.log('📦 ARCHIVE USER ACTION');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User email:', user.email || 'No email');
    console.log('  ├─ User name:', user.name || 'No name');
    console.log('  └─ Identifier for dialog:', userIdentifier);
    console.log('═══════════════════════════════════════');

    if (
      !confirm(
        `Are you sure you want to archive ${userIdentifier}? They will no longer be able to log in.`
      )
    ) {
      console.log('⚠️  Archive cancelled by user');
      console.log('═══════════════════════════════════════\n');
      return;
    }

    console.log('▶ Proceeding with archive...');

    this.apiService.archiveUser(user.id, true).subscribe({
      next: updatedUser => {
        console.log('✅ USER ARCHIVED SUCCESSFULLY');
        console.log('  ├─ Updated user:', updatedUser);
        console.log('  └─ Archive status:', updatedUser.isArchived);

        this.refreshGrid();
        console.log('  └─ Grid refreshed');

        this.successMessage = `Successfully archived ${userIdentifier}`;
        console.log('═══════════════════════════════════════\n');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: error => {
        console.error('═══════════════════════════════════════');
        console.error('❌ ARCHIVE USER FAILED');
        console.error('  ├─ Error status:', error.status);
        console.error('  ├─ Error message:', error.error?.message);
        console.error('  └─ Full error:', error);
        console.error('═══════════════════════════════════════\n');
        this.errorMessage = error.error?.message || 'Failed to archive user';
      },
    });
  }

  unarchiveUser(user: User): void {
    const userIdentifier = user.email || user.name || 'this user';

    console.log('═══════════════════════════════════════');
    console.log('📂 UNARCHIVE USER ACTION');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User identifier:', userIdentifier);
    console.log('═══════════════════════════════════════');

    this.apiService.archiveUser(user.id, false).subscribe({
      next: updatedUser => {
        console.log('✅ USER UNARCHIVED SUCCESSFULLY');
        console.log('  ├─ Updated user:', updatedUser);
        console.log('  └─ Archive status:', updatedUser.isArchived);

        this.refreshGrid();
        console.log('  └─ Grid refreshed');

        this.successMessage = `Successfully unarchived ${userIdentifier}`;
        console.log('═══════════════════════════════════════\n');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: error => {
        console.error('═══════════════════════════════════════');
        console.error('❌ UNARCHIVE USER FAILED');
        console.error('  ├─ Error status:', error.status);
        console.error('  ├─ Error message:', error.error?.message);
        console.error('  └─ Full error:', error);
        console.error('═══════════════════════════════════════\n');
        this.errorMessage = error.error?.message || 'Failed to unarchive user';
      },
    });
  }

  deleteUser(user: User): void {
    const userIdentifier = user.email || user.name || 'this user';

    console.log('═══════════════════════════════════════');
    console.log('🗑️  DELETE USER ACTION');
    console.log('  ├─ User ID:', user.id);
    console.log('  ├─ User identifier:', userIdentifier);
    console.log('═══════════════════════════════════════');

    if (!confirm(`Are you sure you want to permanently delete ${userIdentifier}? This action cannot be undone.`)) {
      console.log('⚠️  Delete cancelled by user');
      console.log('═══════════════════════════════════════\n');
      return;
    }

    console.log('▶ Proceeding with deletion...');

    this.apiService.deleteUser(user.id).subscribe({
      next: response => {
        console.log('✅ USER DELETED SUCCESSFULLY');
        console.log('  └─ Message:', response.message);

        this.refreshGrid();
        console.log('  └─ Grid refreshed');

        this.successMessage = `Successfully deleted ${userIdentifier}`;
        console.log('═══════════════════════════════════════\n');
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: error => {
        console.error('═══════════════════════════════════════');
        console.error('❌ DELETE USER FAILED');
        console.error('  ├─ Error status:', error.status);
        console.error('  ├─ Error message:', error.error?.message);
        console.error('  └─ Full error:', error);
        console.error('═══════════════════════════════════════\n');
        this.errorMessage = error.error?.message || 'Failed to delete user';
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
