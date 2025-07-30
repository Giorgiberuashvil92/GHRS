'use client';

import { useState, useEffect } from 'react';
import { apiRequest, API_CONFIG } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface UseUserAccessReturn {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  checkAccess: (setId: string) => Promise<void>;
}

export function useUserAccess(setId?: string): UseUserAccessReturn {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const checkAccess = async (targetSetId: string) => {
    if (!isAuthenticated || !user) {
      setHasAccess(false);
      setError('მომხმარებელი არ არის ავტორიზებული');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<boolean>(
        API_CONFIG.ENDPOINTS.PURCHASES.CHECK_ACCESS(targetSetId)
      );
      
      setHasAccess(response);
    } catch (err) {
      console.error('Error checking user access:', err);
      setError('შეცდომა access-ის შემოწმებისას');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setId) {
      checkAccess(setId);
    }
  }, [setId, isAuthenticated, user]);

  return {
    hasAccess,
    loading,
    error,
    checkAccess,
  };
}
