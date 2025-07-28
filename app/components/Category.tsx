"use client";

import Link from "next/link";
import React, { useRef } from "react";
import CategorySlider from "./CategorySlider";
import SliderArrows from "./SliderArrows";
import { useI18n } from "../context/I18nContext";

const Category = ({ bgColor }: { bgColor: string }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="bg-[#F9F7FE] md:mx-5 md:px-10 px-4 md:pb-10"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] mt-5 md:text-[40px] pt-10 text-[#3D334A] md:mb-5">
          {typeof t("category.title") === "string"
            ? t("category.title")
            : "Categories"}
        </h1>
        <SliderArrows onScrollLeft={scrollLeft} onScrollRight={scrollRight} />
      </div>

      <Link
        href="/categories"
        className="text-[14px] md:text-[24px] uppercase text-[#D4BAFC] hover:text-[#734ea4] transition-colors duration-300"
      >
        {typeof t("category.view_all") === "string"
          ? t("category.view_all")
          : "View all"}
      </Link>

      <CategorySlider ref={sliderRef} />
    </div>
  );
};

export default Category;
