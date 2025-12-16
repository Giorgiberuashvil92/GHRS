/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';
import { MultiLanguageField, Subcategory } from '../types/category';

// BackendSet type definition (moved from exercise.ts)
export interface BackendSet {
  _id: string;
  name: MultiLanguageField;
  description?: MultiLanguageField;
  thumbnailImage?: string;
  categoryId: string;
  subCategoryId?: string;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export interface CategoryCompleteData {
  category: {
    _id: string;
    name: MultiLanguageField;
    description?: MultiLanguageField;
    image?: string;
    subcategories: Subcategory[];
    sets: BackendSet[];
    isActive: boolean;
    sortOrder: number;
    isPublished: boolean;
  };
  sets: BackendSet[];
  subcategories: Subcategory[];
}

interface UseCategoryCompleteReturn {
  categoryData: CategoryCompleteData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoryComplete(categoryId: string): UseCategoryCompleteReturn {
  const [categoryData, setCategoryData] = useState<CategoryCompleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryComplete = async () => {
    if (!categoryId) return;

    if (categoryId.startsWith('fallback_')) {
      console.log("⚠️ Fallback category detected:", categoryId);
      console.log("⚠️ Skipping API call for fallback category");
      
      // Create empty fallback data structure
      setCategoryData({
        category: {
          _id: categoryId,
          name: { ka: '', en: '', ru: '' },
          subcategories: [],
          sets: [],
          isActive: true,
          sortOrder: 0,
          isPublished: true,
        },
        sets: [],
        subcategories: [],
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔗 Fetching complete category data for ID:", categoryId);
      
      const endpoint = `/categories/${categoryId}/complete`;
      console.log("🔗 API endpoint:", endpoint);
      console.log("🔗 Full URL will be:", `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${endpoint}`);

      const response = await apiRequest<CategoryCompleteData>(endpoint);
      
      console.log("✅ Category complete data received:", response);
      setCategoryData(response);
    } catch (err) {
      console.error("❌ Error fetching category complete data:", err);
      console.error("❌ Error type:", err instanceof Error ? 'Error object' : typeof err);
      console.error("❌ Error message:", err instanceof Error ? err.message : String(err));
      console.error("❌ Category ID that failed:", categoryId);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryComplete();
    }
  }, [categoryId]);

  return {
    categoryData,
    loading,
    error,
    refetch: fetchCategoryComplete,
  };
} 