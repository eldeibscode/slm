import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User, Role } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('ApiService.login called with:', credentials);
    console.log('Posting to:', `${this.apiUrl}/auth/login`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  getCurrentUser(): Observable<User> {
    console.log('ApiService.getCurrentUser called');
    console.log('Getting current user from:', `${this.apiUrl}/auth/me`);
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  // User management endpoints (admin only)
  getAllUsers(): Observable<User[]> {
    console.log('═══════════════════════════════════════');
    console.log('👥 GET ALL USERS API CALL');
    console.log('  ├─ URL:', `${this.apiUrl}/users`);
    console.log('  └─ Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════');

    return this.http.get<{ users: User[]; total: number }>(`${this.apiUrl}/users`).pipe(
      tap(response => {
        console.log('✅ GET ALL USERS RESPONSE');
        console.log('  ├─ Total users:', response.total);
        console.log('  ├─ Users array length:', response.users.length);
        console.log('  └─ Users:', response.users);
        console.log('═══════════════════════════════════════\n');
      }),
      map(response => response.users)
    );
  }

  getUserById(userId: number): Observable<User> {
    console.log('ApiService.getUserById called with:', userId);
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(userId: number, updateData: { role?: Role; password?: string }): Observable<User> {
    console.log('═══════════════════════════════════════');
    console.log('🔄 UPDATE USER API CALL');
    console.log('  ├─ User ID:', userId);
    console.log('  ├─ Update data:', updateData);
    console.log('  └─ URL:', `${this.apiUrl}/users/${userId}`);
    console.log('═══════════════════════════════════════');

    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/users/${userId}`, updateData)
      .pipe(
        tap(response => {
          console.log('✅ UPDATE USER RESPONSE');
          console.log('  ├─ Message:', response.message);
          console.log('  ├─ Updated user:', response.user);
          console.log('═══════════════════════════════════════\n');
        }),
        map(response => response.user)
      );
  }

  updateUserRole(userId: number, role: Role): Observable<User> {
    console.log('═══════════════════════════════════════');
    console.log('🔄 UPDATE USER ROLE API CALL');
    console.log('  ├─ User ID:', userId);
    console.log('  ├─ New role:', role);
    console.log('  └─ URL:', `${this.apiUrl}/users/${userId}/role`);
    console.log('═══════════════════════════════════════');

    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/users/${userId}/role`, { role })
      .pipe(
        tap(response => {
          console.log('✅ UPDATE USER ROLE RESPONSE');
          console.log('  ├─ Message:', response.message);
          console.log('  ├─ Updated user:', response.user);
          console.log('═══════════════════════════════════════\n');
        }),
        map(response => response.user)
      );
  }

  archiveUser(userId: number, isArchived: boolean): Observable<User> {
    console.log('═══════════════════════════════════════');
    console.log('📦 ARCHIVE USER API CALL');
    console.log('  ├─ User ID:', userId);
    console.log('  ├─ Archive status:', isArchived);
    console.log('  └─ URL:', `${this.apiUrl}/users/${userId}/archive`);
    console.log('═══════════════════════════════════════');

    return this.http
      .patch<{
        message: string;
        user: User;
      }>(`${this.apiUrl}/users/${userId}/archive`, { isArchived })
      .pipe(
        tap(response => {
          console.log('✅ ARCHIVE USER RESPONSE');
          console.log('  ├─ Message:', response.message);
          console.log('  ├─ Updated user:', response.user);
          console.log('═══════════════════════════════════════\n');
        }),
        map(response => response.user)
      );
  }

  deleteUser(userId: number): Observable<{ message: string }> {
    console.log('═══════════════════════════════════════');
    console.log('🗑️  DELETE USER API CALL');
    console.log('  ├─ User ID:', userId);
    console.log('  └─ URL:', `${this.apiUrl}/users/${userId}`);
    console.log('═══════════════════════════════════════');

    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/users/${userId}`)
      .pipe(
        tap(response => {
          console.log('✅ DELETE USER RESPONSE');
          console.log('  ├─ Message:', response.message);
          console.log('═══════════════════════════════════════\n');
        })
      );
  }

  // Update current user's profile
  updateProfile(updateData: { name?: string; password?: string }): Observable<User> {
    console.log('═══════════════════════════════════════');
    console.log('👤 UPDATE PROFILE API CALL');
    console.log('  ├─ Update data:', updateData);
    console.log('  └─ URL:', `${this.apiUrl}/auth/profile`);
    console.log('═══════════════════════════════════════');

    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/auth/profile`, updateData)
      .pipe(
        tap(response => {
          console.log('✅ UPDATE PROFILE RESPONSE');
          console.log('  ├─ Message:', response.message);
          console.log('  ├─ Updated user:', response.user);
          console.log('═══════════════════════════════════════\n');
        }),
        map(response => response.user)
      );
  }
}
