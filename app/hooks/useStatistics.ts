import { getPublicJson } from '../../lib/public-request';
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

interface Statistics {
  total: {
    sets: number;
    exercises: number;
    hours: number;
  };
  published: {
    sets: number;
    exercises: number;
  };
}

interface UseStatisticsReturn {
  statistics: Statistics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useStatistics = (): UseStatisticsReturn => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = async (force = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getPublicJson<Statistics>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATISTICS.GLOBAL}`, { force });
      setStatistics(data);
    } catch (err) {
      console.error('❌ Error fetching global statistics:', err);
      // Set fallback data if API fails
      setStatistics({
        total: {
          sets: 0,
          exercises: 0,
          hours: 0
        },
        published: {
          sets: 0,
          exercises: 0
        }
      });
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: () => fetchStatistics(true)
  };
};

export default useStatistics; 