"use client";

import { useRef, useState, useEffect } from "react";
import SliderArrows from "./SliderArrows";

const Certificate = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollBy = 471 + 40;

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollBy, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollBy, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    scrollRef.current?.addEventListener("scroll", updateScrollButtons);
    return () => scrollRef.current?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const images = [
    "https://picsum.photos/id/1015/471/648",
    "https://picsum.photos/id/1025/471/648",
    "https://picsum.photos/id/1035/471/648",
    "https://picsum.photos/id/1045/471/648",
    "https://picsum.photos/id/1055/471/648",
    "https://picsum.photos/id/1065/471/648",
  ];

  return (
    <div className="mx-5 rounded-[30px] bg-white px-10 py-[50px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#3D334A] leading-[120%] tracking-[-3%] text-[40px]">Сертификаты</h1>
        <SliderArrows
          onScrollLeft={handleScrollLeft}
          onScrollRight={handleScrollRight}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
        />
      </div>

      <div
        className="flex flex-row gap-10 mt-10 overflow-x-auto scroll-smooth scrollbar-hide"
        ref={scrollRef}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={`${src}?w=471&h=648&fit=crop`}
            alt={`Certificate ${index + 1}`}
            className="w-[471px] h-[648px] rounded-[20px] object-cover shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default Certificate;
