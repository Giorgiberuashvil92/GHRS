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
  setId: {
    categoryId: any;
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
    <div className="space-y-6">
      {courses
        .filter(course => course.setId)
        .map((course) => (
          <Link
            href={`/complex/${course.setId._id}?categoryId=${course.setId.categoryId}`}
            key={course._id}
          >
            <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between w-full">
                {/* Left content */}
                <div>

                  <div className="flex-1 pr-8">
                    {/* Brand/Category */}
                    <div className="flex items-center mb-4">
                      <span className="bg-[#E9DFF6] text-[#3D334A] text-[18px] p-[8px] rounded-[6px] uppercase leading-[90%]">
                        ОРТОПЕДИЯ
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[48px] font-bold font-[Pt] text-[#3D334A] mb-4 leading-[100%] group-hover:text-purple-700 transition-colors duration-200 
               line-clamp-2">
                      {getText(course.setId.name)}
                    </h2>


                    {/* Description */}
                    <p className="text-[#846FA0] font-bold text-[20px] max-w-[643px] line-clamp-2 font-[Pt] mb-6 leading-[100%]">
                      {getText(course.setId.description).split('\n')[0]}
                    </p>

                  </div>
                  {/* Course stats */}
                  <div className='flex items-center justify-between mt-52 pr-16'>

                    <div className="flex items-center space-x-6">
                      {course.setId.duration && (
                        <div className="flex items-center text-gray-500">
                          <div className="w-10 h-10 bg-[#D4BAFC] rounded-lg flex items-center justify-center mr-3">
                            <Image src={"/assets/icons/icon.svg"} alt='wallet' width={28} height={20} />
                          </div>
                          <span className="font-medium">{course.setId.duration} წუთი</span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-500">
                        <div className="w-10 h-10 bg-[#D4BAFC] rounded-lg flex items-center justify-center mr-3">
                          <Image src={"/assets/icons/wallet.svg"} alt='wallet' width={28} height={20} />
                        </div>
                        <span className="font-medium">2 из 5 уроков</span>
                      </div>
                    </div>

                    {/* Continue button */}
                    <div className="flex items-center justify-between">
                      <button className="group flex items-center hover:text-[#372947] text-[#3D334A] font-medium transition-transform duration-200">
                        <span className="mr-2">გაგრძელება</span>
                        <svg
                          className="w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Right image */}
                <div className="flex-shrink-0">
                  <div className="w-[441px] h-[423px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-200 to-purple-300">
                    {course.setId.thumbnailImage ? (
                      <Image
                        src={course.setId.thumbnailImage}
                        alt={getText(course.setId.name)}
                        width={441}
                        height={423}
                        className="w-full h-full rounded-[20px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-purple-500 text-sm font-medium">კომპლექსი</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
} 