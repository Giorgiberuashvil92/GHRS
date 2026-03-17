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
  /** ref for the scroll container – when set, parent can control scroll and may hide internal arrows */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** hide built-in arrows (use when parent provides its own) */
  hideArrows?: boolean;
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
  scrollContainerRef: externalScrollRef,
  hideArrows = false,
}) => {
  const { language } = useLanguage();
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalScrollRef || internalScrollRef;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const fallbackCourses: Course[] = Array.from({ length: 10 }, (_, i) => ({
    id: `fallback-${i + 1}`,
    title: "Default Course",
    description: "This is a fallback course description.",
    price: "5000 ₾",
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

  const getValidImage = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "/assets/images/course.png"; // Default image
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) return imageUrl;
    return "/assets/images/course.png"; // Fallback to default
  };

  const transformedCourses: Course[] = courses.map((course) => ({
    id: course._id || course.id.toString(),
    title: getLocalizedContent(course.title),
    description: getLocalizedContent(course.description),
    shortDescription: getLocalizedContent(course.shortDescription),
    price: course.price
      ? `${course.price}${language === "ka" ? " ₾" : language === "ru" ? " ₽" : " $"}` // Format price
      : "N/A",
    image: getValidImage(course.thumbnail),
    category: course.category
      ? {
          id: course.category.id.toString(),
          name: getLocalizedContent(course.category.name),
        }
      : undefined,
    instructor: course.instructor?.name
      ? getLocalizedContent(course.instructor.name)
      : undefined,
    duration: course.duration,
    level: course.level,
  }));

  const allCourses = transformedCourses.length > 0 ? transformedCourses : fallbackCourses;

  // When parent controls scroll, show all cards in the row so horizontal scroll works
  const effectiveMaxVisible = externalScrollRef ? Math.max(allCourses.length, maxVisible) : maxVisible;

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
        behavior: "smooth",
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
        behavior: "smooth",
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
      scrollElement.addEventListener("scroll", checkScrollPosition);

      // Check on resize
      const handleResize = () => {
        setTimeout(checkScrollPosition, 100);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        scrollElement.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [allCourses.length]);

  const displayCourses = showAll ? allCourses : allCourses.slice(0, effectiveMaxVisible);

  return (
    <div className="w-full relative">
      {/* Header with arrows (hidden when parent provides its own) */}
      {!hideArrows && (
        <div className="flex justify-between items-center mb-4 absolute -top-20 right-0">
          <SliderArrows
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />
        </div>
      )}

      {/* Scrollable horizontal layout for all screen sizes */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
      >
        {displayCourses.map((course) => (
          <div
            key={`course-${course.id}`}
            className="flex-shrink-0 w-[85vw] md:w-[calc(50%-8px)] lg:w-[calc(50%-8px)]"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {allCourses.length > effectiveMaxVisible && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="bg-[#846FA0] text-white py-2 px-6 rounded-full text-sm hover:bg-[#6e5c8a] transition"
          >
            {showAll ? "Hide" : "Show More"}
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
    const cleanText = text.trim().replace(/\s+/g, " ");
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  return (
    <Link
      href={`/singleCourse/${course.id}`}
      className="block w-full transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="bg-white rounded-[20px] p-4 w-full h-[420px] md:h-[450px] flex flex-col">
        <Image
          src={course.image}
          width={674}
          height={200}
          alt={`${course.title} course image`}
          className="mb-3 w-full h-[180px] md:h-[200px] object-cover rounded-[16px] flex-shrink-0"
        />
        <h5 className="text-[#1A1A1A] font-pt font-extrabold text-[18px] md:text-[22px] mb-2 leading-tight line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h5>
        <p className="text-[#1A1A1A]/70 font-pt font-semibold text-sm mb-3 leading-[140%] line-clamp-2 flex-grow">
          {truncateText(course.shortDescription || course.description, 120)}
        </p>
        <div className="w-full flex justify-end items-end mt-auto">
          <button className="bg-[#D4BAFC] py-2.5 px-6 rounded-[10px] text-[16px] md:text-[18px] font-bowler font-bold leading-[100%] text-white hover:bg-[#C4A6F1] transition-colors">
            {course.price}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseSlider;