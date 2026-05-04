/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { FaBullhorn, FaBookOpen } from "react-icons/fa";
import DesktopNavbar from "../../components/Navbar/DesktopNavbar";
import { getDefaultMenuItems } from "../../components/Header/Header";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchCourse, fetchRelatedCourses } from "../../config/api";
import CourseSlider from "@/app/components/CourseSlider";
import SliderArrows from "@/app/components/SliderArrows";
import { Footer } from "@/app/components/Footer";
import { useUserAccess } from "../../hooks/useUserAccess";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useI18n } from "../../context/I18nContext";
import { sanitizeHtml } from "../../utils/sanitize";
import { useCourseInstructor } from "../../hooks/useInstructorByName";
import {
  displayLegacyCourseInstructorField,
  instructorDisplayNameForLocale,
  primaryKeyForLegacyCourseInstructorLookup,
  resolveCourseLocale,
} from "../../utils/instructorDisplay";

type CourseLocale = "en" | "ru" | "ka";

// Helper function to pick localized content
const pickLocalized = (
  field: { en?: string; ru?: string; ka?: string } | undefined,
  locale: CourseLocale
): string => {
  if (!field) return "";
  return field[locale] || field.en || field.ru || field.ka || "";
};

/** კურსში ჩაწერილი instructor.name — სტრიქონი ან მრავალენოვანი (API/legacy) */
type CourseInstructorNameField = string | { en?: string; ru?: string; ka?: string };

function normalizeCourseInstructorNameForLookup(
  name: CourseInstructorNameField | undefined | null
): string {
  if (name == null) return "";
  if (typeof name === "string")
    return primaryKeyForLegacyCourseInstructorLookup(name);
  return (name.en || name.ru || name.ka || "").trim();
}

function displayCourseInstructorNameForLocale(
  name: CourseInstructorNameField | undefined | null,
  locale: CourseLocale
): string {
  if (name == null) return "";
  if (typeof name === "string")
    return displayLegacyCourseInstructorField(name, locale);
  return pickLocalized(name, locale).trim();
}

// Helper function to check if rich text is effectively empty
const isEffectivelyEmptyRichText = (html: string | undefined): boolean => {
  if (!html) return true;
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
};

interface Course {
  _id: string;
  title: {
    en: string;
    ru: string;
    ka?: string;
  };
  description: {
    en: string;
    ru: string;
    ka?: string;
  };
  shortDescription?: {
    en: string;
    ru: string;
    ka?: string;
  };
  price: number;
  priceLocalized?: { en?: number; ru?: number; ka?: number };
  thumbnail: string;
  additionalImages?: string[];
  advertisementImage?: string;
  duration?: number;
  isPublished?: boolean;
  instructor: {
    name: CourseInstructorNameField;
    instructorId?: string;
  };
  prerequisites?: {
    en: string;
    ru: string;
    ka?: string;
  };
  certificateDescription?: {
    en: string;
    ru: string;
    ka?: string;
  };
  certificateImages?: string[];
  learningOutcomes?: Array<{
    en: string;
    ru: string;
    ka?: string;
  }>;
  announcements?: Array<{
    title: {
      en: string;
      ru: string;
      ka?: string;
    };
    content: {
      en: string;
      ru: string;
      ka?: string;
    };
    isActive: boolean;
  }>;
  syllabus?: Array<{
    _id?: string;
    title: {
      en: string;
      ru: string;
      ka?: string;
    };
    description: {
      en: string;
      ru: string;
      ka?: string;
    };
    duration: number;
  }>;
  languages?: string[];
  tags?: string[];
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SingleCourse() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  console.log("Course ID from params:", courseId);

  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const courseInstructorLookupName = useMemo(
    () => normalizeCourseInstructorNameForLookup(course?.instructor?.name),
    [course?.instructor?.name]
  );

  const { instructor } = useCourseInstructor({
    courseInstructorId: course?.instructor?.instructorId,
    courseInstructorName: courseInstructorLookupName,
  });

  // Auth context
  const { isAuthenticated } = useAuth();

  // I18n context
  const { t, locale } = useI18n();
  const loc = resolveCourseLocale(locale);
  const menuItems = useMemo(() => getDefaultMenuItems(t), [t, locale]);

  /** ინსტრუქტორის სახელი მიმდინარე UI ენაზე (იგივე ლოგიკა, რაც კურსის სათაურზე) */
  const instructorLabel = useMemo(() => {
    if (instructor) {
      const fromProfile = instructorDisplayNameForLocale(instructor, loc).trim();
      if (fromProfile) return fromProfile;
    }
    const fromCourseEmbed = displayCourseInstructorNameForLocale(
      course?.instructor?.name,
      loc
    );
    if (fromCourseEmbed) return fromCourseEmbed;
    if (instructor) {
      const plain = (instructor.name || "").trim();
      if (plain) {
        return plain.includes("|")
          ? displayLegacyCourseInstructorField(plain, loc)
          : plain;
      }
    }
    return "";
  }, [instructor, course?.instructor?.name, loc, locale]);

  const getEffectivePrice = (c: Course): number => {
    const loc = c.priceLocalized;
    if (loc && typeof loc[locale as keyof typeof loc] === "number") return loc[locale as keyof typeof loc]!;
    return c.price ?? 0;
  };
  const formatPrice = (c: Course): string => {
    const p = getEffectivePrice(c);
    const sym = locale === "ka" ? "₾" : locale === "ru" ? "₽" : "$";
    return `${p} ${sym}`;
  };

  // Modal context
  const { showError, showSuccess } = useModal();

  // Course access check
  const { hasAccess, loading: accessLoading } = useUserAccess(
    undefined,
    courseId
  );

  const sliderRef = useRef<HTMLDivElement>(null);

  const rightCardImage = "/assets/images/reklamos.png";
  const tabs = [
    t("course.tabs.description"),
    t("course.tabs.syllabus"),
    t("course.tabs.announcements"),
    t("course.tabs.reviews")
  ];
  const [activeTab, setActiveTab] = useState(0);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // კურსის ყიდვის ფუნქცია
  const handlePurchaseCourse = () => {
    if (!course) {
      console.error("❌ No course data available");
      return;
    }

    // Check if user already has access (only if authenticated)
    if (isAuthenticated && hasAccess) {
      showError(
        t("course.already_purchased") ||
          "You already have access to this course!",
        t("course.already_purchased_title") || "Already Purchased"
      );
      return;
    }

    console.log("🛒 Adding course to cart", { courseId, course, isAuthenticated });

    try {
      // კურსის მონაცემები shopping cart-ისთვის
      const courseItem = {
        id: course._id,
        title: pickLocalized(course.title, loc),
        desc:
          pickLocalized(course.shortDescription, loc) ||
          pickLocalized(course.description, loc) ||
          t("course.no_description"),
        img: course.thumbnail, // ✅ img ველი
        price: getEffectivePrice(course),
        subscription: 1, // ✅ default subscription
        totalExercises: course.syllabus?.length || 0,
        totalDuration: course?.duration
          ? t("course.duration_minutes", { duration: String(course.duration) })
          : "0:00",
        itemType: "course", // ✅ itemType ველი
        type: "course", // ✅ backward compatibility
      };

      console.log("📦 Course item created:", courseItem);

      // არსებული cart-ის მოძებნა ან ცარიელი array-ის შექმნა
      const existingCart = localStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];

      console.log("🛍️ Existing cart:", cart);

      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(
        (item: any) => item.id === courseId
      );
      if (existingItemIndex !== -1) {
        // Update existing item with new data
        cart[existingItemIndex] = courseItem;
        console.log("✏️ Updated existing course in cart");
        showSuccess(
          t("course.updated_in_cart") || "Course updated in cart!",
          t("course.success_title") || "Success"
        );
      } else {
        // Add new item
        cart.push(courseItem);
        console.log("➕ Added new course to cart");
        showSuccess(
          t("course.added_to_cart") || "Course added to cart!",
          t("course.success_title") || "Success"
        );
      }

      // localStorage-ში შენახვა
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("💾 Cart saved to localStorage:", cart);

      // shopping cart გვერდზე გადასვლა
      console.log("🔄 Redirecting to shopping cart...");
      router.push("/shoppingcard");
    } catch (error) {
      console.error("❌ Error adding course to cart:", error);
      alert("Failed to add course to cart. Please try again.");
    }
  };

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        console.log("No courseId found in params");
        setError("Course ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);
        setError(null);
        console.log("Loading course with ID:", courseId);
        const raw = await fetchCourse(courseId);
        const data =
          raw &&
          typeof raw === "object" &&
          typeof (raw as { instructor?: unknown }).instructor === "string"
            ? {
                ...(raw as Record<string, unknown>),
                instructor: {
                  name: (raw as { instructor: string }).instructor,
                },
              }
            : raw;
        console.log("Loaded course data:", data);
        setCourse(data as Course);
        setError(null);

        // Load related courses if categoryId exists
        if (data.categoryId) {
          await loadRelatedCourses(courseId, data.categoryId);
        }
      } catch (err: unknown) {
        console.error("Error loading course:", err);
        const is404 =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { status?: number } }).response?.status === "number" &&
          (err as { response: { status: number } }).response.status === 404;
        if (is404) {
          setNotFound(true);
          setError(null);
        } else {
          setNotFound(false);
          setError(err instanceof Error ? err.message : "Failed to load course");
        }
      } finally {
        setLoading(false);
      }
    };

    const loadRelatedCourses = async (
      currentCourseId: string,
      categoryId: string
    ) => {
      try {
        setRelatedLoading(true);
        const relatedData = await fetchRelatedCourses(
          currentCourseId,
          categoryId,
          4
        );
        setRelatedCourses(relatedData.courses || []);
      } catch (err) {
        console.error("Error loading related courses:", err);
      } finally {
        setRelatedLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            მონაცემები იტვირთება...
          </h2>
        </div>
      </div>
    );
  }

  if (notFound || error || !course) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {notFound ? (
            <>
              <h2 className="text-xl font-semibold text-[#302A3A] mb-2">
                {t("course.not_found_title") || "კურსი ვერ მოიძებნა"}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("course.not_found_message") ||
                  "ამ მისამართის კურსი არ არსებობს ან წაშლილია."}
              </p>
              <Link
                href="/allCourse"
                className="inline-block px-6 py-3 bg-[#6C5CE7] text-white rounded-xl hover:opacity-90 transition"
              >
                {t("course.view_all_courses") || "ყველა კურსი"}
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl text-red-600 mb-4">
                {t("course.error_loading")}
              </h2>
              <p className="text-gray-600">{error || "Course not found"}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <DesktopNavbar
        menuItems={menuItems}
        blogBg={false}
        allCourseBg={false}
      />

      <div className="bg-[#FAF7FF] flex flex-col items-center py-6 px-2 w-full text-[#302A3A]">
        <div className="w-full md:px-10">
          <img
            src={course.thumbnail}
            alt={pickLocalized(course.title, loc)}
            className="w-full h-[517px] object-cover mb-10 rounded-[40px]"
          />
        </div>
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* მარცხენა ქარდი */}
          <div className="w-full md:w-[335px] flex-shrink-0 flex flex-col h-auto md:h-[262px] bg-white p-4 rounded-[20px] order-1 md:order-1 mb-4 md:mb-0">
            <div className="flex items-center gap-4 pb-[18px]">
              <Image
                src={instructor?.profileImage || "/assets/images/someone.png"}
                alt={instructorLabel}
                width={50}
                height={50}
                className="w-[50px] h-[50px] rounded-[12px] object-cover mb-[10px]"
              />
              <span
                className="font-bold text-[18px] leading-7 tracking-[0.01em] text-[rgba(61,51,74,1)]"
                lang={locale}
              >
                {instructorLabel}
              </span>
            </div>
            <div className="border-t border-[#EEEAFB]" />

            {/* Duration Info */}
            <div className="flex gap-[10px] py-[18px] items-center">
              <span className="w-[48px] h-[48px] flex items-center justify-center bg-[#E1D7FA] rounded-[12px]">
                <FaBookOpen className="text-[#A993F8] text-[26px]" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-[18px] text-[rgba(132,111,160,1)]">
                  {course.duration ? t("course.duration_minutes", { duration: course.duration.toString() }) : t("course.not_specified")}
                </span>
                <span className="text-sm text-[#A9A6B4]">
                  {t("course.duration")}
                </span>
              </div>
            </div>
            <div className="border-t border-[#EEEAFB]" />

            {/* Lessons Count */}
            <div className="flex gap-[10px] py-[18px] items-center">
              <span className="w-[48px] h-[48px] flex items-center justify-center bg-[#E1D7FA] rounded-[12px]">
                <FaBullhorn className="text-[#A993F8] text-[26px]" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-[18px] text-[rgba(132,111,160,1)]">
                  {course.syllabus
                    ? t("course.lessons_count", { count: course.syllabus.length.toString() })
                    : t("course.not_specified")}
                </span>
                <span className="text-sm text-[#A9A6B4]">
                  {t("course.lessons_label")}
                </span>
              </div>
            </div>

            {/* Languages */}
            {course.languages && course.languages.length > 0 && (
              <>
                <div className="border-t border-[#EEEAFB]" />
                <div className="flex gap-[10px] py-[18px] items-center">
                  <span className="w-[48px] h-[48px] flex items-center justify-center bg-[#E1D7FA] rounded-[12px] text-[#A993F8] font-bold">
                    🌐
                  </span>
                  <div className="flex flex-col">
                    <div className="flex gap-1 flex-wrap">
                      {course.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="text-[rgba(132,111,160,1)] font-semibold text-[14px]"
                        >
                          {lang.toUpperCase()}
                          {index < course.languages!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-[#A9A6B4]">{t("course.languages_label")}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* მარჯვენა ნაწილი: ფასი, ღილაკი, რეკლამები */}
          <aside className="w-full md:w-[270px] flex flex-col gap-4 order-2 md:order-3 mb-4 md:mb-0">
            <div className="bg-white rounded-2xl shadow-[0_7px_32px_0_rgba(141,126,243,0.13)] p-4 flex flex-col gap-2 mb-2 md:mb-0">
              <div className="flex items-center text-[rgba(212,186,252,1)] font-bold text-[32px] leading-none">
                {formatPrice(course)}
              </div>
              <div className="text-[#A9A6B4] text-sm">{t("course.price_label")}</div>
            </div>
            {/* Purchase Button or Access Indicator */}
            {accessLoading ? (
              <div className="h-[48px] rounded-lg flex items-center justify-center px-5 py-3 bg-gray-200 mb-1 text-lg w-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
              </div>
            ) : hasAccess ? (
              <div className="bg-green-500 h-[48px] rounded-lg flex items-center justify-center px-5 py-3 font-bold text-white mb-1 text-lg w-full">
                <h2>{t("course.access_granted") || "✓ YOU HAVE ACCESS"}</h2>
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={handlePurchaseCourse}
                className="bg-[url('/assets/images/bluebg.jpg')] bg-cover bg-center h-[48px] rounded-lg flex items-center justify-center px-5 py-3 font-bold text-white duration-300 hover:text-[#8D7EF3] mb-1 text-lg cursor-pointer hover:bg-[#e2dbff] transition-colors w-full"
              >
                <h2>{t("course.purchase_course") || "PURCHASE COURSE"}</h2>
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-gray-500 h-[48px] rounded-lg flex items-center justify-center px-5 py-3 font-bold text-white duration-300 hover:bg-gray-600 mb-1 text-lg cursor-pointer transition-colors w-full"
              >
                <h2>{t("course.login_to_purchase") || "LOGIN TO PURCHASE"}</h2>
              </button>
            )}
            <div className="hidden md:flex flex-col gap-4">
              {course.advertisementImage ? (
                <>
                  <Image
                    src={course.advertisementImage}
                    alt="Course Advertisement"
                    className="w-full rounded-xl"
                    width={300}
                    height={600}
                  />
                  <Image
                    src={course.advertisementImage}
                    alt="Course Advertisement"
                    className="w-full rounded-xl"
                    width={300}
                    height={600}
                  />
                </>
              ) : (
                <>
                  <Image
                    src={rightCardImage}
                    alt="ad"
                    className="w-full rounded-xl"
                    width={300}
                    height={600}
                  />
                  <Image
                    src={rightCardImage}
                    alt="ad"
                    className="w-full rounded-xl"
                    width={300}
                    height={600}
                  />
                </>
              )}
            </div>
          </aside>

          {/* მთავარი ნაწილი */}
          <main className="flex-1 flex flex-col gap-6 order-3 md:order-2">
            <div className="bg-[rgba(233,223,246,1)] w-full p-4 py-5 rounded-[20px] flex flex-wrap md:gap-[30px] gap-2 items-center justify-between relative mb-4">
              {tabs.map((tab, idx) => (
                <div className="relative group flex-1 min-w-[90px]" key={idx}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`block w-full text-[rgba(132,111,160,1)] md:text-[16px] text-[14px] leading-[90%] md:leading-[120%] tracking-[0%] uppercase text-center transition group-hover:text-[rgba(61,51,74,1)] ${
                      activeTab === idx ? "text-[rgba(61,51,74,1)]" : ""
                    }`}
                  >
                    {tab}
                  </button>
                  <div
                    className={`absolute left-0 -bottom-[8px] h-[2px] w-full bg-[rgba(61,51,74,1)] transition-transform ${
                      activeTab === idx
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 order-4 md:order-2">
              {activeTab === 0 && (
                <div>
                  <article className="bg-white rounded-2xl shadow-[0_7px_32px_0_rgba(141,126,243,0.13)] px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
                    <h1 className="text-2xl font-bold uppercase text-[#302A3A]">
                      {pickLocalized(course.title, loc)}
                    </h1>

                    {/* Short Description */}
                    {pickLocalized(course.shortDescription, loc) && (
                      <div className="bg-[#F1EEFF] p-4 rounded-lg">
                        <h3 className="font-semibold text-[#8D7EF3] mb-2">
                          {t("course.short_description_title")}
                        </h3>
                        <div
                          className="text-[#8D7EF3]"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              pickLocalized(course.shortDescription, loc)
                            ),
                          }}
                        />
                      </div>
                    )}

                    {/* Main Description */}
                    {pickLocalized(course.description, loc) && (
                      <div
                        className="text-[#A9A6B4]"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(
                            pickLocalized(course.description, loc)
                          ),
                        }}
                      />
                    )}

                    {/* Prerequisites */}
                    {pickLocalized(course.prerequisites, loc) && (
                      <div className="bg-[#FFF9E6] p-4 rounded-lg">
                        <h3 className="font-semibold text-[#B8860B] mb-2">
                          {t("course.prerequisites_title")}
                        </h3>
                        <div
                          className="text-[#8B7355]"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              pickLocalized(course.prerequisites, loc)
                            ),
                          }}
                        />
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    {course.learningOutcomes &&
                      course.learningOutcomes.some((o) =>
                        pickLocalized(o, loc)
                      ) && (
                        <div>
                          <h3 className="font-semibold text-[#302A3A] mb-3">
                            {t("course.learning_outcomes_title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-2 text-[#A9A6B4]">
                            {course.learningOutcomes.map((outcome, index) => {
                              const html = pickLocalized(outcome, loc);
                              if (!html) return null;
                              return (
                                <li
                                  key={index}
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(html),
                                  }}
                                />
                              );
                            })}
                          </ul>
                        </div>
                      )}

                    {/* Languages */}
                    {course.languages && course.languages.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#302A3A]">
                          {t("course.languages_label")}:
                        </span>
                        <div className="flex gap-2">
                          {course.languages.map((lang, index) => (
                            <span
                              key={index}
                              className="bg-[#E1D7FA] text-[#8D7EF3] px-2 py-1 rounded text-sm"
                            >
                              {lang.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#302A3A]">
                          {t("course.tags_label")}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {course.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-[#F0F0F0] text-[#666] px-2 py-1 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>

                  {/* Related Courses Section */}
                  {relatedCourses.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between md:mb-[10px]">
                        <h2 className="text-2xl font-bold text-[#302A3A] mb-6">
                          {t("course.related_courses")}
                        </h2>
                        <SliderArrows
                          onScrollLeft={scrollLeft}
                          onScrollRight={scrollRight}
                        />
                      </div>

                      {relatedLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                        </div>
                      ) : (
                        <div
                          ref={sliderRef}
                          className="overflow-x-auto scrollbar-hide flex gap-4 mb-6"
                        >
                          <CourseSlider
                            courses={relatedCourses as unknown as any[]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 1 && course.syllabus && (
                <div>
                  <div className="flex flex-col gap-2">
                    {course.syllabus.map((item, index) => {
                      const titleHtml = pickLocalized(item.title, loc);
                      const descriptionHtml = pickLocalized(
                        item.description,
                        loc
                      );
                      const showTitle = !isEffectivelyEmptyRichText(titleHtml);
                      const showDescription =
                        !isEffectivelyEmptyRichText(descriptionHtml);
                      return (
                        <div
                          key={item._id ?? `syllabus-${index}`}
                          className="bg-white rounded-2xl px-6 py-4 font-bold text-[#302A3A] text-[15px] mb-2"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#8D7EF3]">
                              {t("course.lesson_label", {
                                number: String(index + 1),
                              })}
                            </span>
                            {item.duration > 0 && (
                              <span className="text-[#A9A6B4] text-sm font-normal">
                                {item.duration} {t("course.minutes_short")}
                              </span>
                            )}
                          </div>
                          {showTitle && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(titleHtml),
                              }}
                            />
                          )}
                          {showDescription && (
                            <div
                              className="font-normal mt-2 text-[#A9A6B4]"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(descriptionHtml),
                              }}
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Total Duration */}
                    <div className="bg-[#F1EEFF] rounded-2xl px-6 py-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8D7EF3]">
                          {t("course.total_duration")}:
                        </span>
                        <span className="text-[#8D7EF3] font-semibold">
                          {t("course.duration_minutes", { 
                            duration: course.syllabus.reduce(
                              (total, item) => total + (item.duration || 0),
                              0
                            ).toString()
                          })}
                        </span>
                      </div>
                      <div className="text-[#A9A6B4] text-sm mt-1">
                        {course.syllabus.length} {t("common.lessons", { count: course.syllabus.length.toString() })}
                      </div>
                    </div>
                  </div>

                  {/* Related Courses Section */}
                  {relatedCourses.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between md:mb-[10px]">
                        <h2 className="text-2xl font-bold text-[#302A3A] mb-6">
                          {t("course.related_courses")}
                        </h2>
                        <SliderArrows
                          onScrollLeft={scrollLeft}
                          onScrollRight={scrollRight}
                        />
                      </div>

                      {relatedLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                        </div>
                      ) : (
                        <div
                          ref={sliderRef}
                          className="overflow-x-auto scrollbar-hide flex gap-4 mb-6"
                        >
                          <CourseSlider
                            courses={relatedCourses as unknown as any[]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 2 && course.announcements && (
                <div>
                  <div className="flex flex-col gap-2">
                    {course.announcements
                      .filter((announcement) => announcement.isActive)
                      .map((announcement, index) => (
                        <div
                          key={index}
                          className="bg-[#F1EEFF] rounded-2xl px-6 py-4 text-[#8D7EF3] text-[15px] mb-2"
                        >
                          <h3
                            className="font-bold mb-2"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(
                                pickLocalized(announcement.title, loc)
                              ),
                            }}
                          />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(
                                pickLocalized(announcement.content, loc)
                              ),
                            }}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Related Courses Section */}
                  {relatedCourses.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between md:mb-[10px]">
                        <h2 className="text-2xl font-bold text-[#302A3A] mb-6">
                          {t("course.related_courses")}
                        </h2>
                        <SliderArrows
                          onScrollLeft={scrollLeft}
                          onScrollRight={scrollRight}
                        />
                      </div>

                      {relatedLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                        </div>
                      ) : (
                        <div
                          ref={sliderRef}
                          className="overflow-x-auto scrollbar-hide flex gap-4 mb-6"
                        >
                          <CourseSlider
                            courses={relatedCourses as unknown as any[]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <div className="bg-white rounded-2xl px-6 py-4 flex flex-col gap-2">
                    <div className="font-bold text-[#302A3A] text-[15px] mb-4">
                      {t("course.reviews_section_title")}
                    </div>
                    <div className="text-[#A9A6B4]">
                      {t("course.no_reviews_yet")}
                    </div>
                  </div>

                  {/* Related Courses Section */}
                  {relatedCourses.length > 0 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between md:mb-[10px]">
                        <h2 className="text-2xl font-bold text-[#302A3A] mb-6">
                          {t("course.related_courses")}
                        </h2>
                        <SliderArrows
                          onScrollLeft={scrollLeft}
                          onScrollRight={scrollRight}
                        />
                      </div>

                      {relatedLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                        </div>
                      ) : (
                        <div
                          ref={sliderRef}
                          className="overflow-x-auto scrollbar-hide flex gap-4 mb-6"
                        >
                          <CourseSlider
                            courses={relatedCourses as unknown as any[]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
