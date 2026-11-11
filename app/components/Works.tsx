"use client";

import React from "react";
import Link from "next/link";
import WorksSlider from "./WorksSlider";
import { useI18n } from "../context/I18nContext";
import type { Set } from "../types/category";

interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
  _id: string;
}

interface BackendExercise {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  recommendations: LocalizedString;
  videoUrl: string;
  thumbnailUrl: string;
  videoDuration: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  repetitions: string;
  sets: string;
  restTime: string;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  setId: string;
  categoryId: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // populated relations
  set?: {
    _id: string;
    name: LocalizedString;
    description: LocalizedString;
  };
  category?: {
    _id: string;
    name: LocalizedString;
  };
  subcategory?: {
    _id: string;
    name: LocalizedString;
  } | null;
}

interface WorksProps {
  title: string;
  items?: Set[];
  exercises?: BackendExercise[];
  sets?: Set[];
  linkHref?: string;
  linkText?: string;
  fromMain?: boolean;
  border?: number;
  borderColor?: string;
  customMargin: string;
  customBorderRadius: string;
  seeAll: boolean;
  scrollable: boolean;
  sliderId?: string;
  totalCount?: number; // Total count for dynamic display
  showTopLink?: boolean; // Show "View All" link at top
}

const Works: React.FC<WorksProps> = ({
  title,
  items = [],
  exercises = [],
  sets = [],
  linkHref = "/allComplex",
  linkText = "All exercises",
  fromMain = false,
  border,
  borderColor,
  customMargin,
  customBorderRadius,
  seeAll = true,
  scrollable = true,
  sliderId,
  totalCount,
  showTopLink = false,
}) => {
  const { t, locale } = useI18n();

  // Helper to get localized string from object or string
  const getLocalized = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (
      value &&
      typeof value === "object" &&
      locale in value &&
      typeof (value as Record<string, unknown>)[locale] === "string"
    ) {
      return (value as Record<string, string>)[locale];
    }
    return "";
  };

  // Helper to get localized text from BackendExercise LocalizedString
  const getLocalizedFromExercise = (
    localizedString: LocalizedString
  ): string => {
    return (
      localizedString[locale as keyof LocalizedString] ||
      localizedString.en ||
      ""
    );
  };

  // Helper function to get valid thumbnail URL
  const getValidThumbnailUrl = (url: string | undefined): string => {
    if (!url) {
      return "/assets/images/workMan.png";
    }

    if (url.startsWith("data:image")) {
      return url;
    }

    if (url.startsWith("http") || url.startsWith("/")) {
      return url;
    }

    return "/assets/images/workMan.png";
  };

  interface WorkItem {
    id: string;
    title: string;
    description: string;
    image: string;
    exerciseCount: number;
    categoryName: string;
    monthlyPrice: number;
    difficulty?: string;
    duration?: string;
    videoUrl?: string;
    categoryId: string;
    subcategoryId?: string;
  }

  let works: WorkItem[] = [];

  // Helper function to deduplicate items by ID
  const deduplicateById = (items: WorkItem[]): WorkItem[] => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  if (exercises.length > 0) {
    works = exercises.map((exercise) => {
      const result = {
        id: exercise._id,
        title: getLocalizedFromExercise(exercise.name),
        description: getLocalizedFromExercise(exercise.description),
        image: getValidThumbnailUrl(exercise.thumbnailUrl),
        exerciseCount: 1,
        categoryName: exercise.category
          ? getLocalizedFromExercise(exercise.category.name)
          : (t("common.orthopedics") || "Orthopedics"),
        monthlyPrice: 920,
        difficulty: exercise.difficulty,
        duration: exercise.duration,
        videoUrl: exercise.videoUrl,
        categoryId: exercise.categoryId || "",
        subcategoryId: exercise.subCategoryId,
      };
      return result;
    });
  } else if (items.length > 0) {
    works = deduplicateById(items.map((set) => ({
      id: set._id,
      title: getLocalized(set.name),
      description: getLocalized(set.description),
      image: "/assets/images/workMan.png",
      exerciseCount: Array.isArray(set.exercises) ? set.exercises.length : 0,
      categoryName:
        (set.category && getLocalized(set.category.name)) || (t("common.orthopedics") || "Orthopedics"),
      monthlyPrice: set.price.monthly || 920,
      categoryId: set.categoryId || "",
    })));
  } else if (sets.length > 0) {
    works = deduplicateById(sets.map((set) => ({
      id: set._id,
      title: getLocalized(set.name),
      description: getLocalized(set.description),
      image: set.thumbnailImage || "/assets/images/workMan.png",
      exerciseCount: Array.isArray(set.exercises) ? set.exercises.length : set.totalExercises || 0,
      categoryName:
        (set.category && getLocalized(set.category.name)) || (t("common.orthopedics") || "Orthopedics"),
      monthlyPrice: (set.price && set.price.monthly) || 920,
      categoryId: set.categoryId || "",
      subcategoryId: set.subCategoryId,
    })));
  } else {
    console.log("⚠️ No exercises, items, or sets to process!");
  }

  return (
    <div
      style={{ border: `${border}px solid ${borderColor}`, marginInline: `${customMargin}`, borderRadius: `${customBorderRadius}` }}
      className="bg-[#F9F7FE] mx-6 rounded-[30px] md:mt-0 md:pt-6 mt-10 md:mb-10 mb-0 rounded-b-[15px] md:pb-10 pb-0"
    >
      {/* Slider */}
      <WorksSlider 
        scrollable={scrollable} 
        seeAll={seeAll} 
        title={title} 
        works={works} 
        fromMain={fromMain} 
        sliderId={sliderId}
        seeAllHref={linkHref}
        showTopLink={showTopLink}
      />
      
      {/* ✅ ქვედა ლინკი - Hide when showTopLink is true */}
      {seeAll && !showTopLink && (
        <div className="px-6 md:px-12 pb-8 md:pb-10">
          <Link
            href={linkHref}
            className="text-[20px] md:text-[32px] font-medium leading-[110%] uppercase text-[#D4BAFC] hover:text-[#C4A6F1] transition-colors inline-block"
          >
            {typeof t("works.all_sets", { count: (totalCount || works.length).toString() }) === "string"
              ? t("works.all_sets", { count: (totalCount || works.length).toString() })
              : `${linkText} →`}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Works;