"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import SliderArrows from "./SliderArrows";
import CourseSlider from "./CourseSlider";
import Banner from "./Banner";
import { useI18n } from "../context/I18nContext";
import { API_CONFIG } from "../config/api";

interface Course {
  _id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  price: number;
  thumbnail: string;
  instructor: {
    name: string;
  };
}

const Professional = ({ withBanner, title, bgColor, withProfText }: { withBanner: boolean, title: string, bgColor: string, withProfText: boolean }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const { t } = useI18n();

  const sliderRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = (): void => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/courses?isPublished=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const container = sliderRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [courses]);

  const scrollLeft = (): void => {
    if (sliderRef.current) {
      // Scroll by approximately half of container width
      const scrollAmount = sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({ 
        left: -scrollAmount,
        behavior: "smooth" 
      });
    }
  };

  const scrollRight = (): void => {
    if (sliderRef.current) {
      // Scroll by approximately half of container width
      const scrollAmount = sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({ 
        left: scrollAmount,
        behavior: "smooth" 
      });
    }
  };

  return (
    <div style={{backgroundColor: bgColor}} className="mb-10 md:mx-5 md:rounded-[30px] ">
      {withBanner && (
        <Banner
          backgroundUrl="/assets/images/bluebg.jpg"
          logoUrl="/assets/images/simpleLogo.svg"
          icon="/assets/images/profIcon.png"
          iconHeight={50}
          iconWidth={170}
        />
      )}
      <div className="md:p-10 px-5">
        {withProfText && (
          <div className="">
          <h1 className="text-[20px] md:mt-10 md:text-[40px] md:tracking-[-3%] text-[#3D334A] leading-[120%] mb-2.5 md:mb-5">
            {typeof t("professional.title") === "string"
              ? t("professional.title")
              : "Professional Development"}
          </h1>
          <p className="text-[#3D334A] text-[18px] font-[Pt] font-medium md:max-w-[1320px] md:text-[24px] leading-[120%] md:leading-[120%] mb-5">
            {typeof t("professional.description") === "string"
              ? t("professional.description")
              : ""}
          </p>
          <Link
            className="text-[14px] md:text-[24px] leading-[90%] uppercase text-[#D4BAFC]"
            href="/professional"
          >
            {typeof t("professional.learn_more") === "string"
              ? t("professional.learn_more")
              : ""}
          </Link>
          <hr className="md:mt-10 mt-5 bg-[#D5D1DB] text-[#D5D1DB]" />
          </div>
        )}
        <div style={{backgroundColor: bgColor}} className="bg-[#F9F7FE] mt-4 md:mt-[50px] md:mb-[45px] rounded-2xl">
          <div className="flex items-center justify-between md:mb-[10px]">
            <h1 className="text-[20px] md:text-[40px] md:tracking-[-3%] text-[#3D334A] leading-[120%] mb-2.5 md:mb-5">
              {typeof t("professional.courses.title") === "string"
                ? t("professional.courses.title")
                : "Courses"}
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-2">
                {typeof t("professional.courses.error") === "string"
                  ? t("professional.courses.error")
                  : "Error loading courses"}
              </p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : (
                <div className="flex gap-4 md:mb-8">
                  <CourseSlider courses={courses} />
                </div>
          )}

          <Link
            href={"/allCourse"}
            className="md:text-[24px] md:mx-6 leading-[90%] uppercase text-[#D4BAFC]"
          >
            {typeof t("professional.courses.all_courses", {
              count: courses.length.toString(),
            }) === "string"
              ? t("professional.courses.all_courses", {
                  count: courses.length.toString(),
                })
              : `All ${courses.length} courses`}
          </Link>
        </div>
      </div>

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

export default Professional;