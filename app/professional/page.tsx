/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import MainHeader from "../components/Header/MainHeader";
import Image from "next/image";
import SliderArrows from "../components/SliderArrows";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import CourseSlider from "../components/CourseSlider";
import TeacherSlider from "../components/TeacherSlider";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";
import { Footer } from "../components/Footer";
import { API_CONFIG } from "../config/api";
import { FaBook, FaDumbbell, FaClock } from "react-icons/fa";

interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  thumbnail: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  instructor?: {
    name: string;
  };
  duration?: string;
  level: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
  isFeatured: boolean;
}

interface InstructorBio {
  en: string;
  ru: string;
  ka?: string;
  _id?: string;
}

interface BackendInstructor {
  _id: string;
  name: string;
  email: string;
  profession: string;
  bio: InstructorBio;
  htmlContent: InstructorBio;
  profileImage: string;
  isActive: boolean;
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  certificates: string[];
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  id: string;
  name: string;
  position: string;
  institution: string;
  credentials: string;
  education: string[];
  imageUrl: string;
  bio: {
    en: string;
    ru: string;
    ka?: string;
  };
  htmlContent: {
    en: string;
    ru: string;
    ka?: string;
  };
}

interface Instructor {
  id: string;
  name: string;
  position: string;
  institution: string;
  credentials: string;
  education: string[];
  imageUrl: string;
  bio: {
    en: string;
    ru: string;
    ka?: string;
  };
  htmlContent: {
    en: string;
    ru: string;
    ka?: string;
  };
}

const Professional = () => {
  const { t } = useI18n();
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderRefTop = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [instructorsError, setInstructorsError] = useState<string | null>(null);

  const statsData = [
    {
      icon: <FaBook size={24} />,
      value: "50+",
      label: t("professional.stats.courses") || "Courses",
    },
    {
      icon: <FaDumbbell size={24} />,
      value: "20+",
      label: t("professional.stats.instructors") || "Instructors",
    },
    {
      icon: <FaClock size={24} />,
      value: "1000+",
      label: t("professional.stats.students") || "Students",
    },
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      const isProduction = typeof window !== 'undefined' && 
        window.location.hostname !== 'localhost' &&
        API_CONFIG.BASE_URL.includes('render.com');
      
      const endpoint = isProduction 
        ? '/courses?isPublished=true&limit=10'
        : '/api/courses?isPublished=true&limit=10';
      
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.courses);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      setInstructorsLoading(true);
      const url = `${API_CONFIG.BASE_URL}/api/instructors`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch instructors");
      }

      const responseData = await response.json();
      const data: BackendInstructor[] = Array.isArray(responseData)
        ? responseData
        : responseData.instructors || [];

      const transformedInstructors: Instructor[] = data
        .filter((instructor) => instructor.isActive)
        .map((instructor) => ({
          id: instructor._id,
          name: instructor.name,
          position: instructor.profession || "Teacher",
          institution: "«Колледжа медицинского массажа»",
          credentials: `${instructor.name}, ${
            instructor.profession || "Teacher"
          }`,
          education: [
            instructor.bio?.en || "",
            instructor.htmlContent?.en?.replace(/<[^>]*>/g, "") || "",
          ].filter((text) => text.length > 0),
          imageUrl:
            instructor.profileImage || "/assets/images/teachers/default.jpg",
          bio: {
            en: instructor.bio?.en || "",
            ru: instructor.bio?.ru || "",
            ka: instructor.bio?.ka,
          },
          htmlContent: {
            en: instructor.htmlContent?.en || "",
            ru: instructor.htmlContent?.ru || "",
            ka: instructor.htmlContent?.ka,
          },
        }));

      setInstructors(transformedInstructors);
      setInstructorsError(null);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setInstructorsError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setInstructorsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const scrollAmount = 340; // ~card width + gap for smooth scroll
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollLeftTop = () => {
    if (sliderRefTop.current) {
      sliderRefTop.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRightTop = () => {
    if (sliderRefTop.current) {
      sliderRefTop.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="relative">
        <MainHeader
          ShowBlock={false}
          stats={statsData as never[]}
          hideHeaderText={true}
          hideStats={true}
          customBlockTitle={t("professional.header.title") || "ПРОФЕССИОНАЛЬНОЕ РАЗВИТИЕ"}
          customBlockDescription={t("professional.header.description") || "Раздел обучение и проф-развитие в области реабилитации, физиотерапии и лечебно-восстановительного массажа — это коллаборация с Израильскими центрами обучения."}
          useVideo={false}
          backgroundImage="/assets/images/bluebg.jpg"
        />
        
        <div className="absolute bottom-0 right-0 hidden md:flex gap-4 bg-[#F9F7FE] rounded-tl-[80px] p-6 pb-8 z-10 items-end">
          <Link 
            href="/allCourse"
            className="text-white bg-[#3D334A] rounded-[40px] w-[246px] h-[222px] flex items-start justify-start p-8 transition-transform duration-300 hover:scale-105 cursor-pointer font-bold uppercase text-lg shadow-2xl leading-tight font-bowler"
          >
            {t("professional.our_courses") || "Наши курсы"}
          </Link>
        </div>
      </div>
      
      <div className="mt-10 md:px-5">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-5 px-4 md:px-0">
          <div className="md:flex-1 w-full max-w-[359px] md:max-w-none relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] md:h-[400px] rounded-[20px]">
            <Image
              src={"/assets/images/medal.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px] text-white">&gt;20</h2>
              <p className="text-[20px] font-medium text-white">
                {t("professional.cards.qualified_teachers") || "квалифицированных преподавателей"}
              </p>
            </div>
          </div>

          <div className="md:flex-1 w-full max-w-[359px] md:max-w-none relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] md:h-[400px] rounded-[20px]">
            <Image
              src={"/assets/images/book.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px] text-white">50+</h2>
              <p className="text-[20px] font-medium text-white">{t("professional.cards.exclusive_courses") || "эксклюзивных курсов"}</p>
            </div>
          </div>
          
          <div className="md:flex-1 w-full max-w-[359px] md:max-w-none relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] md:h-[400px] rounded-[20px]">
            <Image
              src={"/assets/images/laptop.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px] text-white">&gt;20</h2>
              <p className="text-[20px] font-medium text-white">
                {t("professional.cards.students_learning") || "студентов, проходят обучения сейчас"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* სატესტოდ: იგივე პოპულარული კურსები ზემოთ */}
      <div className="mt-10">
        <div className="bg-[#F9F7FE] mt-4 md:mt-[50px] md:mx-5 md:mb-[45px] rounded-[30px]">
          <div className="p-5">
            <div className="flex items-center justify-between md:mb-[10px]">
              <h1 className="text-[24px] md:text-[64px] font-bowler uppercase tracking-[-1%] text-[#3D334A] leading-[100%] mb-2.5 md:mb-5">
                {t("professional.courses.popular_courses") || "ПОПУЛЯРНЫЕ КУРСЫ"}
              </h1>
              <SliderArrows
                onScrollLeft={scrollLeftTop}
                onScrollRight={scrollRightTop}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 mb-2">
                  {t("professional.courses.error") || "Error loading courses"}
                </p>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : (
              <div className="mb-6">
                <CourseSlider
                  courses={courses as unknown as any[]}
                  scrollContainerRef={sliderRefTop}
                  hideArrows={true}
                />
              </div>
            )}

            <Link
              href={"/allCourse"}
              className="text-[14px] md:text-[24px] font-bowler uppercase leading-[90%] text-[#D4BAFC] hover:opacity-80 transition-opacity block"
            >
              {t("professional.courses.all_courses", {
                count: courses?.length.toString() || "0",
              }) || `All ${courses?.length || 0} courses`}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="bg-[#F9F7FE] mt-4 md:mt-[50px] md:mx-5 md:mb-[45px] rounded-[30px]">
          <div className="p-5">
            <div className="flex items-center justify-between md:mb-[10px]">
              <h1 className="text-[24px] md:text-[64px] font-bowler uppercase tracking-[-1%] text-[#3D334A] leading-[100%] mb-2.5 md:mb-5">
                {t("professional.courses.title") || "КУРСЫ"}
              </h1>
              <SliderArrows
                onScrollLeft={scrollLeft}
                onScrollRight={scrollRight}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 mb-2">
                  {t("professional.courses.error") || "Error loading courses"}
                </p>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : (
              <div className="mb-6">
                <CourseSlider
                  courses={courses as unknown as any[]}
                  scrollContainerRef={sliderRef}
                  hideArrows={true}
                />
              </div>
            )}

            <Link
              href={"/allCourse"}
              className="text-[14px] md:text-[24px] font-bowler uppercase leading-[90%] text-[#D4BAFC] hover:opacity-80 transition-opacity block"
            >
              {t("professional.courses.all_courses", {
                count: courses?.length.toString() || "0",
              }) || `All ${courses?.length || 0} courses`}
            </Link>
          </div>
        </div>
      </div>

      {instructorsLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : instructorsError ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">Error loading instructors</p>
          <p className="text-gray-500 text-sm">{instructorsError}</p>
        </div>
      ) : (
        <div className="md:mb-10 md:mr-10">
          <TeacherSlider teachers={instructors as unknown as Teacher[]} />
        </div>
      )}

      <Subscribe
        backgroundImage="/assets/images/bluebg.jpg"
        titleKey="subscription.title"
        buttonTextKey="buttons.subscribe"
        buttonTextColor="#3D334A"
        buttonBgColor="#FFFFFF"
        href="/shoppingcard"
        bgCenter={true}
        containerStyles="custom-class"
        titleStyles="text-white"
        buttonStyles="hover:opacity-80"
      />
      <div className="md:mb-10">
        <ReviewSlider title={""} />
      </div>
      <Footer />
    </div>
  );
};

export default Professional;