import React, { useRef } from "react";
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
}

const Section = ({
  border = 0,
  borderColor = "transparent",
  subcategories = [],
}: {
  border?: number;
  borderColor?: string;
  subcategories?: Subcategory[];
}) => {
  const scrollRef = useRef(null);
  const { locale } = useI18n();
  console.log(subcategories, "skip data");
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
          <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%] font-bold">
            Разделы
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase mr-2">
              Смотреть все
            </span>
            <FaArrowRightLong color="#D4BAFC"/>
          </div>
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
        className="flex flex-row items-center gap-[28px] overflow-x-auto scrollbar-hide mt-[48px] scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {subcategories.map((subcat) => (
          <div
            key={subcat._id}
            className="min-w-[558px] h-[283px] relative bg-white p-2 rounded-[20px] hover:shadow-md transition-shadow cursor-pointer my-2"
          >
            <div className="absolute top-1 z-10">
              <CustomBadge text={getLocalizedText(subcat.name)} margin="m-3" />
            </div>
            <img
              src={subcat.image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=542&h=181&fit=crop&crop=center"}
              width={542}
              height={181}
              alt={`subcategory-${subcat._id}`}
              className="w-full h-[181px] object-cover rounded-[16px]"
            />
            <div className="flex items-end justify-between mt-[22px] relative">
              <h1 className="text-[#3D334A] w-[342px] text-[22px] leading-[120%] font-semibold break-words truncate">
                {getLocalizedText(subcat.description)}
              </h1>
              <span className="text-[#D4BAFC] absolute -bottom-0 right-0 leading-[120%] font-medium">
                {subcat.sets?.length || 0} комплексов
              </span>
            </div>
          </div>
        ))}
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