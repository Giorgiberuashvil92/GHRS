export interface Exercise {
  id: number;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // მუთებში
  sets: string; // მაგ: "10x5" ან "12x3"
  image?: string;
  category?: string;
  instructions?: string[];
  equipment?: string[];
}

export interface Complex {
  id: number;
  name: string;
  price: number;
  currency: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stage: 'beginner' | 'intermediate' | 'advanced';
  exercisesCount: number;
  exercises: Exercise[];
  description?: string;
  image?: string;
  totalDuration?: number;
  isActive: boolean;
}

export interface BackendExercise {
  _id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  images: string[];
  videos: string[];
  categoryId: {
    _id: string;
    name: string;
    description: string;
  };
  subcategoryId: {
    _id: string;
    name: string;
    description: string;
  };
  isActive: boolean;
  sortOrder: number;
  repetitions: number;
  sets: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BackendComplex {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  subcategoryId: {
    _id: string;
    name: string;
    description: string;
    image: string;
    categoryId: string | null;
    isActive: boolean;
    sortOrder: number;
    exercises: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  exerciseIds: string[];
  totalDuration: number;
  exerciseCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  stage: 'beginner' | 'intermediate' | 'advanced' | 'mid';
  requiredEquipment: string[];
  generalInstructions: string;
  breathingGuidelines: string;
  recommendedFrequency: string;
  targetCondition: string;
  price: number;
  subscriptionPeriods: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    _id: string;
  };
  demoVideoUrl: string;
  relatedComplexes: string[];
  isActive: boolean;
  sortOrder: number;
  tags: string[];
  subscriptionOptions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  exercises: BackendExercise[];
} 