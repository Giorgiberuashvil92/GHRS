// მრავალენოვანი კონტენტი
export interface MultilingualContent {
  ka: string;
  en: string;
  ru: string;
}



// სერტიფიკატი
export interface Certificate {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface Diploma {
  url?: string;
}



// ინსტრუქტორის მთავარი ინტერფეისი
export interface Instructor {
  id: string;
  name: string;
  firstNameLocalized?: { en?: string; ru?: string; ka?: string };
  lastNameLocalized?: { en?: string; ru?: string; ka?: string };
  email: string;
  profession: string;
  wikipedia?: string;
  qualification?: string;
  qualificationLocalized?: { en?: string; ru?: string; ka?: string };
  professionLocalized?: { en?: string; ru?: string; ka?: string };
  bio: MultilingualContent;
  htmlContent?: MultilingualContent;
  certificates?: Certificate[];
  diplomas?: Diploma[];
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