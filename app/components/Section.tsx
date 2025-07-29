import React from "react";
import Image from "next/image";
import SliderArrows from "./SliderArrows";
import { FaArrowRightLong } from "react-icons/fa6";

const Section = ({
  border = 0,
  borderColor = "transparent",
}: {
  border?: number;
  borderColor?: string;
}) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: -586, // width of card + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: 586, // width of card + gap
        behavior: 'smooth'
      });
    }
  };

  // Sample data for cards
  const cardData = [
    {
      id: 1,
      category: "Ортопедия",
      title: "Шейный отдел позвоночника",
      complexCount: "12 комплексов",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 2,
      category: "Ортопедия",
      title: "Поясничный отдел",
      complexCount: "8 комплексов",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 3,
      category: "Кардиология",
      title: "Сердечно-сосудистая система",
      complexCount: "15 комплексов",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 4,
      category: "Неврология",
      title: "Центральная нервная система",
      complexCount: "10 комплексов",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 5,
      category: "Ортопедия",
      title: "Коленные суставы",
      complexCount: "6 комплексов",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=542&h=181&fit=crop&crop=center"
    }
  ];

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
            {/* <span className="text-[#D4BAFC] text-[24px] leading-[90%]">→</span> */}
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
        {cardData.map((card) => (
          <div
            key={card.id}
            className="min-w-[558px] h-[283px] relative bg-white p-2 rounded-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="absolute top-1 z-10">
              <CustomBadge text={card.category} margin="m-3" />
            </div>
            <img
              src={card.image}
              width={542}
              height={181}
              alt={`category-${card.id}`}
              className="w-full h-[181px] object-cover rounded-[16px]"
            />
            <div className="flex items-end justify-between mt-[22px] relative">
              <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%] font-semibold">
                {card.title}
              </h1>
              <span className="text-[#D4BAFC] absolute -bottom-0 right-0 leading-[120%] font-medium">
                {card.complexCount}
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