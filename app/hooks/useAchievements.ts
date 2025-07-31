'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

export interface Achievement {
  id: string;
  title: {
    en: string;
    ru: string;
    ka: string;
  };
  description: {
    en: string;
    ru: string;
    ka: string;
  };
  image?: string;
  imageBg?: string;
  current: number;
  total: number;
  isCompleted: boolean;
  unlockedAt?: Date;
  completedAt?: Date;
}

export interface UserStatistics {
  totalTimeSpent: number;
  totalExercisesCompleted: number;
  currentStreak: number;
  recordStreak: number;
  totalSetsCompleted: number;
  totalCoursesCompleted: number;
  completedExerciseIds: string[];
  completedSetIds: string[];
  completedCourseIds: string[];
  activityDates: Date[];
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<Achievement[]>('/users/me/achievements');
      setAchievements(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
  };
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<UserStatistics>('/users/me/statistics');
      setStatistics(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}

// Activity tracking hook
export function useActivityTracker() {
  const recordActivity = async (
    type: 'exercise' | 'set' | 'course',
    itemId: string,
    timeSpent?: number
  ) => {
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Debug: Check window object
      console.log('🌍 Window object:', typeof window !== 'undefined');
      console.log('🌍 LocalStorage available:', typeof localStorage !== 'undefined');
      
      console.log('📤 Sending activity request:', {
        type,
        itemId,
        timeSpent,
        endpoint: '/users/me/activity'
      });
      
      await apiRequest('/users/me/activity', {
        method: 'POST',
        body: JSON.stringify({
          type,
          itemId,
          timeSpent,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Activity recorded successfully!');
      
      // Trigger refetch of achievements and statistics
      // This could be improved with a global state management solution
      window.dispatchEvent(new CustomEvent('achievementsUpdate'));
      
    } catch (err) {
      console.error('❌ Error recording activity:', err);
      
      // Additional debug info for errors
      if (err instanceof Error) {
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
      }
      
      throw err; // Re-throw the error so it can be handled by the caller
    }
  };

  return {
    recordActivity,
  };
} 