import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Hero,
  CreateHeroRequest,
  UpdateHeroRequest,
  PublishedCountResponse,
} from '../models/hero.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/heroes`;

  constructor(private http: HttpClient) {}

  // Get all heroes (public)
  getHeroes(status: 'draft' | 'published' | 'archived' | 'all' = 'published'): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}?status=${status}`);
  }

  // Get single hero by ID
  getHeroById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  // Get published count (for X/5 display)
  getPublishedCount(): Observable<PublishedCountResponse> {
    return this.http.get<PublishedCountResponse>(`${this.apiUrl}/count/published`);
  }

  // Create hero (admin only)
  createHero(data: CreateHeroRequest): Observable<{ message: string; hero: Hero }> {
    return this.http.post<{ message: string; hero: Hero }>(this.apiUrl, data);
  }

  // Update hero (admin only)
  updateHero(id: number, data: UpdateHeroRequest): Observable<{ message: string; hero: Hero }> {
    return this.http.patch<{ message: string; hero: Hero }>(`${this.apiUrl}/${id}`, data);
  }

  // Delete hero (admin only)
  deleteHero(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
