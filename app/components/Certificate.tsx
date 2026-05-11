"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import SliderArrows from "./SliderArrows";
import { useI18n } from "../context/I18nContext";

export type CertificateSlide = {
  src: string;
  title?: string;
  subtitle?: string;
};

interface CertificateProps {
  /** ძველი API: მხოლოდ სურათის URL-ები */
  certificates?: string[];
  slides?: CertificateSlide[];
  /** პირდაპირი სათაური (სტატიკური სტრიქონი) */
  title?: string;
  /** i18n გასაღები — ყოველ რენდერზე მიმდინარე ენით (რეკომენდებულია TeacherInfo-სთვის) */
  titleKey?: string;
  orientation?: "vertical" | "horizontal";
}

const Certificate = ({
  certificates = [],
  slides,
  title,
  titleKey,
  orientation = "vertical",
}: CertificateProps) => {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isHorizontal = orientation === "horizontal";

  const resolvedSlides = useMemo((): CertificateSlide[] => {
    if (slides && slides.length > 0) return slides;
    return (certificates || []).map((src) => ({ src }));
  }, [slides, certificates]);

  const scrollBy = (isHorizontal ? 620 : 471) + 40;

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
  }, [resolvedSlides]);

  if (!resolvedSlides.length) {
    return null;
  }

  const sectionHeading =
    (titleKey ? t(titleKey).trim() : "") ||
    (title?.trim() ?? "") ||
    t("teacher.certificatesTitle").trim() ||
    "Сертификаты";

  return (
    <div className="mx-5 rounded-[30px] bg-white px-10 py-[50px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#3D334A] leading-[120%] tracking-[-3%] text-[40px]">
          {sectionHeading}
        </h1>
        {resolvedSlides.length > 1 && (
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
        {resolvedSlides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className={`flex flex-col shrink-0 gap-3 ${
              isHorizontal ? "w-[min(620px,92vw)]" : "w-[min(471px,85vw)]"
            }`}
          >
            <div
              className={`relative w-full rounded-[20px] overflow-hidden bg-[#F9F7FE] ${
                isHorizontal ? "aspect-[16/10]" : "aspect-[471/648]"
              }`}
            >
              <Image
                src={slide.src}
                fill
                alt={slide.title || `Certificate ${index + 1}`}
                className="object-cover"
                sizes={
                  isHorizontal
                    ? "(max-width: 768px) 92vw, 620px"
                    : "(max-width: 768px) 85vw, 471px"
                }
              />
            </div>
            {(slide.title || slide.subtitle) && (
              <div className="px-1">
                {slide.title ? (
                  <p className="text-[#3D334A] font-semibold text-lg leading-tight">
                    {slide.title}
                  </p>
                ) : null}
                {slide.subtitle ? (
                  <p className="text-[#846FA0] text-sm mt-1">{slide.subtitle}</p>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
