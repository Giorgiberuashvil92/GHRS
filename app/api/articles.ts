import { API_CONFIG, apiRequest } from '../config/api';

export interface Article {
  _id: string;
  title: {
    ka: string;
    en: string;
    ru: string;
  };
  excerpt: {
    ka: string;
    en: string;
    ru: string;
  };
  content: {
    ka: string;
    en: string;
    ru: string;
  };
  blogId: string;
  categoryId: string;
  category?: {
    _id: string;
    name: {
      ka: string;
      en: string;
      ru: string;
    };
    description?: {
      ka: string;
      en: string;
      ru: string;
    };
    image?: string;
  };
  featuredImages: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  readTime: string;
  commentsCount: number;
  tableOfContents: {
    title: {
      ka: string;
      en: string;
      ru: string;
    };
    anchor: string;
  }[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishDate: Date;
  viewsCount: number;
  likesCount: number;
  isActive: boolean;
  sortOrder: number;
  comments?: Array<{
    author: string;
    date: string;
    content: string;
    avatar?: string;
  }>;
}

export interface CreateArticleDto {
  title: {
    ka: string;
    en: string;
    ru: string;
  };
  excerpt: {
    ka: string;
    en: string;
    ru: string;
  };
  content: {
    ka: string;
    en: string;
    ru: string;
  };
  blogId: string;
  categoryId: string;
  featuredImages?: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  readTime: string;
  tableOfContents?: {
    title: {
      ka: string;
      en: string;
      ru: string;
    };
    anchor: string;
  }[];
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

// Get all articles
export const getArticles = async (params?: { 
  page?: number; 
  limit?: number;
  blogId?: string;
  categoryId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.blogId) searchParams.append('blogId', params.blogId);
  if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
  if (params?.isPublished !== undefined) searchParams.append('isPublished', params.isPublished.toString());
  if (params?.isFeatured !== undefined) searchParams.append('isFeatured', params.isFeatured.toString());

  const queryString = searchParams.toString();
  const endpoint = `${API_CONFIG.ENDPOINTS.ARTICLES.ALL}${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<Article[]>(endpoint);
};

// Get featured articles
export const getFeaturedArticles = async () => {
  return apiRequest<Article[]>(API_CONFIG.ENDPOINTS.ARTICLES.FEATURED);
};

// Get popular articles
export const getPopularArticles = async (limit?: number) => {
  const endpoint = `${API_CONFIG.ENDPOINTS.ARTICLES.POPULAR}${limit ? `?limit=${limit}` : ''}`;
  return apiRequest<Article[]>(endpoint);
};

// Get article by ID
export const getArticleById = async (id: string) => {
  return apiRequest<Article>(`${API_CONFIG.ENDPOINTS.ARTICLES.ALL}/${id}`);
};

// Create article with JSON
export const createArticle = async (data: CreateArticleDto) => {
  // Validate required fields
  if (!data.title?.ka) {
    throw new Error('Title is required in Georgian');
  }
  if (!data.excerpt?.ka) {
    throw new Error('Excerpt is required in Georgian');
  }
  if (!data.content?.ka) {
    throw new Error('Content is required in Georgian');
  }
  if (!data.blogId) {
    throw new Error('Blog ID is required');
  }
  if (!data.categoryId) {
    throw new Error('Category ID is required');
  }
  if (!data.author?.name) {
    throw new Error('Author name is required');
  }
  if (!data.readTime) {
    throw new Error('Read time is required');
  }

  
  return apiRequest<Article>(API_CONFIG.ENDPOINTS.ARTICLES.JSON, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Create article with image upload
export const createArticleWithImages = async (data: FormData) => {
  return apiRequest<Article>(API_CONFIG.ENDPOINTS.ARTICLES.ALL, {
    method: 'POST',
    headers: {
      // Don't set Content-Type, browser will set it with boundary
      'Accept': 'application/json',
    },
    body: data
  });
};

// Update article
export const updateArticle = async (id: string, data: Partial<CreateArticleDto>) => {
  return apiRequest<Article>(`${API_CONFIG.ENDPOINTS.ARTICLES.ALL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

// Delete article
export const deleteArticle = async (id: string) => {
  return apiRequest<void>(`${API_CONFIG.ENDPOINTS.ARTICLES.ALL}/${id}`, {
    method: 'DELETE'
  });
};

// Like article
export const likeArticle = async (id: string) => {
  return apiRequest<Article>(API_CONFIG.ENDPOINTS.ARTICLES.LIKE.replace('{id}', id), {
    method: 'POST'
  });
};

// Search articles
export const searchArticles = async (query: string) => {
  return apiRequest<Article[]>(`${API_CONFIG.ENDPOINTS.ARTICLES.SEARCH}?q=${encodeURIComponent(query)}`);
};

// Get articles by category
export const getArticlesByCategory = async (categoryId: string) => {
  return apiRequest<Article[]>(`${API_CONFIG.ENDPOINTS.ARTICLES.BY_CATEGORY}/${categoryId}`);
};

// Get articles by blog
export const getArticlesByBlog = async (blogId: string) => {
  return apiRequest<Article[]>(`${API_CONFIG.ENDPOINTS.ARTICLES.ALL}/blog/${blogId}`);
}; 