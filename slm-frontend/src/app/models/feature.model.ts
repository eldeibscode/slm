// Core feature interface
export interface Feature {
  id: number;
  icon?: string;
  title?: string;
  description?: string;
  displayOrder?: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Request DTOs
export interface CreateFeatureRequest {
  icon?: string;
  title?: string;
  description?: string;
  displayOrder?: number;
  status?: 'draft' | 'published';
}

export interface UpdateFeatureRequest {
  icon?: string;
  title?: string;
  description?: string;
  displayOrder?: number;
  status?: 'draft' | 'published' | 'archived';
}

// Response DTOs
export interface FeatureListResponse {
  features: Feature[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FeatureFilterParams {
  page?: number;
  pageSize?: number;
  status?: 'draft' | 'published' | 'archived' | 'all';
}

// Section settings for the feature section header
export interface FeatureSectionSetting {
  id?: number;
  sectionTitle?: string;
  sectionDescription?: string;
}
