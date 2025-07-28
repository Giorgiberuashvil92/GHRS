// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}



// სერტიფიკატი
export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}



// ინსტრუქტორის მთავარი ინტერფეისი
export interface Instructor {
  id: string;
  name: string;
  email: string;
  profession: string;
  bio: MultilingualContent;
  htmlContent?: MultilingualContent;
  certificates?: Certificate[];
  profileImage: string;
  isActive: boolean;
  coursesCount?: number;
  studentsCount?: number;
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ინსტრუქტორების სია API response-ისთვის
export interface InstructorsResponse {
  instructors: Instructor[];
  total: number;
  page: number;
  totalPages: number;
} 