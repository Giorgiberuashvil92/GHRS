'use client';

import { useState, useEffect } from 'react';

export interface ExerciseProgress {
  completedExercises: string[];
  totalExercises: number;
  completionPercentage: number;
  completedByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface Exercise {
  _id: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function useExerciseProgress(setId?: string, exercises?: Exercise[]): ExerciseProgress {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    if (!setId) return;
    
    const savedProgress = localStorage.getItem(`exercise_progress_${setId}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCompletedExercises(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing exercise progress:', error);
        setCompletedExercises([]);
      }
    } else {
      setCompletedExercises([]);
    }
  }, [setId]);

  // Calculate statistics
  const totalExercises = exercises?.length || 0;
  const completionPercentage = totalExercises > 0 ? (completedExercises.length / totalExercises) * 100 : 0;

  // Count completed exercises by difficulty
  const completedByDifficulty = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  if (exercises) {
    exercises.forEach(exercise => {
      if (completedExercises.includes(exercise._id)) {
        const difficulty = exercise.difficulty as 'easy' | 'medium' | 'hard';
        if (difficulty in completedByDifficulty) {
          completedByDifficulty[difficulty]++;
        }
      }
    });
  }

  return {
    completedExercises,
    totalExercises,
    completionPercentage,
    completedByDifficulty
  };
} 