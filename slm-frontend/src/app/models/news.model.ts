// Core report interface
export interface Report {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  author: {
    id: number;
    name: string;
    email: string;
  };
  category?: Category;
  tags: Tag[];
  images: ReportImage[];
  viewCount: number;
  featuredImage?: string;
  featuredImageId?: number;
}

// Category for organizing reports
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

// Tags for additional organization
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Images associated with a report
export interface ReportImage {
  id: number;
  reportId: number;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  order: number;
  uploadedAt: Date;
}

// Request/Response DTOs
export interface CreateReportRequest {
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  categoryId?: number;
  tagIds: number[];
  featuredImageId?: number;
  featuredImage?: string;
}

export interface UpdateReportRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  categoryId?: number;
  tagIds?: number[];
  featuredImageId?: number;
  featuredImage?: string;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReportFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  tagIds?: number[];
  status?: 'draft' | 'published' | 'archived';
  authorId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'viewCount' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ImageUploadResponse {
  image: ReportImage;
  message: string;
}

// For homepage "latest news" section
export interface LatestReportSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: Date;
  category?: {
    name: string;
    color?: string;
  };
}
