"use client";
import React from "react";
import MainHeader from "../components/Header/MainHeader";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Blog from "../components/Blog";
import { FaBook, FaDumbbell, FaClock } from "react-icons/fa";
import { useI18n } from "../context/I18nContext";
import useStatistics from "../hooks/useStatistics";
import { useAllSets } from "../hooks/useSets";

const Chapter = () => {
  const { t, locale } = useI18n();
  const { statistics } = useStatistics();
  const { sets, loading } = useAllSets();

  // Helper to get localized text
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

  // Transform sets to WorksSlider format
  const chapterSliderInfo = sets.slice(0, 4).map((set) => ({
    id: set._id,
    title: getLocalized(set.name),
    description: getLocalized(set.description),
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.totalExercises || 0,
    categoryName: (set.category && getLocalized(set.category.name)) || "Category",
    monthlyPrice: set.price?.monthly || 920,
    categoryId: set.categoryId,
  }));

    const statsData = [
      {
      icon: <FaBook size={24} />,
      value: statistics?.total?.sets || 0,
      label: t("header.sets_count", { count: String(statistics?.total?.sets || 0) }).replace(/\d+\s*/, ""),
    },
    {
      icon: <FaDumbbell size={24} />,
      value: statistics?.total?.exercises || 0,
      label: t("header.exercises_count", { count: String(statistics?.total?.exercises || 0) }).replace(/\d+\s*/, ""),
    },
    {
      icon: <FaClock size={24} />,
      value: statistics?.total?.hours || 0,
      label: t("header.hours_count", { count: String(statistics?.total?.hours || 0) }).replace(/\d+\s*/, ""),
    },
  ];

  return (
    <div>
      <MainHeader
        ShowBlock={true}
        OptionalComponent={null}
        stats={statsData as never[]}
        showArrows={true}
      />
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mt-4 px-6">
            <WorksSlider 
              title={t("chapter.popular_exercises") || "Popular Exercises"}
              works={chapterSliderInfo} 
              fromMain={false} 
              seeAll={false} 
              scrollable={false} 
            />
          </div>
          <div className="mt-10 px-6">
            <WorksSlider
              title={t("chapter.more_exercises") || "More Exercises"}
              works={chapterSliderInfo}
              fromMain={false} 
              seeAll={false} 
              scrollable={false}
            />
          </div>
          <Subscribe />
          <ReviewSlider title="" />
          <Blog
            withBanner={false}
            withSlider={true}
            layoutType="default"
            title={""}
          />
        </>
      )}
    </div>
  );
};

export default Chapter; 