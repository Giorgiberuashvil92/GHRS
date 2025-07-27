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

// Public endpoints რომელთაც authorization არ სჭირდება
const PUBLIC_ENDPOINTS = [
  '/categories',
  '/sets',
  '/exercises',
  '/articles',
  '/blogs',
  '/test',
  '/users-count'
];

function isPublicEndpoint(endpoint: string): boolean {
  return PUBLIC_ENDPOINTS.some(publicEndpoint => 
    endpoint.startsWith(publicEndpoint)
  );
}

// API Configuration
export const API_CONFIG = {
   // URL კონფიგურაცია გარემოს მიხედვით
  //  BASE_URL: process.env.NODE_ENV === 'development'
  //  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  //  : (process.env.NEXT_PUBLIC_API_URL || "https://ghrs-backend.onrender.com"),
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  ENDPOINTS: {
    UPLOAD: {
      IMAGE: "/upload/image"
    },
    CATEGORIES: "/categories",
    MAIN_CATEGORIES: "/categories",
    COMPLEXES: "/api/complexes",
    EXERCISES: "/exercises",
    COURSES: "/api/courses",
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
      BY_SUBCATEGORY: (subcategoryId: string) =>
        `/sets/subcategory/${subcategoryId}`,
      BY_ID: (id: string) => `/sets/${id}`,
    },
    PURCHASES: {
      GET_MY_COURSES: '/purchases/my-courses',
      CHECK_ACCESS: (setId: string) => `/purchases/check-access/${setId}`,
    },
    PAYMENTS: {
      CREATE_ORDER: '/payment/create-order',
      CAPTURE_PAYMENT: '/payment/capture-payment',
    },
  },

  HEADERS: {
    "Content-Type": "application/json",
  },

  TIMEOUT: 10000,
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // ვიწყებთ base headers-ით
  const headers: Record<string, string> = {
    ...API_CONFIG.HEADERS,
  };

  // მხოლოდ protected endpoints-ისთვის ვუმატებთ Authorization header-ს
  if (!isPublicEndpoint(endpoint) && 
      typeof window !== "undefined" && 
      localStorage.getItem("token")) {
    headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.log('Fetching course from API:', `${API_URL}/courses/${id}`);
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching single course:', error);
    throw error;
  }
};
