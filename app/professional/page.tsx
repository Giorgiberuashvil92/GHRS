/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import Image from "next/image";
import CategorySlider from "../components/CategorySlider";
import SliderArrows from "../components/SliderArrows";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import CourseSlider from "../components/CourseSlider";
import TeacherSlider from "../components/TeacherSlider";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";
import { Footer } from "../components/Footer";
import Category from "../components/Category";
import { API_CONFIG } from "../config/api";

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
  level: 'beginner' | 'intermediate' | 'advanced';
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [instructorsError, setInstructorsError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const url = `${API_CONFIG.BASE_URL}/courses?isPublished=true&limit=10`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      setInstructorsLoading(true);
      const url = `${API_CONFIG.BASE_URL}/instructors`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch instructors');
      }

      const responseData = await response.json();
      const data: BackendInstructor[] = Array.isArray(responseData) ? responseData : responseData.instructors || [];

      console.log('Instructors data:', data);

      // Transform data to match our interface
      const transformedInstructors: Instructor[] = data
        .filter(instructor => instructor.isActive)
        .map((instructor) => ({
          id: instructor._id,
          name: instructor.name,
          position: instructor.profession || "Преподаватель",
          institution: "«Колледжа медицинского массажа»",
          credentials: `${instructor.name}, ${instructor.profession || "Преподаватель"}`,
          education: [
            instructor.bio?.en || "",
            instructor.htmlContent?.en?.replace(/<[^>]*>/g, '') || ""
          ].filter(text => text.length > 0),
          imageUrl: instructor.profileImage || "/assets/images/teachers/default.jpg",
          bio: {
            en: instructor.bio?.en || "",
            ru: instructor.bio?.ru || "",
            ka: instructor.bio?.ka
          },
          htmlContent: {
            en: instructor.htmlContent?.en || "",
            ru: instructor.htmlContent?.ru || "",
            ka: instructor.htmlContent?.ka
          }
        }));

      console.log('Transformed instructors:', transformedInstructors);

      setInstructors(transformedInstructors);
      setInstructorsError(null);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setInstructorsError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setInstructorsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Header />
      <div className="mt-52 md:mt-40 md:px-5">
        <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-0 md:justify-between">
          <div className="md:w-[500px] w-[359px] relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] rounded-[20px]">
            <Image
              src={"/assets/images/medal.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px]">&gt;20</h2>
              <p className="text-[20px] font-medium">
                квалифицированных преподавателей
              </p>
            </div>
          </div>

          <div className="md:w-[453px] w-[359px] relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] rounded-[20px]">
            <Image
              src={"/assets/images/book.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px]">50+</h2>
              <p className="text-[20px] font-medium">эксклюзивных курсов</p>
            </div>
          </div>
          <div className="md:w-[453px] w-[359px] relative bg-[url('/assets/images/bluebg.jpg')] bg-cover h-[288px] rounded-[20px]">
            <Image
              src={"/assets/images/laptop.png"}
              width={202}
              height={202}
              alt="medal"
              className="absolute right-[15px] top-[15px]"
            />
            <div className="absolute bottom-5 left-5">
              <h2 className="text-[40px] tracking-[1px]">&gt;20</h2>
              <p className="text-[20px] font-medium">
                студентов, проходят обучения сейчас
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-10">
        <Category bgColor={""} customRounded={"30px"} customMx={""} />
        <div className="bg-[#F9F7FE] mt-4 md:mt-[50px] md:mx-5 md:mb-[45px] rounded-[30px]">
          <div className="p-5">
            <div className="flex items-center justify-between md:mb-[10px]">
              <h1 className="text-[20px] md:text-[40px] md:tracking-[-3%] text-[#3D334A] leading-[120%] mb-2.5 md:mb-5">
                {typeof t("professional.courses.title") === "string"
                  ? t("professional.courses.title")
                  : "Courses"}
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
                  {typeof t("professional.courses.error") === "string"
                    ? t("professional.courses.error")
                    : "Error loading courses"}
                </p>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : (
              <div
                ref={sliderRef}
                className="overflow-x-auto scrollbar-hide flex gap-4 mb-6"
              >
                <CourseSlider courses={courses as unknown as any[]} />
              </div>
            )}

            <Link
              href={"/allCourse"}
              className="md:text-[24px] leading-[90%] uppercase text-[#D4BAFC] block"
            >
              {typeof t("professional.courses.all_courses", {
                count: courses?.length.toString() || "0",
              }) === "string"
                ? t("professional.courses.all_courses", {
                  count: courses?.length.toString() || "0",
                })
                : `All ${courses?.length || 0} courses`}
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
        titleKey="subscription.test_title"
        buttonTextKey="buttons.take_test"
        buttonTextColor="#3D334A"
        buttonBgColor="#FFFFFF"
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
