"use client";
import { useState, useEffect } from "react";
import { Set, LocalizedString } from "../types/category";
import { API_CONFIG } from "../config/api";

interface BackendSet {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  thumbnailImage: string;
  totalExercises: number;
  totalDuration: string;
  duration?: string;
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
    duration: backendSet.duration,
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
    const isDev = process.env.NODE_ENV === 'development';
    
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIXED: Always use /api prefix - Next.js rewrites will handle routing
      // Fetch ALL sets including inactive/unpublished for accurate count
      const endpoint = '/api/sets?includeAll=true&limit=1000';
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      
      if (isDev) {
        console.log('🔵 Fetching ALL sets from:', url);
      }
      
      // ✅ პირდაპირ fetch - bypass apiRequest cache
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // არ გამოიყენოს cache
      });
      
      if (isDev) {
        console.log('📡 Response status:', response.status);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const backendSets = await response.json();
      
      if (isDev) {
        console.log('✅ Sets fetched:', backendSets.length);
      }
      
      if (!Array.isArray(backendSets)) {
        throw new Error("API response is not an array");
      }
      
      const transformedSets = backendSets.map(transformSet);
      setSets(transformedSets);
      
      if (isDev) {
        console.log('✅ Total sets loaded:', transformedSets.length);
        console.log('📊 Active sets:', transformedSets.filter(s => s.isActive).length);
        console.log('📊 Published sets:', transformedSets.filter(s => s.isPublished).length);
      }
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