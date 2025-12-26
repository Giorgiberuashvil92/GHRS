import React, { useRef } from "react";
import Link from "next/link";
import SliderArrows from "./SliderArrows";
import { FaArrowRightLong } from "react-icons/fa6";
import CustomBadge from "./CustomBadge";
import { useI18n } from "../context/I18nContext";

interface Subcategory {
  _id: string;
  name: {
    ka: string;
    en: string;
    ru: string;
  };
  description?: {
    ka: string;
    en: string;
    ru: string;
  };
  image?: string;
  sets?: any[];
  categoryId?: string;
  parentId?: {
    _id: string;
    name: {
      ka: string;
      en: string;
      ru: string;
    };
  };
  category?: {
    _id: string;
    name: {
      ka: string;
      en: string;
      ru: string;
    };
  };
}

interface Category {
  _id: string;
  name: {
    ka: string;
    en: string;
    ru: string;
  };
  subcategories?: string[];
}

const Section = ({
  border = 0,
  borderColor = "transparent",
  subcategories = [],
  categories = [],
}: {
  border?: number;
  borderColor?: string;
  subcategories?: Subcategory[];
  categories?: Category[];
}) => {
  const scrollRef = useRef(null);
  const { locale, t } = useI18n();
  const getLocalizedText = (field: { ka: string; en: string; ru: string } | undefined): string => {
    if (!field) return "";
    return field[locale as keyof typeof field] || field.ru || field.en || field.ka || "";
  };

  const scrollLeft = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: -586,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: 586,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      style={{ border: `${border}px solid ${borderColor}` }}
      className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] mx-6 md:mb-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="text-[48px] md:text-[64px] text-[#3D334A] leading-[100%] tracking-[-1%] font-bold font-bowler uppercase">
            {t("common.popular_sections_title") || "Популярные разделы"}
          </h1>
          <Link href="/subcategories" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="font-bowler text-[#D4BAFC] text-[24px] leading-[90%] mr-2">
              {t("buttons.show_all") || "Смотреть все"}
            </span>
            <FaArrowRightLong color="#D4BAFC"/>
          </Link>
        </div>
        <div>
          <SliderArrows
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
          />
        </div>
      </div>

      {/* Slider container */}
      <div 
        ref={scrollRef}
        className="flex flex-row items-center gap-7 overflow-x-auto scrollbar-hide mt-12 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {subcategories.map((subcat) => {
          // Get parent category from populated parentId or find it in categories array
          const parentCategory = subcat.parentId || categories.find(cat => 
            cat.subcategories?.includes(subcat._id)
          );
          const categoryId = subcat.parentId?._id || subcat.categoryId || subcat.category?._id || parentCategory?._id;
          const categoryName = subcat.parentId?.name
            ? getLocalizedText(subcat.parentId.name)
            : subcat.category?.name 
            ? getLocalizedText(subcat.category.name) 
            : parentCategory?.name 
            ? getLocalizedText(parentCategory.name)
            : (t("common.orthopedics") || "Ортопедия");
          
          const setsCount = Array.isArray(subcat.sets) ? subcat.sets.length : 0;
          const complexText = locale === 'ka' ? 'კომპლექსი' : locale === 'en' ? 'complexes' : 'комплексов';
          
          return (
          <Link
            key={subcat._id}
            href={`/categories/${subcat._id}`}
            className="min-w-[558px] h-[283px] relative bg-white p-2 rounded-5 hover:shadow-lg transition-all cursor-pointer my-2 block"
          >
            <div className="absolute top-4 left-4 z-10 bg-[#E9DFF6] px-3 py-1 rounded-md">
              <span className="font-bowler text-[#3D334A] text-[14px] uppercase">
                {categoryName}
              </span>
            </div>
            <img
              src={subcat.image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=542&h=181&fit=crop&crop=center"}
              width={542}
              height={181}
              alt={`subcategory-${subcat._id}`}
              className="w-full h-[181px] object-cover rounded-4"
            />
            <div className="flex items-center justify-between mt-[22px] px-2">
              <h1 className="font-bowler text-[#3D334A] text-[22px] leading-[120%] break-words flex-1 pr-4">
                {getLocalizedText(subcat.name)}
              </h1>
              <span className="font-bowler text-[#D4BAFC] text-[18px] leading-[120%] whitespace-nowrap">
                {setsCount} {complexText}
              </span>
            </div>
          </Link>
          );
        })}
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

export default Section;