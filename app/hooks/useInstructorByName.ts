"use client";

import { useState, useEffect } from "react";
import { Instructor } from "../../types/instructor";
import {
  instructorMatchesEmbeddedCourseName,
  withSanitizedInstructorNames,
} from "../utils/instructorDisplay";

interface UseCourseInstructorOptions {
  /** კურსის დოკუმენტში შენახული ინსტრუქტორის Mongo _id — პრიორიტეტული */
  courseInstructorId?: string;
  /** კურსში ჩაწერილი `instructor.name` (ძველი ან სისტემური სახელი) */
  courseInstructorName?: string;
}

interface UseCourseInstructorReturn {
  instructor: Instructor | null;
  loading: boolean;
  error: string | null;
}

function mapApiInstructor(
  raw: Instructor & { _id?: string },
  fallbackId?: string
): Instructor {
  const base: Instructor = {
    ...raw,
    id: raw.id || raw._id || fallbackId || "",
  };
  return withSanitizedInstructorNames(base) as Instructor;
}

/**
 * კურსის გვერდისთვის: ჯერ ეცდება `instructorId`-ით ჩატვირთვას, თორემ — სიიდან შედარებით
 * (`name` + ლოკალიზებული სახელი/გვარი).
 */
export function useCourseInstructor(
  options: UseCourseInstructorOptions
): UseCourseInstructorReturn {
  const courseInstructorId = options.courseInstructorId?.trim();
  const courseInstructorName = options.courseInstructorName?.trim() ?? "";

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!courseInstructorId && !courseInstructorName) {
        setInstructor(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const { apiRequest, API_CONFIG } = await import("../config/api");

        if (courseInstructorId) {
          const endpoint = API_CONFIG.ENDPOINTS.INSTRUCTORS.BY_ID(courseInstructorId);
          const raw = await apiRequest<Instructor & { _id?: string }>(endpoint);
          if (!cancelled && raw) {
            setInstructor(mapApiInstructor(raw, courseInstructorId));
          }
          return;
        }

        const listUrl = `${API_CONFIG.ENDPOINTS.INSTRUCTORS.ALL}?limit=500&page=1`;
        const response = await apiRequest<{
          instructors: (Instructor & { _id?: string })[];
          total: number;
        }>(listUrl);
        const list = response.instructors || [];
        const found = list.find((inst) =>
          instructorMatchesEmbeddedCourseName(
            mapApiInstructor(inst, inst._id),
            courseInstructorName
          )
        );
        if (!cancelled) {
          setInstructor(found ? mapApiInstructor(found, found._id) : null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useCourseInstructor:", err);
          setError(err instanceof Error ? err.message : "API Error");
          setInstructor(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [courseInstructorId, courseInstructorName]);

  return { instructor, loading, error };
}

/** @deprecated გამოიყენეთ useCourseInstructor({ courseInstructorName }) */
export function useInstructorByName(instructorName: string): UseCourseInstructorReturn {
  return useCourseInstructor({ courseInstructorName: instructorName });
}
