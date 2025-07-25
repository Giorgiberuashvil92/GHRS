"use client";

import React from "react";
import Link from "next/link";
import WorksSlider from "./WorksSlider";
import { useI18n } from "../context/I18nContext";
import { Set } from "../types/category";

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
}

const Works: React.FC<WorksProps> = ({
  title,
  items = [],
  exercises = [],
  sets = [],
  linkHref = "/exercises",
  linkText = "All exercises",
  fromMain = false, // Default value დამატებული
  border,
  borderColor,
}) => {
  const { t, locale } = useI18n();

  console.log("🎯 Works component data:", {
    title,
    itemsCount: items.length,
    exercisesCount: exercises.length,
    setsCount: sets.length,
    fromMain,
  });

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
      localizedString.ru ||
      localizedString.en ||
      localizedString.ka ||
      ""
    );
  };

  // Helper function to get valid thumbnail URL
  const getValidThumbnailUrl = (url: string | undefined): string => {
    console.log("🖼️ getValidThumbnailUrl input:", url);

    // თუ URL არ არის, ვიყენებთ default-ს
    if (!url) {
      console.log("🖼️ No URL provided, using default");
      return "/assets/images/workMan.png";
    }

    // base64 images-ის support
    if (url.startsWith("data:image")) {
      console.log("🖼️ Base64 image detected, using it");
      return url; // base64 image-ს ვიყენებთ
    }

    // თუ ვალიდური URL-ია
    if (url.startsWith("http") || url.startsWith("/")) {
      console.log("🖼️ Valid URL detected:", url);
      return url;
    }

    // სხვა შემთხვევაში default
    console.log("🖼️ Invalid URL, using default");
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
    subcategoryId?: string; // ქვე-კატეგორიის ID დამატებული
  }

  let works: WorkItem[] = [];

  // If exercises are provided, transform them for WorksSlider
  if (exercises.length > 0) {
    works = exercises.map((exercise) => {
      const result = {
        id: exercise._id,
        title: getLocalizedFromExercise(exercise.name),
        description: getLocalizedFromExercise(exercise.description),
        image: getValidThumbnailUrl(exercise.thumbnailUrl),
        exerciseCount: 1, // Single exercise
        categoryName: exercise.category
          ? getLocalizedFromExercise(exercise.category.name)
          : "ორთოპედია",
        monthlyPrice: 920, // Default price
        difficulty: exercise.difficulty,
        duration: exercise.duration,
        videoUrl: exercise.videoUrl,
        categoryId: exercise.categoryId || "",
        subcategoryId: exercise.subCategoryId,
      };
      return result;
    });
  } else if (items.length > 0) {
    // Transform sets to work with existing WorksSlider component
    works = items.map((set) => ({
      id: set._id,
      title: getLocalized(set.name),
      description: getLocalized(set.description),
      image: "/assets/images/workMan.png", // Default image
      exerciseCount: Array.isArray(set.exercises) ? set.exercises.length : 0,
      categoryName: "ორთოპედია", // Default
      monthlyPrice: set.price.monthly || 920, // Default price
      categoryId: set.categoryId || "",
    }));
  } else if (sets.length > 0) {
    console.log("🎯 Processing sets data:", sets);
    works = sets.map((set) => {
      console.log("🎯 Processing set:", {
        id: set._id,
        categoryId: set.categoryId,
        name: set.name,
        thumbnailImage: set.thumbnailImage,
      });

      return {
        id: set._id,
        title: getLocalized(set.name),
        description: getLocalized(set.description),
        image: getValidThumbnailUrl(set.thumbnailImage),
        exerciseCount: set.totalExercises,
        categoryName: "Default Category", // ეს უნდა გადაკეთდეს category name-ით
        monthlyPrice: set.price.monthly,
        categoryId: set.categoryId || "",
        subcategoryId: set.subCategoryId,
      };
    });
  } else {
    console.log("⚠️ No exercises, items, or sets to process!");
  }

  console.log("🎯 Final works data:", works);

  return (
    <div
      style={{ border: `${border}px solid ${borderColor}` }}
      className="bg-[#F9F7FE] md:mt-0 mt-10 md:mb-10 mb-0 md:mx-5 rounded-b-[15px] md:pb-10 pb-0"
    >
      {/* Slider */}
      <WorksSlider title={title} works={works} fromMain={fromMain} />
      <Link
        href={linkHref}
        className="text-[14px]  px-5 md:px-0 md:text-[24px] leading-[90%] uppercase text-[#D4BAFC]"
      >
        <span className="px-5">
          {" "}
          {typeof t("works.all_sets", { count: works.length.toString() }) ===
          "string"
            ? t("works.all_sets", { count: works.length.toString() })
            : linkText}
        </span>
      </Link>
    </div>
  );
};

export default Works;
