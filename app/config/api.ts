import { User } from "../components/PersonalAccount/PersonInfo";
import axios from 'axios';

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  diseases?: string[];
  additionalInfo?: string;
  verificationCode?: string;
}

interface MultilingualContent {
  en: string;
  ru?: string;
  ka?: string;
}

interface SyllabusItem {
  title: MultilingualContent;
  description: MultilingualContent;
  duration?: number;
}

interface Announcement {
  title: MultilingualContent;
  content: MultilingualContent;
  isActive: boolean;
}

interface CourseData {
  // ძირითადი ინფორმაცია
  title?: MultilingualContent;
  description?: MultilingualContent;
  shortDescription?: MultilingualContent;
  price?: number;
  thumbnail?: string;
  duration?: number;
  isPublished?: boolean;
  
  // სურათები და მედია
  additionalImages?: string[];
  advertisementImage?: string;
  previewVideoUrl?: string;
  certificateImages?: string[];
  
  // ინსტრუქტორი
  instructor?: {
    name: string;
  };
  
  // მულტილინგვალური კონტენტი
  prerequisites?: MultilingualContent;
  certificateDescription?: MultilingualContent;
  
  // მასივები
  learningOutcomes?: MultilingualContent[];
  syllabus?: SyllabusItem[];
  announcements?: Announcement[];
  languages?: string[];
  tags?: string[];
  
  // კატეგორიები
  categoryId?: string;
  subcategoryId?: string;
  
  // თარიღები
  startDate?: string;
  endDate?: string;
}

// Protected endpoints that require JWT token
const PROTECTED_ENDPOINTS = [
  '/users/me',
  '/api/purchases/my-courses',
  '/purchases/check-access',
  '/purchases/check-course-access',
  '/payment/',
];

function requiresAuth(endpoint: string): boolean {
  return PROTECTED_ENDPOINTS.some(protectedEndpoint => 
    endpoint.startsWith(protectedEndpoint)
  );
}

// ✅ API Configuration - გამოსწორებული
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'development'
      ? 'https://ghrs-backend.onrender.com/api'
      : (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'https://ghrs-backend.onrender.com/api'
          : 'https://ghrs-backend.onrender.com/api')),
  
  ENDPOINTS: {
    UPLOAD: {
      IMAGE: "/upload/image"
    },
    CATEGORIES: "/categories",
    MAIN_CATEGORIES: "/categories",
    COMPLEXES: "/complexes",
    EXERCISES: "/exercises",
    COURSES: "/courses",
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      SEND_VERIFICATION: "/auth/send-verification",
      VERIFY_CODE: "/auth/verify-code",
      RESEND_CODE: "/auth/resend-code",
    },
    ARTICLES: {
      ALL: "/articles",
      JSON: "/articles/json",
      FEATURED: "/articles/featured",
      POPULAR: "/articles/popular",
      SEARCH: "/articles/search",
      BY_CATEGORY: "/articles/category",
      LIKE: "/articles/{id}/like",
      SIMILAR: (id: string) => `/articles/${id}/similar`
    },
    BLOGS: {
      ALL: "/blogs",
      JSON: "/blogs/json",
      FEATURED: "/blogs/featured",
      POPULAR: "/blogs/popular",
      SEARCH: "/blogs/search",
      BY_CATEGORY: "/blogs/category",
      LIKE: "/blogs/{id}/like",
      WITH_ARTICLES: "/blogs/with-articles"
    },
    SETS: {
      ALL: "/sets",
      BY_CATEGORY: (categoryId: string) => `/sets/category/${categoryId}`,
      BY_SUBCATEGORY: (subcategoryId: string) => `/sets/subcategory/${subcategoryId}`,
      BY_ID: (id: string) => `/sets/${id}`,
    },
    PURCHASES: {
      GET_MY_COURSES: '/purchases/my-courses',
      CHECK_ACCESS: (setId: string) => `/purchases/check-access/${setId}`,
      CHECK_COURSE_ACCESS: (courseId: string) => `/purchases/check-course-access/${courseId}`,
    },
    PAYMENTS: {
      CREATE_ORDER: '/payment/create-order',
      CAPTURE_PAYMENT: '/payment/capture-payment',
    },
    INSTRUCTORS: {
      ALL: "/instructors",
      BY_ID: (id: string) => `/instructors/${id}`,
      TOP: "/instructors/top",
      COURSES: (id: string) => `/instructors/${id}/courses`,
      STATS: (id: string) => `/instructors/${id}/stats`,
    },
    STATISTICS: {
      GLOBAL: "/statistics/global",
      USER: "/users/me/statistics",
      ACTIVITY: "/users/me/activity",
    },
  },

  HEADERS: {
    "Content-Type": "application/json",
  },

  TIMEOUT: 15000, // 15 seconds
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Validate endpoint starts with /api
  if (!endpoint.startsWith('/api/')) {
    console.warn(`⚠️ Warning: Endpoint missing /api prefix: ${endpoint}`);
  }
  
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // ვიწყებთ base headers-ით
  const headers: Record<string, string> = {
    ...API_CONFIG.HEADERS,
  };

  // Add JWT token only for protected endpoints
  const isDev = process.env.NODE_ENV === 'development';
  
  if (typeof window !== "undefined" && requiresAuth(endpoint)) {
    const token = localStorage.getItem("token");
    
    if (isDev) {
      console.log('🔐 localStorage token check:', {
        endpoint,
        requiresAuth: true,
        tokenExists: !!token,
        tokenLength: token?.length
      });
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (isDev) console.log('🔐 Authorization header set');
    } else if (isDev) {
      console.log('🔐 No token found in localStorage');
    }
  }

  // Debug logs (only in development)
  if (isDev) {
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!headers.Authorization
    });
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (isDev) {
      console.log('📡 API Response:', {
        url,
        status: response.status,
        ok: response.ok
      });
    }

    if (!response.ok) {
      // Try to get error details from response body
      let errorDetails = '';
      
      // Only log errors for non-401/404 status codes (these are expected in some cases)
      const shouldLogError = response.status !== 401 && response.status !== 404;
      
      if (shouldLogError) {
        console.error('❌ API Error:');
        console.error('  Status:', response.status);
        console.error('  Status Text:', response.statusText);
        console.error('  URL:', url);
        console.error('  Headers:', Object.fromEntries(response.headers.entries()));
      }
      
      try {
        const errorBody = await response.json();
        errorDetails = errorBody.message || errorBody.error || JSON.stringify(errorBody);
        if (shouldLogError) {
          console.error('❌ API Error Response Body:', errorBody);
        }
      } catch (e) {
        // Response body is not JSON
        try {
          errorDetails = await response.text();
          if (shouldLogError) {
            console.error('❌ API Error Response Text:', errorDetails);
          }
        } catch (textError) {
          errorDetails = response.statusText;
          if (shouldLogError) {
            console.error('❌ Could not parse error response');
          }
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${errorDetails || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle AbortError specifically
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('⏰ API Request timeout:', url);
      throw new Error(`Request timeout after ${API_CONFIG.TIMEOUT}ms`);
    }
    
    console.error('❌ API Error:', url, error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function fetchMainCategories<T>(): Promise<T> {
  return apiRequest<T>(API_CONFIG.ENDPOINTS.MAIN_CATEGORIES);
}

// Auth functions
export async function login(email: string, password: string) {
  return apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData: RegistrationData) {
  return apiRequest<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function logout() {
  return apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
    method: "POST",
  });
}

// ვერიფიკაციის ფუნქციები
export async function sendVerificationCode(email: string) {
  return apiRequest(API_CONFIG.ENDPOINTS.AUTH.SEND_VERIFICATION, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyCode(email: string, code: string) {
  return apiRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY_CODE, {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerificationCode(email: string) {
  return apiRequest(API_CONFIG.ENDPOINTS.AUTH.RESEND_CODE, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ✅ გამოსწორებული axios instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to ensure all endpoints have /api prefix
api.interceptors.request.use(
  (config) => {
    // Ensure URL has /api prefix
    if (config.url && !config.url.startsWith('/api/') && !config.url.startsWith('http')) {
      config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Courses
export const fetchCourses = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isPublished?: boolean;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    const response = await api.get('/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Single Course
export const fetchCourse = async (id: string) => {
  try {
    console.log('Fetching course from API:', `${API_CONFIG.BASE_URL}/courses/${id}`);
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching single course:', error);
    throw error;
  }
};

// ყველა ველის მომზადება გაგზავნისთვის
const prepareCourseData = (courseData: CourseData): CourseData => {
  const prepared: CourseData = {
    ...courseData,
    // მასივები - ყოველთვის უნდა იყოს (ცარიელი მასივიც კი)
    additionalImages: courseData.additionalImages || [],
    certificateImages: courseData.certificateImages || [],
    learningOutcomes: courseData.learningOutcomes || [],
    tags: courseData.tags || [],
    announcements: courseData.announcements || [],
    syllabus: (courseData.syllabus || []).map(item => ({
      ...item,
      duration: item.duration || 0 // duration ყოველთვის უნდა იყოს
    })),
    languages: courseData.languages || [],
  };

  // მულტილინგვალური ველების დამუშავება
  if (courseData.title) {
    prepared.title = {
      en: courseData.title.en || '',
      ru: courseData.title.ru || courseData.title.en || '',
      ka: courseData.title.ka || courseData.title.en || ''
    };
  }

  if (courseData.description) {
    prepared.description = {
      en: courseData.description.en || '',
      ru: courseData.description.ru || courseData.description.en || '',
      ka: courseData.description.ka || courseData.description.en || ''
    };
  }

  if (courseData.shortDescription) {
    prepared.shortDescription = {
      en: courseData.shortDescription.en || '',
      ru: courseData.shortDescription.ru || courseData.shortDescription.en || '',
      ka: courseData.shortDescription.ka || courseData.shortDescription.en || ''
    };
  }

  if (courseData.prerequisites) {
    prepared.prerequisites = {
      en: courseData.prerequisites.en || '',
      ru: courseData.prerequisites.ru || courseData.prerequisites.en || '',
      ka: courseData.prerequisites.ka || courseData.prerequisites.en || ''
    };
  }

  if (courseData.certificateDescription) {
    prepared.certificateDescription = {
      en: courseData.certificateDescription.en || '',
      ru: courseData.certificateDescription.ru || courseData.certificateDescription.en || '',
      ka: courseData.certificateDescription.ka || courseData.certificateDescription.en || ''
    };
  }

  return prepared;
};

// Update Course
export const updateCourse = async (id: string, courseData: CourseData) => {
  try {
    const token = localStorage.getItem('token');
    const preparedData = prepareCourseData(courseData);
    
    const response = await api.patch(`/courses/${id}`, preparedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Create Course
export const createCourse = async (courseData: CourseData) => {
  try {
    const token = localStorage.getItem('token');
    const preparedData = prepareCourseData(courseData);
    
    const response = await api.post('/courses', preparedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Delete Course
export const deleteCourse = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/courses/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Fetch Courses by Category
export const fetchCoursesByCategory = async (categoryId: string, params?: {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  excludeId?: string;
}) => {
  try {
    const response = await api.get(`/courses/by-category/${categoryId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by category:', error);
    throw error;
  }
};

// Fetch Related Courses (same category, excluding current course)
export const fetchRelatedCourses = async (courseId: string, categoryId: string, limit: number = 4) => {
  try {
    const response = await api.get(`/courses/by-category/${categoryId}`, { 
      params: { 
        limit,
        excludeId: courseId // ახალი პარამეტრი - მიმდინარე კურსის გამორიცხვისთვის
      } 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching related courses:', error);
    throw error;
  }
};