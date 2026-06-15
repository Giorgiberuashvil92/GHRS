"use client";

import { useState, useEffect } from "react";
import { Instructor } from "../../types/instructor";
import { withSanitizedInstructorNames } from "../utils/instructorDisplay";

interface UseInstructorReturn {
  instructor: Instructor | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Fallback instructor data for development/testing
function getFallbackInstructor(): Instructor {
  const fallbackDate = new Date().toISOString();
  
  return {
    id: "fallback-instructor-id",
    name: "Dr. John Smith",
    email: "john.smith@example.com",
    profession: "Physical Therapist",
    bio: {
      ka: "გამოცდილი ფიზიკური თერაპევტი",
      en: "Experienced Physical Therapist with 10+ years of experience",
      ru: "Опытный физиотерапевт с более чем 10-летним опытом"
    },
    profileImage: "/assets/images/default-instructor.png",
    isActive: true,
    coursesCount: 15,
    studentsCount: 1250,
    averageRating: 4.8,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
  };
}

export function useInstructor(instructorId: string): UseInstructorReturn {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🔴 useInstructor hook initialized with instructorId:", instructorId);

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🏃‍♂️ Starting fetchInstructor...", { instructorId });

      const { apiRequest, API_CONFIG } = await import("../config/api");
      const endpoint = API_CONFIG.ENDPOINTS.INSTRUCTORS.BY_ID(instructorId);

      console.log("📡 Instructor API Request Details:", {
        endpoint,
        baseUrl: API_CONFIG.BASE_URL,
        fullUrl: `${API_CONFIG.BASE_URL}${endpoint}`,
        instructorId,
        timestamp: new Date().toISOString()
      });

      const raw = await apiRequest<Instructor & { _id?: string }>(endpoint);
      console.log("✅ Instructor API request completed successfully");

      if (!raw) {
        throw new Error("Instructor API response is empty");
      }

      const backendInstructor: Instructor = withSanitizedInstructorNames({
        ...raw,
        id: raw.id || raw._id || instructorId,
      }) as Instructor;

      setInstructor(backendInstructor);
      
    } catch (err) {
      console.error("❌ Error fetching instructor:", err);
      console.error("❌ Instructor Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      const fallbackInstructor = getFallbackInstructor();
      console.log("🔄 Using fallback instructor:", fallbackInstructor);
      setInstructor(fallbackInstructor);
      setError(err instanceof Error ? err.message : "API Error - using fallback instructor data");
    } finally {
      setLoading(false);
      console.log("🏁 fetchInstructor completed, loading set to false");
    }
  };

  useEffect(() => {
    if (instructorId) {
      console.log("🔄 useEffect triggered, calling fetchInstructor");
      fetchInstructor();
    } else {
      console.log("⚠️ No instructorId provided, skipping fetchInstructor");
      setLoading(false);
    }
  }, [instructorId]);

  console.log("🔴 useInstructor returning:", {
    instructor: instructor?.id,
    loading,
    error,
    hasInstructor: !!instructor
  });

  return {
    instructor,
    loading,
    error,
    refetch: fetchInstructor,
  };
}

// Hook for fetching all instructors
export function useInstructors(categoryId?: string) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const { apiRequest, API_CONFIG } = await import("../config/api");
      let endpoint = `${API_CONFIG.ENDPOINTS.INSTRUCTORS.ALL}?limit=500&page=1`;
      
      // დავამატოთ category filter თუ არის
      if (categoryId) {
        endpoint += `&categoryId=${categoryId}`;
      }

      const response = await apiRequest<{instructors: (Instructor & { _id?: string })[], total: number}>(endpoint);
      const instructorsWithId = (response.instructors || []).map((instructor) =>
        withSanitizedInstructorNames({
          ...instructor,
          id: instructor.id || instructor._id || "",
        })
      ) as Instructor[];
      
      setInstructors(instructorsWithId);
    } catch (err) {
      console.error("❌ Error fetching instructors:", err);
      setError(err instanceof Error ? err.message : "API Error");
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [categoryId]);

  return {
    instructors,
    loading,
    error,
    refetch: fetchInstructors,
  };
}

// Hook for fetching top instructors
export function useTopInstructors(limit?: number) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const { apiRequest, API_CONFIG } = await import("../config/api");
      let endpoint = API_CONFIG.ENDPOINTS.INSTRUCTORS.TOP;
      
      if (limit) {
        endpoint += `?limit=${limit}`;
      }

      const response = await apiRequest<(Instructor & { _id?: string })[]>(endpoint);
      const instructorsWithId = (response || []).map((instructor) =>
        withSanitizedInstructorNames({
          ...instructor,
          id: instructor.id || instructor._id || "",
        })
      ) as Instructor[];
      
      setInstructors(instructorsWithId);
    } catch (err) {
      console.error("❌ Error fetching top instructors:", err);
      setError(err instanceof Error ? err.message : "API Error");
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopInstructors();
  }, [limit]);

  return {
    instructors,
    loading,
    error,
    refetch: fetchTopInstructors,
  };
} 