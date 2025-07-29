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

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.BASE_URL}/statistics/global`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
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
    refetch: fetchStatistics
  };
};

export default useStatistics; 