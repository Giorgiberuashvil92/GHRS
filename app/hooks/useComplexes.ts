"use client";

import { useState, useEffect } from "react";
import {
  Complex,
  Exercise,
  BackendComplex,
  BackendExercise,
} from "../../types/exercise";

interface UseComplexesReturn {
  complexes: Complex[];
  loading: boolean;
  error: string | null;
  refetch: (categoryId?: string | number) => Promise<void>;
  exercises?: Exercise[];
}

function transformExercise(backendExercise: BackendExercise): Exercise {
  return {
    id: parseInt(backendExercise._id.slice(-8), 16),
    title: backendExercise.name,
    description: backendExercise.description,
    difficulty: backendExercise.difficulty,
    duration: backendExercise.duration,
    sets: `${backendExercise.repetitions}x${backendExercise.sets}`,
    image: backendExercise.images?.[0] || "/assets/images/workMan.png",
    category: backendExercise.categoryId?.name,
    instructions: backendExercise.instructions
      ? [backendExercise.instructions]
      : [],
    equipment: [],
  };
}

function transformComplex(backendComplex: BackendComplex): Complex {
  // Map stage values
  let stage: "beginner" | "intermediate" | "advanced" = "beginner";
  if (backendComplex.stage === "advanced") stage = "advanced";
  else if (backendComplex.stage === "mid") stage = "intermediate";
  else if (backendComplex.stage === "intermediate") stage = "intermediate";

  return {
    id: parseInt(backendComplex._id.slice(-8), 16),
    name: backendComplex.name,
    price: backendComplex.price,
    currency: "₾", // Default currency
    difficulty: backendComplex.difficulty,
    stage: stage,
    exercisesCount: backendComplex.exerciseCount,
    exercises: backendComplex.exercises?.map(transformExercise) || [],
    description: backendComplex.description,
    image: "/assets/images/workMan.png",
    totalDuration: backendComplex.totalDuration,
    isActive: backendComplex.isActive,
  };
}

function getFallbackComplexes(): Complex[] {
  return [
    {
      id: 1,
      name: "ორთოპედიული კომპლექსი",
      price: 12500,
      currency: "₾",
      difficulty: "hard",
      stage: "advanced",
      exercisesCount: 4,
      exercises: [
        {
          id: 101,
          title: "ბევრი სავარჯიშოები საკმაოდ",
          difficulty: "easy",
          duration: 301,
          sets: "10x5",
          image: "/assets/images/workMan.png",
        },
        {
          id: 102,
          title: "მუხლის სახსარი ბევრი სავარჯიშოები საკმაოდ",
          difficulty: "hard",
          duration: 30,
          sets: "10x3",
          image: "/assets/images/workMan.png",
        },
        {
          id: 103,
          title: "ნევროლოგია1234",
          difficulty: "hard",
          duration: 30,
          sets: "10x3",
          image: "/assets/images/workMan.png",
        },
        {
          id: 104,
          title: "ტესტური სავარჯიშო",
          difficulty: "medium",
          duration: 15,
          sets: "12x3",
          image: "/assets/images/workMan.png",
        },
      ],
      isActive: true,
    },
  ];
}

export function useComplexes(categoryId?: string | number): UseComplexesReturn {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplexes = async (catId?: string | number) => {
    try {
      setLoading(true);
      setError(null);
      setExercises([]);
      // თუ გადმოეცა categoryId, გამოიძახე შესაბამისი endpoint
      if (catId || categoryId) {
        const id = catId || categoryId;
        const { apiRequest, API_CONFIG } = await import("../config/api");
        const endpoint = `/api/categories/${id}/exercises-and-complexes`;
        console.log(
          "🔗 Fetching category complexes/exercises from:",
          `${API_CONFIG.BASE_URL}${endpoint}`
        );
        const data = await apiRequest(endpoint);
        // ვვარაუდობ, რომ პასუხი არის { complexes: BackendComplex[], exercises: BackendExercise[] }
        const backendComplexes: BackendComplex[] =
          (
            data as {
              complexes?: BackendComplex[];
              exercises?: BackendExercise[];
            }
          ).complexes || [];
        const backendExercises: BackendExercise[] =
          (
            data as {
              complexes?: BackendComplex[];
              exercises?: BackendExercise[];
            }
          ).exercises || [];
        // complexes
        const transformedComplexes: Complex[] = backendComplexes
          .filter((complex) => complex.isActive)
          .map(transformComplex);
        setComplexes(transformedComplexes);
        // exercises
        const transformedExercises: Exercise[] = backendExercises
          .filter((ex) => ex.isActive)
          .map(transformExercise);
        setExercises(transformedExercises);
      } else {
        // ძველი ლოგიკა
        const { apiRequest, API_CONFIG } = await import("../config/api");
        const endpoint = "/api/complexes";
        console.log(
          "🔗 Fetching complexes from:",
          `${API_CONFIG.BASE_URL}${endpoint}`
        );
        const backendComplexes: BackendComplex[] = await apiRequest<
          BackendComplex[]
        >(endpoint);
        if (!Array.isArray(backendComplexes)) {
          throw new Error("API response is not an array");
        }
        const transformedComplexes: Complex[] = backendComplexes
          .filter((complex) => complex.isActive)
          .map(transformComplex);
        setComplexes(transformedComplexes);
        setExercises([]); // exercises ცარიელი
      }
    } catch (err) {
      console.error("❌ Error fetching complexes:", err);
      const fallbackComplexes = getFallbackComplexes();
      setComplexes(fallbackComplexes);
      setExercises([]);
      setError(
        err instanceof Error ? err.message : "API Error - using fallback data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplexes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  return {
    complexes,
    loading,
    error,
    refetch: fetchComplexes,
    exercises: exercises.length > 0 ? exercises : undefined,
  };
}
