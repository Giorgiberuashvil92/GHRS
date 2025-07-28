"use client";

import { Course as BackendCourse } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/I18nContext";

// Type for localized content
interface LocalizedContent {
  en?: string;
  ru?: string;
  ka?: string;
  _id?: string;
  [key: string]: string | undefined;
}

// Extend BackendCourse to include MongoDB specific fields
interface ExtendedBackendCourse extends BackendCourse {
  _id?: string;
  thumbnail?: string;
}

interface Course {
  id: string; // Changed from number to string for MongoDB ObjectId
  title: string;
  description: string;
  price: string;
  image: string;
  category?: {
    id: string; // Changed from number to string
    name: string;
  };
  instructor?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

interface CourseSliderProps {
  courses?: ExtendedBackendCourse[];
  maxVisible?: number;
}

const CourseSlider: React.FC<CourseSliderProps> = ({
  courses = [],
  maxVisible = 4,
}) => {
  const { language } = useLanguage();
  const fallbackCourses: Course[] = Array.from({ length: 10 }, (_, i) => ({
    id: `fallback-${i + 1}`, // Changed to string ID
    title: "Ортопедия",
    description:
      "Курсы и мастер-классы для опытных терапевтов. Практикум по лечению ортопедических проблем",
    price: "4023 $",
    image: "/assets/images/course.png",
  }));

  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Helper function to get localized content
  const getLocalizedContent = (content: string | LocalizedContent | undefined): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") {
      // First try the current language
      if (content[language]) return content[language]!;
      // Then try English as fallback
      if (content.en) return content.en;
      // Then try any available language
      const availableLang = Object.keys(content).find(key => 
        ["ka", "ru", "en"].includes(key) && typeof content[key] === "string"
      );
      if (availableLang && content[availableLang]) return content[availableLang]!;
    }
    return "";
  };

  // Transform backend courses to match our display format
  const transformedCourses: Course[] = courses.map((course) => ({
    id: course._id || course.id.toString(), // Handle both MongoDB _id and regular id
    title: getLocalizedContent(course.title),
    description: getLocalizedContent(course.shortDescription) || getLocalizedContent(course.description),
    price: `${course.price} ${course.currency}`,
    image: course.thumbnail || course.thumbnail || "/assets/images/course.png",
    category: course.category ? {
      id: course.category.id.toString(),
      name: getLocalizedContent(course.category.name)
    } : undefined,
    instructor: course.instructor?.name ? getLocalizedContent(course.instructor.name) : undefined,
    duration: course.duration,
    level: course.level
  }));

  const allCourses = transformedCourses.length > 0 ? transformedCourses : fallbackCourses;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayCourses = showAll ? allCourses : allCourses.slice(0, maxVisible);

  return (
    <div className="w-full">
      {/* Desktop View: Grid */}
      {!isMobile && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {displayCourses.map((course) => (
              <div key={`desktop-${course.id}`}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          {allCourses.length > maxVisible && !showAll && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(true)}
                className="w-[512px] hover:text-white duration-300 py-4 cursor-poer rounded-[10px] text-[#3D334A] text-[32px] bg-[#D4BAFC] flex justify-center items-center mx-auto mt-10"
              >
                Показать ещё
              </button>
            </div>
          )}
        </>
      )}

      {/* Mobile View: Horizontal scroll */}
      {isMobile && (
        <>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {displayCourses.map((course) => (
              <div key={`mobile-${course.id}`} className="flex-shrink-0 w-[250px]">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {allCourses.length > maxVisible && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="bg-[#846FA0] text-white py-2 px-6 rounded-full text-sm hover:bg-[#6e5c8a] transition"
              >
                {showAll ? "Скрыть" : "Показать ещё"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CourseCard = ({ course }: { course: Course }) => (
  <Link 
    href={`/singleCourse/${course.id}`} 
    className="block w-full transition-transform duration-300 hover:scale-[1.02]"
  >
    <div className="bg-white rounded-[20px] p-1.5 pb-4 w-full">
      <Image
        src={course.image}
        width={674}
        height={300}
        alt={`${course.title} course image`}
        className="mb-5 w-full h-[233px] object-cover rounded-[16px]"
      />
      <h5 className="text-[#3D334A] md:text-[20px] mb-2 mt-4 md:mb-5 leading-[120%]">
        {course.title}
      </h5>
      <p className="text-[#846FA0] text-[14px] mb-[14px] leading-[120%]">
        {course.instructor
          ? `Преподаватель: ${course.instructor}`
          : "С советами по безопасности, которым нужно следовать до и после перелома Кристен Гасник"}
      </p>
      <div className="w-full flex justify-end items-end pr-4 md:mt-5">
        <button className="bg-[#D4BAFC] py-[5px] px-4 rounded-[3px] md:mt-[19px] md:rounded-[10px] text-[12px] md:text-[18px] leading-[100%] text-[#3D334A]">
          {course.price} RUB
        </button>
      </div>
    </div>
  </Link>
);

export default CourseSlider;
