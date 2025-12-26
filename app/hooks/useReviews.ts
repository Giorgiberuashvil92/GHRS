"use client";
import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

export interface Review {
  _id: string;
  name: {
    ka: string;
    en: string;
    ru: string;
  };
  image: string;
  videoUrl?: string;
  rating?: number;
  isActive: boolean;
  sortOrder: number;
}

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

// Fallback data until API endpoint is ready
const fallbackReviews: Review[] = [
  {
    _id: "1",
    name: { ka: "ალექსეი", en: "Alexey", ru: "Алексей" },
    image: "/assets/images/reviewSliderImages/image2.png",
    videoUrl: "",
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: "2",
    name: { ka: "ვლადისლავა", en: "Vladislava", ru: "Владислава" },
    image: "/assets/images/reviewSliderImages/image3.png",
    videoUrl: "",
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: "3",
    name: { ka: "ალექსანდრა", en: "Alexandra", ru: "Александра" },
    image: "/assets/images/reviewSliderImages/image4.png",
    videoUrl: "",
    isActive: true,
    sortOrder: 3,
  },
  {
    _id: "4",
    name: { ka: "ვლადისლავა", en: "Vladislava", ru: "Владислава" },
    image: "/assets/images/reviewSliderImages/image5.png",
    videoUrl: "",
    isActive: true,
    sortOrder: 4,
  },
  {
    _id: "5",
    name: { ka: "ელენა", en: "Elena", ru: "Елена" },
    image: "/assets/images/reviewSliderImages/image6.png",
    videoUrl: "",
    isActive: true,
    sortOrder: 5,
  },
];

export function useReviews(): UseReviewsReturn {
  // ✅ FIXED: Reviews endpoint doesn't exist in backend yet
  // Using fallback data directly to avoid 404 errors
  const [reviews] = useState<Review[]>(fallbackReviews);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // TODO: Uncomment when backend /api/reviews endpoint is implemented
  /*
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/reviews?isActive=true`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn("Reviews API not available, using fallback data");
          setReviews(fallbackReviews);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const sortedReviews = (data.reviews || data || []).sort(
          (a: Review, b: Review) => a.sortOrder - b.sortOrder
        );
        
        setReviews(sortedReviews);
      } catch (err) {
        console.warn("Error fetching reviews, using fallback data:", err);
        setReviews(fallbackReviews);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  */

  return { reviews, loading, error };
}
