"use client";

import { useState, useEffect } from "react";

// ბექენდის API რესპონსისთვის - exact structure
interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
  _id: string;
}

interface BackendExercise {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  recommendations: LocalizedString;
  videoUrl?: string;
  thumbnailUrl: string;
  videoDuration: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repetitions: string;
  sets: string;
  restTime: string;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  setId: string;
  categoryId: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Level {
  exerciseCount: number;
  isLocked: boolean;
}

interface Price {
  monthly: number;
  threeMonths: number;
  sixMonths: number;
  yearly: number;
}

interface Levels {
  beginner: Level;
  intermediate: Level;
  advanced: Level;
}

interface BackendSet {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  thumbnailImage: string;
  totalExercises: number;
  totalDuration: string;
  /** Set-level duration from API (e.g. "25:00" = 25 minutes) */
  duration?: string;
  difficultyLevels: number;
  levels: Levels;
  price: Price;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  categoryId: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // populated relations
  category?: {
    _id: string;
    name: LocalizedString;
  };
  subcategory?: {
    _id: string;
    name: LocalizedString;
  } | null;
  // exercises from categoryComplete endpoint
  exercises?: BackendExercise[];
}

interface UseSetReturn {
  set: BackendSet | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getFallbackSet(): BackendSet {
  const fallbackDate = new Date().toISOString();
  
  return {
    _id: "fallback_set_1",
    name: {
      ka: "კისრის კომპლექსი",
      en: "Neck Complex",
      ru: "Комплекс для шеи",
      _id: "fallback_name_1"
    },
    description: {
      ka: "კისრის კუნთების გასაძლიერად და გასაჭიმად",
      en: "For strengthening and stretching neck muscles",
      ru: "Для укрепления и растяжки мышц шеи",
      _id: "fallback_desc_1"
    },
    thumbnailImage: "/assets/images/workMan.png",
    totalExercises: 8,
    totalDuration: "00:39:38",
    difficultyLevels: 3,
    levels: {
      beginner: { exerciseCount: 3, isLocked: false },
      intermediate: { exerciseCount: 3, isLocked: true },
      advanced: { exerciseCount: 2, isLocked: true }
    },
    price: {
      monthly: 920,
      threeMonths: 850,
      sixMonths: 750,
      yearly: 650
    },
    isActive: true,
    isPublished: true,
    sortOrder: 1,
    categoryId: "fallback_category_1",
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
    __v: 0
  };
}

export function useSet(setId: string): UseSetReturn {
  const [set, setSet] = useState<BackendSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🔴 useSet hook initialized with setId:", setId);

  const fetchSet = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🏃‍♂️ Starting fetchSet...", { setId });

      const { apiRequest, API_CONFIG } = await import("../config/api");
      // ✅ FIXED: Always use /api prefix - Next.js rewrites will handle routing
      const endpoint = `/api/sets/${setId}`.toLowerCase();

      console.log("📡 Set API Request Details:", {
        endpoint,
        baseUrl: API_CONFIG.BASE_URL,
        fullUrl: `${API_CONFIG.BASE_URL}${endpoint}`,
        setId,
        timestamp: new Date().toISOString(),
        endpointIsLowercase: endpoint === endpoint.toLowerCase()
      });

      const backendSet: BackendSet = await apiRequest<BackendSet>(endpoint);
      console.log("✅ Set API request completed successfully");

      console.log("🏃‍♂️ Raw Set Response:", {
        data: backendSet,
        type: typeof backendSet,
        setId: backendSet?._id,
        name: backendSet?.name
      });

      if (!backendSet) {
        throw new Error("Set API response is empty");
      }

      setSet(backendSet);
      console.log("✅ setSet called with:", backendSet);
      
    } catch (err) {
      console.error("❌ Error fetching set:", err);
      console.error("❌ Set Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      const fallbackSet = getFallbackSet();
      console.log("🔄 Using fallback set:", fallbackSet);
      setSet(fallbackSet);
      setError(err instanceof Error ? err.message : "API Error - using fallback set data");
    } finally {
      setLoading(false);
      console.log("🏁 fetchSet completed, loading set to false");
    }
  };

  useEffect(() => {
    if (setId) {
      console.log("🔄 useEffect triggered, calling fetchSet");
      fetchSet();
    } else {
      console.log("⚠️ No setId provided, skipping fetchSet");
      setLoading(false);
    }
  }, [setId]);

  console.log("🔴 useSet returning:", {
    set: set?._id,
    loading,
    error,
    hasSet: !!set
  });

  return {
    set,
    loading,
    error,
    refetch: fetchSet,
  };
} 

