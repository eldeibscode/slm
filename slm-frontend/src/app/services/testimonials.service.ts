import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Testimonial,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
} from '../models/testimonial.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsService {
  private apiUrl = `${environment.apiUrl}/testimonials`;

  constructor(private http: HttpClient) {}

  // Get all testimonials (public)
  getTestimonials(status: 'draft' | 'published' | 'archived' = 'published'): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}?status=${status}`);
  }

  // Get single testimonial by ID
  getTestimonialById(id: number): Observable<Testimonial> {
    return this.http.get<Testimonial>(`${this.apiUrl}/${id}`);
  }

  // Create testimonial (admin only)
  createTestimonial(data: CreateTestimonialRequest): Observable<{ message: string; testimonial: Testimonial }> {
    return this.http.post<{ message: string; testimonial: Testimonial }>(this.apiUrl, data);
  }

  // Update testimonial (admin only)
  updateTestimonial(
    id: number,
    data: UpdateTestimonialRequest
  ): Observable<{ message: string; testimonial: Testimonial }> {
    return this.http.patch<{ message: string; testimonial: Testimonial }>(`${this.apiUrl}/${id}`, data);
  }

  // Delete testimonial (admin only)
  deleteTestimonial(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
