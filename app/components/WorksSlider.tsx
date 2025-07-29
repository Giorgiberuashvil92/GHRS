/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import SliderArrows from "./SliderArrows";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";

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
  linkType?: 'sets' | 'complex' | 'section'; // დინამიური ლინკის ტიპი
  categoryData?: any;
  fromMain: boolean
  seeAll: boolean
  scrollable: boolean,
}

const WorksSlider: React.FC<WorksSliderProps> = ({
  title,
  works,
  linkType = 'sets', // default არის sets
  fromMain,
  seeAll = true,
  scrollable = true
}) => {
  const { t } = useI18n();

  const scroll = (direction: "left" | "right") => {
    const slider = document.getElementById("works-slider");
    if (slider) {
      const scrollAmount = direction === "left" ? -500 : 500;
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    } else {
      console.error("❌ Slider element not found!");
    }
  };

  return (
    <div className="md:px-5 px-2 py-2 bg-[#F9F7FE] md:mx-5 md:rounded-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
        <h2 className="text-[20px] md:py-4 md:text-[40px] text-[#3D334A] mb-2.5 md:mb-5">
          {title}
        </h2>
       {seeAll && (
         <span className="text-[#D4BAFC] text-[24px] md:mb-10 leading-[90%] uppercase cursor-pointer hover:text-[#B69EE8] transition-colors">
          {t("common.see_all")} →
         </span>
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
        id="works-slider"
        className="overflow-x-auto overflow-y-hidden scrollbar-hide mb-10 py-4"
      >
        <div className="flex gap-4">
          {works.map((work) => (
            <Link
              key={work.id}
              href={
                fromMain
                  ? `/complex/${work.id}?categoryId=${work.categoryId}`
                  : linkType === 'complex'
                  ? `/complex/${work.id}`
                  : linkType === 'section'
                  ? `/categories/section?categoryId=${work.categoryId || ''}&subcategoryId=${work.subcategoryId || ''}`
                  : `/sets/${work.id}`
              }
              className="bg-white  w-[400px] h-[493px] flex-shrink-0 rounded-[20px] hover:shadow-lg transition-shadow flex flex-col"
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
                  <span className="p-3 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[14px] font-bold leading-[90%] uppercase truncate max-w-[120px]">
                    {work.categoryName}
                  </span>
                </div>
                <p className="line-clamp-4 font-[Pt] text-[#3D334A] leading-[120%] text-lg font-black  mx-4">
                  {work.description}  
                </p>
              </div>
              <div className="flex items-center justify-end">
                <span className="px-5 py-3 bg-[#D4BAFC] rounded-lg text-white text-[18px] leading-[100%] font-bold mb-8 mr-8">
                  {work.monthlyPrice}₾/{t("common.month")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorksSlider;
