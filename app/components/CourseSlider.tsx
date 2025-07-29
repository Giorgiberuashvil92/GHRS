"use client";

import { Course as BackendCourse } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/context/I18nContext";

interface LocalizedContent {
  en?: string;
  ru?: string;
  ka?: string;
  _id?: string;
  [key: string]: string | undefined;
}

interface ExtendedBackendCourse extends BackendCourse {
  _id?: string;
  thumbnail?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category?: {
    id: string;
    name: string;
  };
  instructor?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  shortDescription?: string;
}

interface CourseSliderProps {
  courses?: ExtendedBackendCourse[];
  maxVisible?: number;
}

// SliderArrows Component
interface SliderArrowsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
}

const SliderArrows = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft = true,
  canScrollRight = true,
}: SliderArrowsProps) => {
  return (
    <div className="items-center hidden md:flex gap-2">
      <div
        onClick={canScrollLeft ? onScrollLeft : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer ${
          canScrollLeft
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <Image
          src="/assets/images/rightIcon.svg"
          width={11}
          height={19}
          alt="leftIcon"
          className={!canScrollLeft ? "opacity-50" : ""}
        />
      </div>
      <div
        onClick={canScrollRight ? onScrollRight : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer ${
          canScrollRight
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <Image
          src="/assets/images/leftIcon.svg"
          width={11}
          height={19}
          alt="rightIcon"
          className={!canScrollRight ? "opacity-50" : ""}
        />
      </div>
    </div>
  );
};

const CourseSlider: React.FC<CourseSliderProps> = ({
  courses = [],
  maxVisible = 4,
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const fallbackCourses: Course[] = Array.from({ length: 10 }, (_, i) => ({
    id: `fallback-${i + 1}`,
    title: "Ортопедия",
    description:
      "Курсы и мастер-классы для опытных терапевтов. Практикум по лечению ортопедических проблем",
    price: "4023 $",
    image: "/assets/images/course.png",
  }));

  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const getLocalizedContent = (content: string | LocalizedContent | undefined): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") {
      if (content[language]) return content[language]!;
      if (content.en) return content.en;
      const availableLang = Object.keys(content).find(key =>
        ["ka", "ru", "en"].includes(key) && typeof content[key] === "string"
      );
      if (availableLang && content[availableLang]) return content[availableLang]!;
    }
    return "";
  };

  const transformedCourses: Course[] = courses.map((course) => ({
    id: course._id || course.id.toString(),
    title: getLocalizedContent(course.title),
    description: getLocalizedContent(course.description),
    shortDescription: getLocalizedContent(course.shortDescription),
    price: `${course.price}${language === "ka" ? " ₾" : language === "ru" ? " ₽" : " $"}`,
    image: course.thumbnail || "/assets/images/course.png",
    category: course.category ? {
      id: course.category.id.toString(),
      name: getLocalizedContent(course.category.name)
    } : undefined,
    instructor: course.instructor?.name ? getLocalizedContent(course.instructor.name) : undefined,
    duration: course.duration,
    level: course.level
  }));

  const allCourses = transformedCourses.length > 0 ? transformedCourses : fallbackCourses;

  // Check scroll position and update arrow states
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const gap = 16; // 4 * 4px (gap-4)
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const gap = 16; // 4 * 4px (gap-4)
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      // Initial check
      checkScrollPosition();
      
      // Add scroll event listener
      scrollElement.addEventListener('scroll', checkScrollPosition);
      
      // Check on resize
      const handleResize = () => {
        setTimeout(checkScrollPosition, 100);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        scrollElement.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [allCourses.length]);

  const displayCourses = showAll ? allCourses : allCourses.slice(0, maxVisible);

  return (
    <div className="w-full relative">
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-4 absolute -top-20 right-0">

        <SliderArrows
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          
        />
      </div>

      {/* Scrollable horizontal layout for all screen sizes */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
      >
        {displayCourses.map((course) => (
          <div
            key={`course-${course.id}`}
            className="flex-shrink-0 w-[80vw] md:w-[45%]"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* Show more button */}
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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>  
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const truncateText = (text: string, maxLength: number = 100) => {
    const cleanText = text.trim().replace(/\s+/g, ' ');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  return (
    <Link
      href={`/singleCourse/${course.id}`}
      className="block w-full transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="bg-white rounded-[20px] p-1.5 pb-4 w-full">
        <div className="h-[418px]">     
          <Image
            src={course.image}
            width={674}
            height={249}
            alt={`${course.title} course image`}
            className="mb-5 w-full h-[233px] object-cover rounded-[16px]"
          />
          <h5 className="text-[#3D334A] px-4 md:text-[20px] mb-2 mt-4 md:mb-5 leading-[120%]">
            {course.title}
          </h5>
          <p className="text-[#846FA0] px-4 text-[14px] mb-[14px] leading-[120%] line-clamp-1">
            {truncateText(course.shortDescription || course.description)}
          </p>
          <div className="w-full flex justify-end items-end pr-4 md:mt-5">
            <button className="bg-[#D4BAFC] py-[5px] px-4 rounded-[3px] md:mt-[19px] md:rounded-[10px] text-[12px] md:text-[18px] leading-[100%] text-white">
              {course.price}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseSlider;