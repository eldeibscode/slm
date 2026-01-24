import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Feature,
  FeatureListResponse,
  FeatureFilterParams,
  CreateFeatureRequest,
  UpdateFeatureRequest,
} from '../models/feature.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============================================================================
  // PUBLIC FEATURE FETCHING
  // ============================================================================

  /**
   * Get all published features for public display
   * Returns features ordered by displayOrder (NULLS LAST) then createdAt DESC
   */
  getPublishedFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features/published`);
  }

  // ============================================================================
  // ADMIN FEATURE MANAGEMENT
  // ============================================================================

  /**
   * Get all features with pagination (admin only)
   */
  getAllFeatures(filters?: FeatureFilterParams): Observable<FeatureListResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof FeatureFilterParams];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<FeatureListResponse>(`${this.apiUrl}/features`, { params });
  }

  /**
   * Get single feature by ID (for editing)
   */
  getFeatureById(id: number | string): Observable<Feature> {
    return this.http.get<Feature>(`${this.apiUrl}/features/${id}`);
  }

  /**
   * Create new feature
   */
  createFeature(data: CreateFeatureRequest): Observable<Feature> {
    return this.http.post<Feature>(`${this.apiUrl}/features`, data);
  }

  /**
   * Update existing feature
   */
  updateFeature(id: number | string, data: UpdateFeatureRequest): Observable<Feature> {
    return this.http.patch<Feature>(`${this.apiUrl}/features/${id}`, data);
  }

  /**
   * Delete feature
   */
  deleteFeature(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/features/${id}`);
  }
}
