"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import SliderArrows from "./SliderArrows";
import { useI18n } from "../context/I18nContext";

interface CertificateProps {
  certificates?: string[];
  title?: string;
}

const Certificate = ({ certificates = [], title }: CertificateProps) => {
  const { t } = useI18n();
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
    const ref = scrollRef.current;
    ref?.addEventListener("scroll", updateScrollButtons);
    return () => ref?.removeEventListener("scroll", updateScrollButtons);
  }, [certificates]);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="mx-5 rounded-[30px] bg-white px-10 py-[50px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#3D334A] leading-[120%] tracking-[-3%] text-[40px]">
          {title || t("certificates.title") || "Сертификаты"}
        </h1>
        {certificates.length > 1 && (
          <SliderArrows
            onScrollLeft={handleScrollLeft}
            onScrollRight={handleScrollRight}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />
        )}
      </div>

      <div
        className="flex flex-row gap-10 mt-10 overflow-x-auto scroll-smooth scrollbar-hide"
        ref={scrollRef}
      >
        {certificates.map((src, index) => (
          <div key={index} className="relative w-[471px] h-[648px] shrink-0">
            <Image
              src={src}
              fill
              alt={`Certificate ${index + 1}`}
              className="rounded-[20px] object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
