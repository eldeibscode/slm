// Core hero interface
export interface Hero {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  socialProof: string;
  displayOrder: number;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Request DTOs
export interface CreateHeroRequest {
  title: string;
  subtitle: string;
  badge: string;
  socialProof: string;
  displayOrder?: number;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  status?: 'draft' | 'published';
}

export interface UpdateHeroRequest {
  title?: string;
  subtitle?: string;
  badge?: string;
  socialProof?: string;
  displayOrder?: number;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface PublishedCountResponse {
  count: number;
  max: number;
}
