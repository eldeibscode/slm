// Core testimonial interface
export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
  company?: string;
  rating: number;
  status: 'draft' | 'published' | 'archived';
  order: number;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request DTOs
export interface CreateTestimonialRequest {
  quote: string;
  author: string;
  title: string;
  company?: string;
  rating?: number;
  status?: 'draft' | 'published';
  order?: number;
  avatarUrl?: string;
}

export interface UpdateTestimonialRequest {
  quote?: string;
  author?: string;
  title?: string;
  company?: string;
  rating?: number;
  status?: 'draft' | 'published' | 'archived';
  order?: number;
  avatarUrl?: string;
}
