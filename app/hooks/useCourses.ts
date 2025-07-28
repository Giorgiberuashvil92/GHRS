/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";

export interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category?: {
    id: number;
    name: string;
  };
  instructor?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

interface BackendCourse {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  image: string;
  price: number;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  category: string;
  subcategory?: string | null;
  lessons: string[];
  rating: number;
  reviewsCount: number;
  isPublished: boolean;
  lessonsCount: number;
  studentsCount: number;
  tags: string[];
  requirements: string[];
  objectives: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getFallbackCourses(): Course[] {
  return [
    {
      id: 1,
      title: "Ортопедия",
      description: "Улучшение динамики и подвижности грудного отдела",
      price: "920 ₽/მთვე",
      image: "/assets/images/workMan.png",
      duration: "12 საათი",
      level: "beginner",
    },
    {
      id: 2,
      title: "Неврология",
      description: "Восстановление нервной системы и координации движений",
      price: "1200 ₽/მთვე",
      image: "/assets/images/workMan.png",
      duration: "16 საათი",
      level: "intermediate",
    },
    {
      id: 3,
      title: "Кардиология",
      description: "Укрепление сердечно-сосудистой системы",
      price: "850 ₽/მთვე",
      image: "/assets/images/workMan.png",
      duration: "8 საათი",
      level: "advanced",
    },
    {
      id: 4,
      title: "Реабилитация",
      description: "Комплексная программа восстановления",
      price: "1500 ₽/მთვე",
      image: "/assets/images/workMan.png",
      duration: "20 საათი",
      level: "intermediate",
    },
  ];
}

export function useCourses(categoryId?: number): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Import API function dynamically
      const { apiRequest, API_CONFIG } = await import("../config/api");

      let endpoint = API_CONFIG.ENDPOINTS.COURSES;
      if (categoryId) {
        endpoint += `?categoryId=${categoryId}`;
      }

      console.log("🔗 Fetching courses from:", endpoint);

      const backendCourses: BackendCourse[] = await apiRequest<BackendCourse[]>(
        endpoint
      );

      console.log("📊 Received courses:", backendCourses);

      // Check if it's an array
      if (!Array.isArray(backendCourses)) {
        throw new Error("API response is not an array");
      }

      // Transform data to match frontend interface
      const transformedCourses: Course[] = backendCourses
        .filter((course) => course.isActive && course.isPublished)
        .map((course, index) => ({
          id: parseInt(course._id.slice(-8), 16) || index + 1, // Convert MongoDB _id to number
          title: course.title,
          description: course.description.replace(/<[^>]*>/g, ""), // Remove HTML tags
          price: `${course.price} ₽`,
          image: course.image || "/assets/images/course.png",
          duration: `${course.duration} საათი`,
          level: course.level,
          instructor: course.instructor, // This might be an ID, we might need to populate it
        }));

      console.log("✅ Transformed courses:", transformedCourses);
      setCourses(transformedCourses);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      // Use fallback courses on error
      const fallbackCourses = getFallbackCourses();
      setCourses(fallbackCourses);

      setError(
        err instanceof Error ? err.message : "API Error - using fallback data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [categoryId]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
}
