"use client";

import React, { useState } from "react";
import DesktopNavbar from "../Navbar/DesktopNavbar";
import { useI18n } from "../../context/I18nContext";
import MobileNavbar from "../Navbar/MobileNavbar";
import useStatistics from "../../hooks/useStatistics";
import Link from "next/link";

interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
}

interface MainHeaderProps {
  ShowBlock?: boolean;
  OptionalComponent?: React.ReactNode;
  stats?: Stat[];
  showArrows?: boolean;
  complexData?: any;
  useVideo?: boolean;
  backgroundImage?: string;
  customTitle?: string | null;
  customSubtitle?: string | null;
  hideHeaderText?: boolean;
  customBlockTitle?: string;
  customBlockDescription?: string;
  hideStats?: boolean;
  hideBlock?: boolean; // Hide REHABILITATION block
}

function MainHeader({
  ShowBlock = false,
  OptionalComponent = null,
  stats = [],
  showArrows = true,
  complexData = null,
  useVideo = true,
  backgroundImage = "/assets/images/continueWatchingBanner.jpg",
  customTitle = null,
  customSubtitle = null,
  hideHeaderText = false,
  customBlockTitle,
  customBlockDescription,
  hideStats = false,
  hideBlock = false,
}: MainHeaderProps) {
  const { t, locale } = useI18n();
  const { statistics } = useStatistics();
  const [showContent, setShowContent] = useState(true);

  // Debug: Log stats data
  console.log('📊 MainHeader Stats Debug:', {
    stats,
    statsLength: stats.length,
    statsType: typeof stats,
    statsIsArray: Array.isArray(stats),
    statsDetails: stats.map((stat, index) => ({
      index,
      value: stat.value,
      valueType: typeof stat.value,
      label: stat.label,
      hasIcon: !!stat.icon
    })),
    hideStats,
    statisticsFromHook: statistics
  });

  const localizedMenuItems = [
    { id: 1, name: t("navigation.all_complexes"), route: "/allComplex" },
    { id: 2, name: t("navigation.about"), route: "/about" },
    { id: 3, name: t("navigation.blog"), route: "/blog" },
    { id: 4, name: t("navigation.contacts"), route: "/contact" },
  ];

  const handleNextClick = () => setShowContent((prev) => !prev);
  const handlePrevClick = () => setShowContent(false);

  const isVisible = !showArrows || showContent;

  // ენის მიხედვით ვიდეოს არჩევა
  const getVideoSource = () => {
    switch (locale) {
      case "ka":
        return "/videos/heroKa.mp4";
      case "en":
        return "/videos/heroEn.mp4";
      case "ru":
        return "/videos/hero.mp4";
      default:
        return "/videos/hero.mp4";
    }
  };

  return (
    <div className="relative rounded-[20px] h-[100vh] md:h-[85vh] md:m-6 overflow-hidden">
      <DesktopNavbar
        menuItems={localizedMenuItems}
        blogBg={false}
        allCourseBg={false}
        complexData={complexData}
      />
      <MobileNavbar />

      {/* ვიდეო ან სურათი */}
      {useVideo ? (
        <video
          key={locale}
          autoPlay
          muted
          loop
          playsInline
          className="video-bg absolute h-full w-full object-cover z-[-1] md:rounded-[20px]"
        >
          <source src={getVideoSource()} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center z-[-1] md:rounded-[20px]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Arrow Navigation Buttons */}
      {showArrows && (
        <div className="hidden absolute right-8 xl:top-4/7 top-1/2 transform -translate-y-1/2 md:flex gap-3 z-10">
          <button
            onClick={handlePrevClick}
            className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-black/40 hover:scale-105"
            aria-label="Hide header content"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleNextClick}
            className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-black/40 hover:scale-105"
            aria-label="Toggle header content"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {ShowBlock && (
        <div className="absolute bottom-0 right-0 hidden md:flex gap-4 bg-[#F9F7FE] rounded-tl-[80px] p-6 pb-8 z-10 items-end">
          <Link 
            href="/about"
            className="text-white bg-[#3D334A] rounded-[40px] w-[246px] h-[222px] flex items-start justify-start p-8 transition-transform duration-300 hover:scale-105 cursor-pointer font-bold uppercase text-lg shadow-2xl leading-tight font-bowler"
            style={{ wordSpacing: 'normal', hyphens: 'none' }}
          >
            {t("header.learn_more") || "Изучить подробнее"}
          </Link>
          <Link 
            href="/allComplex"
            className="text-white bg-gradient-to-br from-[#D4BAFC] via-[#C4A6F1] to-[#B794E8] rounded-[40px] w-[246px] h-[222px] flex items-start justify-start p-8 transition-transform duration-300 hover:scale-105 cursor-pointer font-bold uppercase text-lg shadow-2xl leading-tight font-bowler"
            style={{ wordSpacing: 'normal', hyphens: 'none' }}
          >
            {t("header.to_catalog") || "В каталог"}
          </Link>
        </div>
      )}

      <div className="md:w-212 m-8 content-between md:grid">
        {/* თუ customTitle არის, მაშინ გამოაჩენე ის, თუარადა - ჩვეულებრივი */}
        {!hideHeaderText && (customTitle ? (
          <div className="mb-6 md:max-w-[888px]">
            <h1 className="text-2xl md:text-5xl font-bold text-white font-bowler uppercase md:leading-[100%] leading-[120%] md:tracking-[-1%] tracking-[-3%]" style={{ wordSpacing: 'normal', hyphens: 'none' }}>
              {customTitle}
            </h1>
            {customSubtitle && (
              <p className="text-base md:text-2xl text-white font-bowler font-medium mt-4 md:leading-[120%] leading-[120%]" style={{ wordSpacing: 'normal', hyphens: 'none' }}>
                {customSubtitle}
              </p>
            )}
          </div>
        ) : (
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-6 hidden md:block font-bowler" style={{ wordSpacing: 'normal', hyphens: 'none' }}>
            {t("header.ecosystem_title")}
          </h1>
        ))}

        <div
          className={`md:absolute bottom-8 ${isVisible ? "block" : "hidden"}`}
        >
          {!hideStats && (
            <div className="flex gap-4 flex-col md:flex-row mb-4 w-full justify-between">
              {stats.map((stat, index) => {
                // Debug: Log each stat item
                console.log(`📈 MainHeader Stat [${index}]:`, {
                  value: stat.value,
                  valueType: typeof stat.value,
                  label: stat.label,
                  hasIcon: !!stat.icon,
                  isNaN: typeof stat.value === 'number' ? isNaN(stat.value) : 'N/A'
                });

                return (
                  <div
                    key={index}
                    className="bg-[#3d334a4d] w-full backdrop-blur-sm rounded-[20px] px-5 py-3 flex items-center gap-3 transition-transform duration-300 hover:scale-105"
                  >
                    <span className="bg-white/20 rounded-xl p-3 flex items-center justify-center flex-shrink-0">{stat.icon}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white font-pt">
                        {typeof stat.value === 'number' ? stat.value : String(stat.value)}
                      </span>
                      <span className="text-base text-white/90 font-pt font-medium">{stat.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!hideBlock && (
            <div className="bg-[#3d334a4d] rounded-3xl p-8 content-between grid max-w-212">
              {complexData ? (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-8 font-bowler">
                    {complexData?.name?.[locale] || complexData?.name?.ru || complexData?.name?.en || complexData?.name?.ka}
                  </h1>
                  <p className="text-sm md:text-lg text-white font-pt">{complexData?.description?.[locale] || complexData?.description?.ru || complexData?.description?.en || complexData?.description?.ka}</p>
                </>
              ):(
                <>
                  <h1 className="text-[28px] md:text-[48px] font-bold text-white mb-6 md:mb-8 uppercase font-bowler tracking-[-1%] leading-[100%]">
                    {customBlockTitle || t("header.rehabilitation")}
                  </h1>
                  <p className="text-[18px] md:text-[24px] font-medium text-white font-pt leading-[120%] tracking-[-1%]">{customBlockDescription || t("header.rehabilitation_description")}</p>
                </>
              )}
            </div>
          )}
        </div>

        {OptionalComponent && <div>{OptionalComponent}</div>}
      </div>
    </div>
  );
}

export default MainHeader;