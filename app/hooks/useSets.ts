"use client";
import { useState, useEffect } from "react";
import { Set, LocalizedString } from "../types/category";
import { apiRequest } from "../config/api";

interface BackendSet {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  thumbnailImage: string;
  totalExercises: number;
  totalDuration: string;
  difficultyLevels: number;
  levels: {
    beginner: {
      exerciseCount: number;
      isLocked: boolean;
    };
    intermediate: {
      exerciseCount: number;
      isLocked: boolean;
    };
    advanced: {
      exerciseCount: number;
      isLocked: boolean;
    };
  };
  price: {
    monthly: number;
    threeMonths: number;
    sixMonths: number;
    yearly: number;
  };
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  categoryId: string;
  subCategoryId?: string;
  // populated fields from backend
  category?: {
    _id: string;
    name: LocalizedString;
    description?: LocalizedString;
  };
  subcategory?: {
    _id: string;
    name: LocalizedString;
    description?: LocalizedString;
  };
}

interface UseSetsReturn {
  sets: Set[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const transformSet = (backendSet: BackendSet): Set => {
  return {
    _id: backendSet._id,
    name: backendSet.name,
    description: backendSet.description,
    thumbnailImage: backendSet.thumbnailImage || "/assets/images/workMan.png",
    totalExercises: backendSet.totalExercises,
    totalDuration: backendSet.totalDuration,
    difficultyLevels: backendSet.difficultyLevels,
    levels: backendSet.levels,
    price: backendSet.price,
    isActive: backendSet.isActive,
    isPublished: backendSet.isPublished,
    sortOrder: backendSet.sortOrder,
    categoryId: backendSet.categoryId,
    subCategoryId: backendSet.subCategoryId,
    // populated fields
    category: backendSet.category,
    subcategory: backendSet.subcategory,
  };
};

export function useAllSets(): UseSetsReturn {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendSets = await apiRequest<BackendSet[]>("/sets");
      if (!Array.isArray(backendSets)) {
        throw new Error("API response is not an array");
      }
      // აღარ ვაფილტრავთ isPublished-ით, ყველა სეტს ვაჩვენებთ
      const transformedSets = backendSets.map(transformSet);
      setSets(transformedSets);
    } catch (err) {
      console.error("❌ Error fetching sets:", err);
      setError(err instanceof Error ? err.message : "API Error");
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  return { sets, loading, error, refetch: fetchSets };
}
