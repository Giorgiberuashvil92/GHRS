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
  thumbnailUrl?: string;
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
  // populated relations
  set?: {
    _id: string;
    name: LocalizedString;
    description: LocalizedString;
  };
  category?: {
    _id: string;
    name: LocalizedString;
  };
  subcategory?: {
    _id: string;
    name: LocalizedString;
  } | null;
}

interface UseExercisesOptions {
  categoryId?: string;
  subCategoryId?: string;
  setId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface UseExercisesReturn {
  exercises: BackendExercise[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getFallbackExercises(): BackendExercise[] {
  const fallbackDate = new Date().toISOString();
  
  return [
    {
      _id: "fallback_exercise_1",
      name: {
        ka: "კისრის გაჭიმვა",
        en: "Neck Stretch",
        ru: "Растяжка шеи",
        _id: "fallback_name_1"
      },
      description: {
        ka: "კისრის კუნთების გასაჭიმად",
        en: "For stretching neck muscles",
        ru: "Для растяжки мышц шеи",
        _id: "fallback_desc_1"
      },
      recommendations: {
        ka: "ნელა და ფრთხილად",
        en: "Slowly and carefully",
        ru: "Медленно и осторожно",
        _id: "fallback_rec_1"
      },
      videoUrl: "/videos/neck-stretch.mp4",
      thumbnailUrl: "/assets/images/exercises/neck-stretch.jpg",
      videoDuration: "00:03:30",
      duration: "00:02:00",
      difficulty: "easy",
      repetitions: "10",
      sets: "2",
      restTime: "00:00:30",
      isActive: true,
      isPublished: true,
      sortOrder: 1,
      setId: "fallback_set_1",
      categoryId: "fallback_category_1",
      createdAt: fallbackDate,
      updatedAt: fallbackDate,
      __v: 0
    },
    {
      _id: "fallback_exercise_2",
      name: {
        ka: "მხრების ვარჯიში",
        en: "Shoulder Exercise",
        ru: "Упражнение для плеч",
        _id: "fallback_name_2"
      },
      description: {
        ka: "მხრების კუნთების გასაძლიერად",
        en: "For strengthening shoulder muscles",
        ru: "Для укрепления мышц плеч",
        _id: "fallback_desc_2"
      },
      recommendations: {
        ka: "თანმიმდევრულად შეასრულეთ",
        en: "Perform consistently",
        ru: "Выполняйте последовательно",
        _id: "fallback_rec_2"
      },
      videoUrl: "/videos/shoulder-exercise.mp4",
      thumbnailUrl: "/assets/images/exercises/shoulder-exercise.jpg",
      videoDuration: "00:05:00",
      duration: "00:03:30",
      difficulty: "medium",
      repetitions: "15",
      sets: "3",
      restTime: "00:01:00",
      isActive: true,
      isPublished: true,
      sortOrder: 2,
      setId: "fallback_set_2",
      categoryId: "fallback_category_1",
      createdAt: fallbackDate,
      updatedAt: fallbackDate,
      __v: 0
    }
  ];
}

export function useExercises(options: UseExercisesOptions = {}): UseExercisesReturn {
  const [exercises, setExercises] = useState<BackendExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🔴 useExercises hook initialized with options:", options);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🏃‍♂️ Starting fetchExercises...", { options });

      const { apiRequest, API_CONFIG } = await import("../config/api");
      let endpoint = API_CONFIG.ENDPOINTS.EXERCISES;
      
      console.log("🔗 Base endpoint:", endpoint);
      
      // ვქმნით query parameters
      const params = new URLSearchParams();
      if (options.categoryId) params.append('categoryId', options.categoryId);
      if (options.subCategoryId) params.append('subCategoryId', options.subCategoryId);
      if (options.setId) params.append('setId', options.setId);
      
      // თუ არის query params, ვუმატებთ endpoint-ს
      if (params.toString()) {
        endpoint = `${endpoint}?${params.toString()}`;
      }

      const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
      
      console.log("📡 Exercises API Request Details:", {
        endpoint,
        baseUrl: API_CONFIG.BASE_URL,
        fullUrl,
        options,
        timestamp: new Date().toISOString()
      });

      console.log("🔄 About to call apiRequest...");
      const backendExercises: BackendExercise[] = await apiRequest<BackendExercise[]>(endpoint);
      console.log("✅ apiRequest completed successfully");

      console.log("🏃‍♂️ Raw Exercises Response:", {
        data: backendExercises,
        type: typeof backendExercises,
        isArray: Array.isArray(backendExercises),
        length: backendExercises?.length,
        firstItem: backendExercises?.[0]
      });

      if (!Array.isArray(backendExercises)) {
        throw new Error("Exercises API response is not an array");
      }

      console.log("✅ Using raw backend exercises data");

      // აღარ გავაკეთებთ ტრანსფორმაციას - raw data-ს ვიყენებთ
      setExercises(backendExercises);
      console.log("✅ setExercises called with:", backendExercises.length, "exercises");
      
    } catch (err) {
      console.error("❌ Error fetching exercises:", err);
      console.error("❌ Exercises Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      const fallbackExercises = getFallbackExercises();
      console.log("🔄 Using fallback exercises:", fallbackExercises);
      setExercises(fallbackExercises);
      setError(err instanceof Error ? err.message : "API Error - using fallback exercises data");
    } finally {
      setLoading(false);
      console.log("🏁 fetchExercises completed, loading set to false");
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect triggered, calling fetchExercises");
    console.log("🔄 useEffect dependencies:", {
      categoryId: options.categoryId,
      subCategoryId: options.subCategoryId,
      setId: options.setId,
      difficulty: options.difficulty,
      optionsObject: options
    });
    fetchExercises();
  }, [options.categoryId, options.subCategoryId, options.setId, options.difficulty]);

  console.log("🔴 useExercises returning:", {
    exercisesCount: exercises.length,
    loading,
    error,
    exercises: exercises
  });

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
  };
}

// Specific hooks for common use cases
export function useAllExercises() {
  const result = useExercises();
  return result;
}

export function useExercisesByCategory(categoryId: string) {
  return useExercises({ categoryId });
}

export function useExercisesBySet(setId: string) {
  return useExercises({ setId });
}

export function useExercisesByDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
  return useExercises({ difficulty });
}

// Popular exercises hook
export function usePopularExercises() {
  const [exercises, setExercises] = useState<BackendExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchPopularExercises = async () => {
    try {
      setLoading(true);
      setError(null);


      const { apiRequest, API_CONFIG } = await import("../config/api");
      const endpoint = `${API_CONFIG.ENDPOINTS.EXERCISES}/popular`;

      const backendExercises: BackendExercise[] = await apiRequest<BackendExercise[]>(endpoint);
     

      if (!Array.isArray(backendExercises)) {
        throw new Error("Popular exercises API response is not an array");
      }

      setExercises(backendExercises);
      
    } catch (err) {
      const fallbackExercises = getFallbackExercises();
      setExercises(fallbackExercises);
      setError(err instanceof Error ? err.message : "API Error - using fallback exercises data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularExercises();
  }, []);


  return {
    exercises,
    loading,
    error,
    refetch: fetchPopularExercises,
  };
} 