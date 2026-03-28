"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";
import type { Set } from "../types/category";

interface OrthopedicsGridProps {
  sets: Set[];
  title: string;
}

const OrthopedicsGrid: React.FC<OrthopedicsGridProps> = ({ sets, title }) => {
  const { locale, t } = useI18n();
  const [visibleCount, setVisibleCount] = useState(8);

  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined
  ): string => {
    if (!field) return "";
    return (
      field[locale as keyof typeof field] ||
      field.ru ||
      field.en ||
      field.ka ||
      ""
    );
  };

  const showMoreText = {
    ka: "მეტის ჩვენება",
    en: "Show More",
    ru: "ПОКАЗАТЬ ЕЩЁ",
  };

  const visibleSets = sets.slice(0, visibleCount);
  const hasMore = visibleCount < sets.length;

  return (
    <div className="bg-white mx-6 rounded-[30px] px-6 md:px-10 py-8 md:py-12 mb-10">
      {/* Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {visibleSets.map((set) => {
          const categoryName = set.category
            ? getLocalizedText(set.category.name)
            : title;
          const setName = getLocalizedText(set.name);
          const monthlyPrice = set.price?.monthly || 920;
          const duration = set.totalDuration || t("header.duration_minutes", { duration: "42" }) || "42 мин.";

          return (
            <Link
              key={set._id}
              href={`/complex/${set._id}`}
              className="bg-white rounded-[20px] overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col border border-gray-100"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-purple-200 to-purple-300">
                <img
                  src={set.thumbnailImage || "/assets/images/workMan.png"}
                  alt={setName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col">
                {/* Category Badge */}
                <div className="mb-2">
                  <span className="inline-block px-3 py-2 bg-[#E9DFF6] rounded-[6px] font-bowler text-[#3D334A] text-[14px] uppercase font-medium">
                    {categoryName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-normal text-[#3D334A] text-[14px] md:text-[16px] leading-[120%] mb-3 line-clamp-3 min-h-[50px]">
                  {setName}
                </h3>

                {/* Footer with duration and price */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  {/* Duration */}
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="#D4BAFC" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 11" stroke="#D4BAFC" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[#846FA0] text-[12px]">{duration}</span>
                  </div>

                  {/* Price Button */}
                  <button className="bg-[#D4BAFC] hover:bg-[#C4A6F1] text-white font-bowler text-[12px] md:text-[14px] px-3 md:px-4 py-1.5 md:py-2 rounded-[8px] transition-colors whitespace-nowrap">
                    {monthlyPrice} ₾/{locale === "ka" ? "თვე" : locale === "en" ? "month" : "мес"}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8 md:mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="bg-[#D4BAFC] hover:bg-[#C4A6F1] text-white font-bowler text-[16px] md:text-[20px] uppercase px-16 md:px-24 py-3 md:py-4 rounded-[15px] transition-colors"
          >
            {showMoreText[locale as keyof typeof showMoreText] || showMoreText.ru}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrthopedicsGrid;
