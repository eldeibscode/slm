import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Report,
  ReportListResponse,
  ReportFilterParams,
  CreateReportRequest,
  UpdateReportRequest,
  Category,
  Tag,
  ReportImage,
  ImageUploadResponse,
  LatestReportSummary,
} from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============================================================================
  // PUBLIC REPORT FETCHING
  // ============================================================================

  /**
   * Get paginated list of published reports with optional filters
   */
  getReports(filters?: ReportFilterParams): Observable<ReportListResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ReportFilterParams];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => (params = params.append(key, v.toString())));
          } else {
            params = params.append(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ReportListResponse>(`${this.apiUrl}/reports`, { params });
  }

  /**
   * Get single report by slug (for public viewing)
   */
  getReportBySlug(slug: string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/reports/slug/${slug}`);
  }

  /**
   * Get latest published reports for homepage
   */
  getLatestReports(count: number = 3): Observable<LatestReportSummary[]> {
    return this.http.get<LatestReportSummary[]>(`${this.apiUrl}/reports/latest`, {
      params: { limit: count.toString() },
    });
  }

  // ============================================================================
  // ADMIN/REPORTER REPORT MANAGEMENT
  // ============================================================================

  /**
   * Get current user's reports (admin sees all, reporter sees own)
   */
  getMyReports(filters?: ReportFilterParams): Observable<ReportListResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ReportFilterParams];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => (params = params.append(key, v.toString())));
          } else {
            params = params.append(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ReportListResponse>(`${this.apiUrl}/reports/my/list`, { params });
  }

  /**
   * Get single report by ID (for editing)
   */
  getReportById(id: number | string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/reports/${id}`);
  }

  /**
   * Create new report
   */
  createReport(data: CreateReportRequest): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports`, data);
  }

  /**
   * Update existing report
   */
  updateReport(id: number | string, data: UpdateReportRequest): Observable<Report> {
    return this.http.patch<Report>(`${this.apiUrl}/reports/${id}`, data);
  }

  /**
   * Delete report
   */
  deleteReport(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reports/${id}`);
  }

  /**
   * Publish a draft report
   */
  publishReport(id: number | string): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports/${id}/publish`, {});
  }

  /**
   * Archive a report
   */
  archiveReport(id: number | string): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports/${id}/archive`, {});
  }

  /**
   * Increment view count for a report (public endpoint)
   */
  incrementViewCount(id: number | string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reports/${id}/view`, {});
  }

  // ============================================================================
  // CATEGORY MANAGEMENT
  // ============================================================================

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number | string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  }

  /**
   * Create new category (admin only)
   */
  createCategory(data: Omit<Category, 'id' | 'slug'>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, data);
  }

  /**
   * Update category (admin only)
   */
  updateCategory(id: number | string, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/categories/${id}`, data);
  }

  /**
   * Delete category (admin only)
   */
  deleteCategory(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/categories/${id}`);
  }

  // ============================================================================
  // TAG MANAGEMENT
  // ============================================================================

  /**
   * Get all tags
   */
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }

  /**
   * Create new tag (admin/reporter)
   */
  createTag(data: Omit<Tag, 'id' | 'slug'>): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, data);
  }

  /**
   * Delete tag (admin only)
   */
  deleteTag(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tags/${id}`);
  }

  // ============================================================================
  // IMAGE MANAGEMENT
  // ============================================================================

  /**
   * Upload image for a report
   */
  uploadImage(reportId: number | string, formData: FormData): Observable<ImageUploadResponse> {
    return this.http.post<ImageUploadResponse>(
      `${this.apiUrl}/reports/${reportId}/images`,
      formData
    );
  }

  /**
   * Delete report image
   */
  deleteImage(reportId: number | string, imageId: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/reports/${reportId}/images/${imageId}`
    );
  }

  /**
   * Update image order
   */
  updateImageOrder(reportId: number | string, imageId: number | string, order: number): Observable<ReportImage> {
    return this.http.patch<ReportImage>(
      `${this.apiUrl}/reports/${reportId}/images/${imageId}/order`,
      { order }
    );
  }
}
