"use client";
import React, { useRef, useState, useEffect } from "react";

// SliderArrows component with working functionality
type SliderArrowsProps = {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
};

const SliderArrows: React.FC<SliderArrowsProps> = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft = true,
  canScrollRight = true,
}) => {
  return (
    <div className="items-center flex gap-2">
      <div
        onClick={canScrollLeft ? onScrollLeft : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer transition-colors ${
          canScrollLeft
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <svg
          width={11}
          height={19}
          viewBox="0 0 11 19"
          fill="none"
          className={!canScrollLeft ? "opacity-50" : ""}
        >
          <path
            d="M9.5 1.5L2 9.5L9.5 17.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        onClick={canScrollRight ? onScrollRight : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer transition-colors ${
          canScrollRight
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <svg
          width={11}
          height={19}
          viewBox="0 0 11 19"
          fill="none"
          className={!canScrollRight ? "opacity-50" : ""}
        >
          <path
            d="M1.5 1.5L9 9.5L1.5 17.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const reviewSliderItems = [
  {
    id: 1,
    image: "/assets/images/reviewSliderImages/image2.png",
    name: "Алексей",
  },
  {
    id: 2,
    image: "/assets/images/reviewSliderImages/image3.png",
    name: "Владислава",
  },
  {
    id: 3,
    image: "/assets/images/reviewSliderImages/image4.png",
    name: "Александра",
  },
  {
    id: 4,
    image: "/assets/images/reviewSliderImages/image5.png",
    name: "Владислава",
  },
  {
    id: 5,
    image: "/assets/images/reviewSliderImages/image6.png",
    name: "Елена",
  },
];

const ReviewSlider = ({title}: {title: string}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current as HTMLDivElement;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current as HTMLDivElement | null;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current as HTMLDivElement;
      const scrollAmount = 525; // item width (300) + gap (20) + extra space
      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current as HTMLDivElement;
      const scrollAmount = 525; // item width (300) + gap (20) + extra space
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#F9F7FE] md:mx-5 md:rounded-[20px] pb-10">
      <div className="flex items-center justify-between py-5 px-6 md:py-[50px] md:px-8">
        <h1 className="text-[20px] leading-[120%] text-[#3D334A] md:text-[40px] md:tracking-[-3%] font-bold">
          {title || "ОТЗЫВЫ О GRS"}
        </h1>
        <SliderArrows
          onScrollLeft={handleScrollLeft}
          onScrollRight={handleScrollRight}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
        />
      </div>
      <div className="px-4 md:px-5 rounded-[30px] w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {reviewSliderItems.map((item, index) => (
            <div
              key={index}
              className="relative flex items-center flex-col min-w-[220px] md:min-w-[300px] flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-[15px] object-cover w-[220px] h-[320px] md:w-[300px] md:h-[420px] lg:w-[349px] lg:h-[496px]"
              />
              <h4 className="absolute bottom-[20px] text-center backdrop-blur-[16px] bg-black/20 text-white py-2 px-3 w-[180px] md:w-[240px] lg:w-[289px] rounded-[10px] font-medium text-[16px] md:text-[20px] lg:text-[24px] leading-[120%]">
                {item.name}
              </h4>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-105 duration-300 cursor-pointer w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[100px] lg:h-[100px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg 
                  width="24" 
                  height="28" 
                  viewBox="0 0 24 28" 
                  fill="none" 
                  className="ml-1"
                >
                  <path 
                    d="M22 12.268c1.333.77 1.333 2.694 0 3.464L4 25.856c-1.333.77-3-.192-3-1.732V3.876c0-1.54 1.667-2.502 3-1.732L22 12.268z" 
                    fill="white"
                  />
                </svg>
              </div>
            </div>
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

export default ReviewSlider;