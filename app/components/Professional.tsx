"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import SliderArrows from "./SliderArrows";
import CourseSlider from "./CourseSlider";
import ReviewSlider from "./ReviewSlider";
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

const Professional = ({
  withBanner,
  title,
  bgColor,
  withProfText,
  showReviews = true,
  instructorCoursesFilter,
}: {
  withBanner: boolean;
  title: string;
  bgColor: string;
  withProfText: boolean;
  showReviews?: boolean;
  /** მხოლოდ ამ ინსტრუქტორის კურსები (მაგ. TeacherInfo) */
  instructorCoursesFilter?: { id: string; name?: string };
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const { t } = useI18n();

  const sliderRef = useRef<HTMLDivElement>(null);
  const instructorFilterRef = useRef(instructorCoursesFilter);
  instructorFilterRef.current = instructorCoursesFilter;

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

        const base = `${API_CONFIG.BASE_URL}/api/courses`;
        let url = `${base}?isPublished=true&limit=80&page=1`;
        const instFilter = instructorFilterRef.current;
        if (instFilter?.id) {
          const q = new URLSearchParams({
            page: "1",
            limit: "80",
          });
          const n = instFilter.name?.trim();
          if (n) q.set("name", n);
          url = `${base}/instructor/${encodeURIComponent(instFilter.id)}?${q.toString()}`;
        }

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Accept-Language": "en",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [instructorCoursesFilter?.id]);

  useEffect(() => {
    const container = sliderRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons(); // Initial check

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, [courses]);

  const scrollLeft = (): void => {
    if (sliderRef.current) {
      // Scroll by approximately half of container width
      const scrollAmount = sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (): void => {
    if (sliderRef.current) {
      // Scroll by approximately half of container width
      const scrollAmount = sliderRef.current.clientWidth / 2;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="mb-10 md:mx-5 md:rounded-[30px] "
    >
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
            <h1 className="text-[20px] md:mt-10 md:text-[40px] md:tracking-[-3%] text-[#3D334A] leading-[120%] mb-2.5 md:mb-5 font-bowler">
              {typeof t("professional.title") === "string"
                ? t("professional.title")
                : "Professional Development"}
            </h1>
            <p className="text-[#3D334A] text-[18px] md:max-w-[1320px] md:text-[24px] leading-[120%] mb-5 font-pt">
              {typeof t("professional.description") === "string"
                ? t("professional.description")
                : ""}
            </p>
            <Link
              className="text-[14px] md:text-[24px] leading-[90%] uppercase text-[#D4BAFC] font-bowler"
              href="/professional"
            >
              {typeof t("professional.learn_more") === "string"
                ? t("professional.learn_more")
                : ""}
            </Link>
            <hr className="md:mt-10 mt-5 bg-[#D5D1DB] text-[#D5D1DB]" />
          </div>
        )}
        <div
          style={{ backgroundColor: bgColor }}
          className="bg-red-500 w-full mt-4 md:mt-[50px] md:mb-[45px] rounded-2xl"
        >
          <div className="flex items-center justify-between md:mb-[10px] ">
            <h1 className="text-[20px] md:text-[40px] md:tracking-[-3%] text-[#3D334A] leading-[120%] mb-2.5 md:mb-5 font-bowler">
              {instructorCoursesFilter
                ? t("teacher.instructorCourses")
                : typeof t("professional.courses.title") === "string"
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
              <p className="text-red-500 mb-2 font-pt text-[18px] leading-[120%]">
                {typeof t("professional.courses.error") === "string"
                  ? t("professional.courses.error")
                  : "Error loading courses"}
              </p>
              <p className="text-gray-500 text-[16px] leading-[120%] font-pt">{error}</p>
            </div>
          ) : courses.length === 0 && instructorCoursesFilter ? (
            <p className="text-center text-[#846FA0] font-pt py-10 text-[16px] md:text-[18px] leading-relaxed">
              {typeof t("teachers.no_courses_instructor") === "string"
                ? t("teachers.no_courses_instructor")
                : "No published courses for this instructor yet."}
            </p>
          ) : (
            <div className="flex gap-4 md:mb-8">
              <CourseSlider
                courses={courses.map((course) => ({
                  _id: course._id,
                  id: course._id,
                  title: (course as any).title?.en || course.title || "Course",
                  shortDescription: (course as any).shortDescription || course.description || "",
                  price: course.price,
                  currency: "USD",
                  imageUrl: course.thumbnail,
                  instructorName: course.instructor?.name,
                  description: (course as any).description?.en || course.description || "",
                  categoryId: (course as any).categoryId || "default-category",
                  level: (course as any).level || "beginner",
                  isActive: true,
                  createdAt: (course as any).createdAt || new Date().toISOString(),
                  updatedAt: (course as any).updatedAt || new Date().toISOString(),
                  isFeatured: false,
                  thumbnail: course.thumbnail,
                })) as any}
              />
            </div>
          )}

          {!instructorCoursesFilter && (
            <Link
              href={"/allCourse"}
              className="md:text-[24px] md:mx-6 leading-[90%] uppercase text-[#D4BAFC] font-bowler"
            >
              {typeof t("professional.courses.all_courses", {
                count: courses.length.toString(),
              }) === "string"
                ? t("professional.courses.all_courses", {
                    count: courses.length.toString(),
                  })
                : `All ${courses.length} courses`}
            </Link>
          )}

          {showReviews && (
            <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-[#846FA0]/20">
              <ReviewSlider embeddedInCard />
            </div>
          )}
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
