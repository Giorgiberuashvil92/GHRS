'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_CONFIG } from '../../config/api';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../../context/I18nContext';

interface PurchasedCourse {
  _id: string;
  itemType: 'set' | 'course';
  setId?: {
    _id: string;
    name: {
      en: string;
      ru: string;
    };
    description: {
      en: string;
      ru: string;
    };
    thumbnailImage?: string;
    duration?: string;
    difficulty?: string;
    price?: {
      monthly: number;
      threeMonths: number;
      sixMonths: number;
      yearly: number;
    };
    categoryId?: string;
  };
  courseId?: {
    _id: string;
    title: {
      en: string;
      ru: string;
    };
    description: {
      en: string;
      ru: string;
    };
    thumbnail?: string;
    duration?: number;
    price?: number;
    categoryId?: string;
  };
  createdAt: string;
  expiresAt?: string;
  amount: number;
  currency: string;
}

export default function PurchasedCourses() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale } = useI18n();

  // Get text based on current locale with fallback
  const getText = (textObj: { en: string; ru: string }) => {
    if (locale === 'ka') return textObj.ru; // Use Russian as fallback for Georgian
    return textObj[locale as 'en' | 'ru'] || textObj.en;
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await apiRequest<PurchasedCourse[]>(API_CONFIG.ENDPOINTS.PURCHASES.GET_MY_COURSES);
        setCourses(response);
        console.log('Purchased courses:', response);
      } catch (err) {
        setError('შეცდომა კურსების ჩატვირთვისას');
        console.error('Error fetching purchased courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">იტვირთება...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="bg-gray-50 rounded-xl p-12">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">თქვენ ჯერ არ გაქვთ შეძენილი კურსები</h3>
          <p className="text-gray-600 mb-6">დაიწყეთ თქვენი ჯანმრთელობის მოგზაურობა ჩვენი პროფესიონალური კურსებით</p>
          <Link 
            href="/chapter" 
            className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            ნახეთ ხელმისაწვდომი კურსები
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {courses.map((course) => {
        // Determine item data based on type
        const isSet = course.itemType === 'set' && course.setId;
        const isCourse = course.itemType === 'course' && course.courseId;
        
        if (!isSet && !isCourse) return null; // Skip invalid items
        
        const itemData = isSet ? course.setId! : course.courseId!;
        const itemTitle = isSet 
          ? (itemData as { name: { en: string; ru: string } }).name 
          : (itemData as { title: { en: string; ru: string } }).title;
        const itemDescription = itemData.description;
        const itemImage = isSet 
          ? (itemData as { thumbnailImage?: string }).thumbnailImage 
          : (itemData as { thumbnail?: string }).thumbnail;
        const itemId = itemData._id;
        const categoryId = itemData.categoryId || '';
        
        // Generate appropriate link based on type
        const href = isSet 
          ? `/complex/${itemId}?categoryId=${categoryId}`
          : `/singleCourse/${itemId}`;
        
        return (
          <Link 
            href={href}
            key={course._id}
            className="group block"
          >
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between">
                {/* Left content */}
                <div className="flex-1 pr-8">
                  {/* Brand/Category */}
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                      {isSet ? 'SET' : 'COURSE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors duration-200">
                    {getText(itemTitle)}
                  </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {getText(itemDescription).split('\n')[0]}
                </p>

                {/* Course stats */}
                <div className="flex items-center space-x-6 mb-6">
                  {((isSet && (itemData as { duration?: string }).duration) || (!isSet && (itemData as { duration?: number }).duration)) && (
                    <div className="flex items-center text-gray-500">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">
                        {isSet 
                          ? (itemData as { duration?: string }).duration + ' წუთი' 
                          : (itemData as { duration?: number }).duration + ' წუთი'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-500">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">2 из 5 уроков</span>
                  </div>
                </div>

                {/* Continue button */}
                <div className="flex items-center justify-between">
                  <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:translate-x-1 transition-transform duration-200">
                    <span className="mr-2">გაგრძელება</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right image */}
              <div className="flex-shrink-0">
                <div className="w-80 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-200 to-purple-300">
                  {itemImage ? (
                    <Image
                      src={itemImage}
                      alt={getText(itemTitle)}
                      width={320}
                      height={256}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-purple-500 text-sm font-medium">{isSet ? 'კომპლექსი' : 'კურსი'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        );
      })}
    </div>
  );
} 