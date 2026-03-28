"use client";

import { useState, useEffect } from "react";
import { Instructor } from "../../types/instructor";

interface UseInstructorByNameReturn {
  instructor: Instructor | null;
  loading: boolean;
  error: string | null;
}

export function useInstructorByName(instructorName: string): UseInstructorByNameReturn {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructorByName = async () => {
      if (!instructorName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { apiRequest, API_CONFIG } = await import("../config/api");
        const endpoint = API_CONFIG.ENDPOINTS.INSTRUCTORS.ALL;

        const response = await apiRequest<{instructors: Instructor[], total: number}>(endpoint);
        const instructors = response.instructors || [];
        
        const foundInstructor = instructors.find(
          (inst) => inst.name.toLowerCase() === instructorName.toLowerCase()
        );

        if (foundInstructor) {
          setInstructor(foundInstructor);
        } else {
          setInstructor(null);
        }
      } catch (err) {
        console.error("Error fetching instructor by name:", err);
        setError(err instanceof Error ? err.message : "API Error");
        setInstructor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorByName();
  }, [instructorName]);

  return {
    instructor,
    loading,
    error,
  };
}
