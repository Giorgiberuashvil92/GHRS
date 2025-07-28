import { API_CONFIG, apiRequest } from '../config/api';
import { Article } from './articles';

export interface Blog {
  _id: string;
  title: {
    ka: string;
    en: string;
    ru: string;
  };
  description: {
    ka: string;
    en: string;
    ru: string;
  };
  excerpt: {
    ka: string;
    en: string;
    ru: string;
  };
  imageUrl: string;
  categoryId: string;
  link: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishDate: Date;
  viewsCount: number;
  likesCount: number;
  isActive: boolean;
  sortOrder: number;
  articles?: Article[];  // Add the articles field
}

export interface CreateBlogDto {
  title: {
    ka: string;
    en: string;
    ru: string;
  };
  description: {
    ka: string;
    en: string;
    ru: string;
  };
  excerpt: {
    ka: string;
    en: string;
    ru: string;
  };
  imageUrl?: string;
  categoryId: string;
  link: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

// Get all blogs
export const getBlogs = async (params?: { 
  page?: number; 
  limit?: number;
  categoryId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
  if (params?.isPublished !== undefined) searchParams.append('isPublished', params.isPublished.toString());
  if (params?.isFeatured !== undefined) searchParams.append('isFeatured', params.isFeatured.toString());

  const queryString = searchParams.toString();
  const endpoint = `${API_CONFIG.ENDPOINTS.BLOGS.ALL}${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<Blog[]>(endpoint);
};

// Get featured blogs
export const getFeaturedBlogs = async () => {
  return apiRequest<Blog[]>(API_CONFIG.ENDPOINTS.BLOGS.FEATURED);
};

// Get popular blogs
export const getPopularBlogs = async (limit?: number) => {
  const endpoint = `${API_CONFIG.ENDPOINTS.BLOGS.POPULAR}${limit ? `?limit=${limit}` : ''}`;
  return apiRequest<Blog[]>(endpoint);
};

// Get blog by ID
export const getBlogById = async (id: string) => {
  return apiRequest<Blog>(`${API_CONFIG.ENDPOINTS.BLOGS.ALL}/${id}`);
};

// Create blog with JSON
export const createBlog = async (data: CreateBlogDto) => {
  // Validate translations
  const validateTranslations = (field: string, translations: { ka: string; en: string; ru: string }) => {
    if (!translations.en || !translations.ru) {
      throw new Error(`${field} translations are required`);
    }
  };

  validateTranslations('Title', data.title);
  validateTranslations('Description', data.description);
  validateTranslations('Excerpt', data.excerpt);

  return apiRequest<Blog>(`${API_CONFIG.ENDPOINTS.BLOGS.JSON}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Create blog with image upload
export const createBlogWithImage = async (data: FormData) => {
  return apiRequest<Blog>(API_CONFIG.ENDPOINTS.BLOGS.ALL, {
    method: 'POST',
    headers: {
      // Don't set Content-Type, browser will set it with boundary
      'Accept': 'application/json',
    },
    body: data
  });
};

// Update blog
export const updateBlog = async (id: string, data: Partial<CreateBlogDto>) => {
  return apiRequest<Blog>(`${API_CONFIG.ENDPOINTS.BLOGS.ALL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

// Delete blog
export const deleteBlog = async (id: string) => {
  return apiRequest<void>(`${API_CONFIG.ENDPOINTS.BLOGS.ALL}/${id}`, {
    method: 'DELETE'
  });
};

// Like blog
export const likeBlog = async (id: string) => {
  return apiRequest<Blog>(API_CONFIG.ENDPOINTS.BLOGS.LIKE.replace('{id}', id), {
    method: 'POST'
  });
};

// Search blogs
export const searchBlogs = async (query: string) => {
  return apiRequest<Blog[]>(`${API_CONFIG.ENDPOINTS.BLOGS.SEARCH}?q=${encodeURIComponent(query)}`);
};

// Get blogs by category
export const getBlogsByCategory = async (categoryId: string) => {
  return apiRequest<Blog[]>(`${API_CONFIG.ENDPOINTS.BLOGS.BY_CATEGORY}/${categoryId}`);
}; 