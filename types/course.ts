export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  imageUrl: string;
  mobileImageUrl?: string;
  categoryId: number;
  category?: Category;
  instructorId?: number;
  instructor?: Instructor;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  backgroundImageUrl?: string;
  isActive: boolean;
}

export interface Instructor {
  id: number;
  name: string;
  bio?: string;
  avatarUrl?: string;
  specialization?: string;
}

export interface CourseFilters {
  categoryId?: number;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  imageUrl: string;
  mobileImageUrl?: string;
  categoryId: number;
  instructorId?: number;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  isFeatured: boolean;
} 