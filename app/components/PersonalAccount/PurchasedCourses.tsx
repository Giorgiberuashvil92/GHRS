'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_CONFIG } from '../../config/api';
import Image from 'next/image';
import Link from 'next/link';

interface PurchasedCourse {
  setId: {
    _id: string;
    name: {
      ka: string;
      en: string;
      ru: string;
    };
    description: {
      ka: string;
      en: string;
      ru: string;
    };
    thumbnail?: string;
  };
  purchaseDate: string;
  expiresAt?: string;
}

export default function PurchasedCourses() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await apiRequest<PurchasedCourse[]>(API_CONFIG.PURCHASES.GET_MY_COURSES);
        setCourses(response);
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
    return <div className="text-center p-4">იტვირთება...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">თქვენ ჯერ არ გაქვთ შეძენილი კურსები</p>
        <Link href="/chapter" className="text-blue-500 hover:underline">
          ნახეთ ხელმისაწვდომი კურსები
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {courses.map((course) => (
        <Link 
          href={`/sets/${course.setId._id}`} 
          key={course.setId._id}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative h-48">
            {course.setId.thumbnail ? (
              <Image
                src={course.setId.thumbnail}
                alt={course.setId.name.ka}
                fill
                className="object-cover rounded-t-lg"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-400">სურათი არ არის</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{course.setId.name.ka}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.setId.description.ka}</p>
            <div className="text-xs text-gray-500">
              შეძენის თარიღი: {new Date(course.purchaseDate).toLocaleDateString('ka-GE')}
              {course.expiresAt && (
                <div>
                  ვადა: {new Date(course.expiresAt).toLocaleDateString('ka-GE')}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 