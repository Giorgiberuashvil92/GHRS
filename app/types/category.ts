export interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
}

export interface MultiLanguageField {
  ka: string;
  en: string;
  ru: string;
}

export interface Video {
  _id: string | null | undefined;
  duration: any;
  title: string;
  description: string;
  urls: {
    hd: string; // URL for the HD video
    thumbnail: string; // URL for the video thumbnail
  };
}

export interface SubscriptionPlan {
  period: number;
  price: number;
}

export interface Set {
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
  exercises?: Exercise[];
  createdAt?: string;
  updatedAt?: string;
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

export interface Exercise {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  recommendations: LocalizedString;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDuration: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repetitions: string;
  sets: string;
  restTime: string;
  isActive: boolean;
  isPublished: boolean;
  isPopular?: boolean;
  sortOrder: number;
  setId: string;
  categoryId: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: LocalizedString;
  description?: LocalizedString;
  image?: string;
  parentId: string;
  subcategories?: Category[];
  sets?: string[];
  isActive: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// SubCategory = Category (იგივე სქემაა, მხოლოდ parentId აქვს)
export type SubCategory = Category;

export interface Category {
  _id: string;
  name: LocalizedString;
  description?: LocalizedString;
  image?: string;
  parentId?: string;
  subcategories?: Category[];
  sets?: string[];
  isActive: boolean;
  sortOrder: number;
  isPublished: boolean;
}
