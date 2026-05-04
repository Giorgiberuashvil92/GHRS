"use client";
import React, { useRef, useState, useEffect } from "react";
import { useI18n } from "../context/I18nContext";
import { useReviews } from "../hooks/useReviews";

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

// Reviews are now fetched from API via useReviews hook

type ReviewSliderProps = {
  title?: string;
  /** იგივე ბარათში, კურსების ქვემოთ — ფონი/მარჟინები მშობელს უკვე აქვს */
  embeddedInCard?: boolean;
};

const ReviewSlider = ({ title = "", embeddedInCard = false }: ReviewSliderProps) => {
  const { t, locale } = useI18n();
  const { reviews, loading } = useReviews();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Helper to get localized text
  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined
  ): string => {
    if (!field) return "";
    return (
      field[locale as keyof typeof field] ||
      field.ru ||
      field.en ||
      field.ka ||
      ""
    );
  };

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
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollButtons);
    checkScrollButtons();
    return () => container.removeEventListener("scroll", checkScrollButtons);
  }, [reviews.length, loading]);

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

  const outerClass = embeddedInCard
    ? "w-full pb-2 md:pb-4"
    : "bg-[#F9F7FE] md:mx-5 md:rounded-[30px] pb-5 md:pb-8";

  const headerPad = embeddedInCard
    ? "py-0 px-0 md:mb-[10px]"
    : "py-5 px-6 md:py-[50px] md:px-8";

  const titleClass = embeddedInCard
    ? "text-[24px] md:text-[64px] font-bowler uppercase tracking-[-1%] text-[#3D334A] leading-[100%] mb-2.5 md:mb-0"
    : "text-[20px] leading-[120%] text-[#3D334A] md:text-[40px] md:tracking-[-3%] font-bold";

  const scrollPad = embeddedInCard ? "px-0 md:px-0" : "px-4 md:px-8";

  return (
    <div className={outerClass}>
      <div className={`flex items-center justify-between ${headerPad}`}>
        <h1 className={titleClass}>
          {title || t("reviews.title")}
        </h1>
        <SliderArrows
          onScrollLeft={handleScrollLeft}
          onScrollRight={handleScrollRight}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
        />
      </div>
      <div className={`${scrollPad} rounded-8 w-full overflow-hidden`}>
        <div
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {reviews.map((item, index) => (
            <div
              key={item._id}
              className="relative flex items-center flex-col min-w-[220px] md:min-w-[300px] flex-shrink-0"
            >
              {/* Thumbnail image - hidden when video is playing */}
              {playingVideo !== index && (
                <img
                  src={item.image || "/assets/images/reviewSliderImages/image2.png"}
                  alt={getLocalizedText(item.name)}
                  className="rounded-[15px] object-cover w-[220px] h-[380px] md:w-[300px] md:h-[500px] lg:w-[349px] lg:h-[580px]"
                />
              )}
              
              {/* Video element - shown when playing (only if video URL exists) */}
              {item.videoUrl && (
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={item.videoUrl}
                  className={`rounded-[15px] object-cover w-[220px] h-[380px] md:w-[300px] md:h-[500px] lg:w-[349px] lg:h-[580px] ${
                    playingVideo === index ? 'block' : 'hidden'
                  }`}
                  controls
                  playsInline
                  onEnded={() => setPlayingVideo(null)}
                  onPause={() => {
                    if (videoRefs.current[index]?.currentTime === videoRefs.current[index]?.duration) {
                      setPlayingVideo(null);
                    }
                  }}
                  onError={(e) => {
                    console.error('Video failed to load:', item.videoUrl);
                    setPlayingVideo(null);
                  }}
                />
              )}
              
              <h4 className="absolute bottom-[20px] text-center backdrop-blur-[16px] bg-black/20 text-white py-2 px-3 w-[180px] md:w-[240px] lg:w-[289px] rounded-[10px] font-medium text-[16px] md:text-[20px] lg:text-[24px] leading-[120%] z-10">
                {getLocalizedText(item.name)}
              </h4>
              
              {/* Play button - only show when video is not playing AND video URL exists */}
              {playingVideo !== index && item.videoUrl && (
                <div 
                  onClick={() => {
                    if (!item.videoUrl) {
                      alert('Video not available yet. Please add video URL in admin panel');
                      return;
                    }
                    setPlayingVideo(index);
                    setTimeout(() => {
                      videoRefs.current[index]?.play();
                    }, 100);
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-110 duration-300 cursor-pointer w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[100px] lg:h-[100px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
                >
                  <svg 
                    width="24" 
                    height="28" 
                    viewBox="0 0 24 28" 
                    fill="none" 
                  >
                    <p className="text-white text-base md:text-lg font-medium">
                      {getLocalizedText(item.name)}
                    </p>
                    <path 
                      d="M22 12.268c1.333.77 1.333 2.694 0 3.464L4 25.856c-1.333.77-3-.192-3-1.732V3.876c0-1.54 1.667-2.502 3-1.732L22 12.268z" 
                      fill="white"
                    />
                  </svg>
                </div>
              )}
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