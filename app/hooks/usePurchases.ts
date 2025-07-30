'use client';

import { useState, useEffect } from 'react';
import { apiRequest, API_CONFIG } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface PurchasedCourse {
  _id: string;
  userId: string;
  setId: {
    _id: string;
    name: {
      en: string;
      ru: string;
      ka?: string;
    };
    description: {
      en: string;
      ru: string;
      ka?: string;
    };
    thumbnailImage?: string;
    price?: {
      monthly: number;
      threeMonths: number;
      sixMonths: number;
      yearly: number;
    };
    discountedPrice?: {
      monthly: number;
      threeMonths: number;
      sixMonths: number;
      yearly: number;
    };
    totalExercises?: number;
    totalDuration?: string;
    difficultyLevels?: number;
    categoryId?: string;
    subCategoryId?: string;
  };
  paymentId: string;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsePurchasesReturn {
  purchases: PurchasedCourse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePurchases(): UsePurchasesReturn {
  const [purchases, setPurchases] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchPurchases = async () => {
    if (!isAuthenticated || !user) {
      setPurchases([]);
      setError('მომხმარებელი არ არის ავტორიზებული');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<PurchasedCourse[]>(
        API_CONFIG.ENDPOINTS.PURCHASES.GET_MY_COURSES
      );
      
      setPurchases(response || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('შეცდომა ნაყიდი კურსების ჩატვირთვისას');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [isAuthenticated, user]);

  return {
    purchases,
    loading,
    error,
    refetch: fetchPurchases,
  };
} 