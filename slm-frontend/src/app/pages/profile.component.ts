import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../components/ui/container.component';
import { ButtonComponent } from '../components/ui/button.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ContainerComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 py-24">
      <ui-container>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">My Profile</h1>
          <p class="text-secondary-600">Update your personal information and password</p>
        </div>

        <!-- Messages -->
        @if (errorMessage()) {
          <div class="rounded-md bg-red-50 p-4 mb-6">
            <p class="text-sm text-red-800">{{ errorMessage() }}</p>
          </div>
        }

        @if (successMessage()) {
          <div class="rounded-md bg-primary-50 p-4 mb-6">
            <p class="text-sm text-primary-800">{{ successMessage() }}</p>
          </div>
        }

        <!-- Profile Form -->
        <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
          <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
            <!-- Current Info Display -->
            <div class="mb-6 p-4 bg-secondary-50 rounded-md">
              <h3 class="text-sm font-medium text-secondary-700 mb-2">Account Information</h3>
              <div class="space-y-1 text-sm">
                <p><strong>Email:</strong> {{ currentUser()?.email }}</p>
                <p><strong>Role:</strong> <span class="capitalize">{{ currentUser()?.role }}</span></p>
                <p><strong>Member since:</strong> {{ currentUser()?.createdAt | date: 'mediumDate' }}</p>
              </div>
            </div>

            <!-- Name Field -->
            <div class="mb-6">
              <label for="name" class="block text-sm font-medium text-secondary-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="profileData.name"
                class="w-full border border-secondary-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your name"
              />
              <p class="mt-1 text-sm text-secondary-500">This is the name that will be displayed across the platform</p>
            </div>

            <!-- Password Section -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-secondary-700 mb-3">Change Password</h3>
              <p class="text-sm text-secondary-500 mb-4">Leave blank if you don't want to change your password</p>

              <!-- New Password -->
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-secondary-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="profileData.password"
                  class="w-full border border-secondary-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                  minlength="6"
                />
              </div>

              <!-- Confirm Password -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-secondary-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  class="w-full border border-secondary-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex gap-4 pt-4 border-t">
              <ui-button
                type="submit"
                [disabled]="isLoading()"
                class="flex-1"
              >
                @if (isLoading()) {
                  <span>Saving...</span>
                } @else {
                  <span>Save Changes</span>
                }
              </ui-button>
              <ui-button
                type="button"
                variant="outline"
                routerLink="/"
                class="flex-1"
              >
                Cancel
              </ui-button>
            </div>
          </form>
        </div>
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
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  profileData = {
    name: '',
    password: '',
  };
  confirmPassword = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUser.set(user);
      this.profileData.name = user.name || '';
    }
  }

  saveProfile(): void {
    this.clearMessages();

    // Validate password match if password is provided
    if (this.profileData.password && this.profileData.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    // Validate password length if provided
    if (this.profileData.password && this.profileData.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters long');
      return;
    }

    // Build update payload
    const updateData: { name?: string; password?: string } = {};

    // Only include fields that have changed
    if (this.profileData.name !== (this.currentUser()?.name || '')) {
      updateData.name = this.profileData.name;
    }

    if (this.profileData.password) {
      updateData.password = this.profileData.password;
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      this.errorMessage.set('No changes to save');
      return;
    }

    this.isLoading.set(true);

    this.apiService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        console.log('Profile updated successfully:', updatedUser);

        // Update the auth service with the new user data
        this.authService.updateCurrentUser(updatedUser);

        // Update local state
        this.currentUser.set(updatedUser);
        this.profileData.name = updatedUser.name || '';
        this.profileData.password = '';
        this.confirmPassword = '';

        this.successMessage.set('Profile updated successfully!');
        this.isLoading.set(false);

        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage.set(error.error?.message || 'Failed to update profile');
        this.isLoading.set(false);
      },
    });
  }

  clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
