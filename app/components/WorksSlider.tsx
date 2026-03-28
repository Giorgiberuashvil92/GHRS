/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import SliderArrows from "./SliderArrows";
import Link from "next/link";
import { useI18n, useLanguage } from "../context/I18nContext";

interface WorkItem {
  id: string;
  title: string;
  description: string;
  image: string;
  exerciseCount: number;
  categoryName: string;
  monthlyPrice: number;
  subcategoryId?: string;
  categoryId: string;
}

interface WorksSliderProps {
  title?: string;
  works: WorkItem[];
  linkType?: "sets" | "complex" | "section";
  categoryData?: any;
  fromMain: boolean;
  seeAll: boolean;
  scrollable: boolean;
  sliderId?: string;
  seeAllHref?: string;
  showTopLink?: boolean; // Control top "View all" link visibility
}

const WorksSlider: React.FC<WorksSliderProps> = ({
  title,
  works,
  linkType = "sets",
  fromMain,
  seeAll = true,
  scrollable = true,
  sliderId,
  seeAllHref = "/allComplex",
  showTopLink = true, // Default to true for backward compatibility
}) => {
  const { t } = useI18n();
  const { language } = useLanguage();

  const uniqueSliderId = sliderId || `works-slider-${Math.random().toString(36).substr(2, 9)}`;

  // Helper function to remove "consists of X exercises" text from description
  const cleanDescription = (description: string): string => {
    if (!description) return "";
    // Remove patterns like "The set consists of X exercises" in any language
    return description
      .replace(/The (set|complex) consists of \d+ exercises?\.?/gi, "")
      .replace(/Набор состоит из \d+ упражнени[йя]\.?/gi, "")
      .replace(/Комплекс состоит из \d+ упражнени[йя]\.?/gi, "")
      .replace(/სეტი შედგება \d+ ვარჯიშისგან\.?/gi, "")
      .replace(/კომპლექსი შედგება \d+ ვარჯიშისგან\.?/gi, "")
      .trim();
  };

  const scroll = (direction: "left" | "right") => {
    const slider = document.getElementById(uniqueSliderId);
    if (slider) {
      const scrollAmount = direction === "left" ? -500 : 500;
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    } else {
      console.error(`❌ Slider element not found with ID: ${uniqueSliderId}`);
    }
  };

  return (
    <div className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] mx-6 md:mb-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <h2 className="text-[48px] md:text-[64px] text-[#3D334A] leading-[100%] tracking-[-1%] font-bold font-bowler uppercase">
            {title}
          </h2>
          {seeAll && showTopLink && (
            <Link href={seeAllHref} className="hover:opacity-80 transition-opacity cursor-pointer">
              <span className="font-bowler text-[#D4BAFC] text-[20px] md:text-[24px] leading-[90%] uppercase">
                {t("buttons.show_all") || "Смотреть все"} →
              </span>
            </Link>
          )}
        </div>
        {scrollable && (
          <SliderArrows
            onScrollLeft={() => scroll("left")}
            onScrollRight={() => scroll("right")}
          />
        )}
      </div>

      <div
        id={uniqueSliderId}
        className="flex flex-row items-center gap-7 overflow-x-auto scrollbar-hide mt-12 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          display: 'flex',
          flexWrap: 'nowrap',
        }}
      >
        <div className="flex flex-row gap-4" style={{ display: 'flex', flexWrap: 'nowrap' }}>
          {works.map((work) => (
            <Link
              key={work.id}
              href={
                fromMain
                  ? `/complex/${work.id}?categoryId=${work.categoryId}`
                  : linkType === "complex"
                  ? `/complex/${work.id}`
                  : linkType === "section"
                  ? `/categories/section?categoryId=${
                      work.categoryId || ""
                    }&subcategoryId=${work.subcategoryId || ""}`
                  : `/complex/${work.id}`
              }
              className="bg-white relative w-[400px] min-h-[493px] flex-shrink-0 rounded-[20px] hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex-grow">
                <Image
                  src={work.image}
                  width={319}
                  height={250}
                  alt={work.title}
                  className="w-full h-[250px] object-cover rounded-2xl mb-6"
                />
                <div className="mb-2.5 mx-4">
                  <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[14px] font-medium leading-[110%] uppercase max-w-full font-bowler break-words">
                    {work.categoryName.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-[#3D334A] font-bold text-[18px] leading-[120%] mx-4 font-pt">
                  {work.title}
                </h3>
                <p className="text-[#000] leading-[120%] text-sm mx-4 font-pt font-normal mb-4">
                  {cleanDescription(work.description)}
                </p>
              </div>
              <div className="flex items-center justify-end absolute -bottom-2 right-0">
                <span className="px-5 py-3 bg-[#D4BAFC] rounded-lg text-white text-[18px] leading-[100%] font-bold mb-8 mr-8 mt-6 font-pt">
                  {work.monthlyPrice}
                  {language === "ka" ? "₾" : language === "ru" ? "₽" : "$"}/
                  {t("common.month")}
                </span>
              </div>
            </Link>
          ))}
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

export default WorksSlider;