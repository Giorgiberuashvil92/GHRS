"use client";
import React, { Suspense } from "react";
import { CiPlay1 } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header/Header";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Tabs from "../components/Tabs";
import Modal from "../components/Modal";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { CiLock } from "react-icons/ci";
import Blog from "../components/Blog";
import Works from "../components/Works";
import { useSet } from "../hooks/useSet";
import { useI18n } from "../context/I18nContext";
import { Main } from "next/document";
import MainHeader from "../components/Header/MainHeader";

function ComplexContent() {
  const searchParams = useSearchParams();
  const setId = searchParams.get("id") || "";
  const { t } = useI18n();

  const { set: setData, loading: setLoading, error: setError } = useSet(setId);

  console.log(setData, 'ბევრი დატა');

  const [popoverOpen, setPopoverOpen] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        playBtnRef.current &&
        !playBtnRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const [modalOpen, setModalOpen] = useState(false);
  const tabItems = [
    { label: "Описание", href: "#description" },
    { label: "Дополнительно", href: "#extra" },
    { label: "Демо-видео", href: "#demo" },
  ];

  // ვიღებთ ენის პარამეტრს
  const getLocale = () => {
    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("locale");
      return storedLocale && ["ka", "ru", "en"].includes(storedLocale)
        ? storedLocale
        : "ru";
    }
    return "ru";
  };

  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined,
    locale: string = "ru"
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

  const locale = getLocale();

  interface PriceObject {
    monthly: number;
    threeMonths: number;
    sixMonths: number;
    yearly: number;
  }

  interface ExtendedSetPrices {
    price?: PriceObject;
    priceEn?: PriceObject;
    priceKa?: PriceObject;
    discountedPrice?: PriceObject;
    discountedPriceEn?: PriceObject;
    discountedPriceKa?: PriceObject;
  }

  const getPriceByPeriod = (
    period: keyof PriceObject,
    base: PriceObject | undefined,
    en: PriceObject | undefined,
    ka: PriceObject | undefined,
    discountedBase: PriceObject | undefined,
    discountedEn: PriceObject | undefined,
    discountedKa: PriceObject | undefined,
    locale: string
  ): number => {
    if (locale === "en") {
      if (discountedEn && typeof discountedEn[period] === "number")
        return discountedEn[period];
      if (en && typeof en[period] === "number") return en[period];
    }
    if (locale === "ka") {
      if (discountedKa && typeof discountedKa[period] === "number")
        return discountedKa[period];
      if (ka && typeof ka[period] === "number") return ka[period];
    }
    if (discountedBase && typeof discountedBase[period] === "number")
      return discountedBase[period];
    if (base && typeof base[period] === "number") return base[period];
    return 0;
  };

  const prices: ExtendedSetPrices = setData as unknown as ExtendedSetPrices;

  // Loading state
  if (setLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
            {t("common.loading")}
          </h2>
        </div>
      </div>
    );
  }

  // Error state
  if (setError || !setData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-cinzel font-bold text-red-600 mb-4">
            {t("common.error")}
          </h2>
          <p className="text-gray-600 mb-6">
            {setError || t("common.set_not_found")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        variant="complex"
        onPriceClick={() => setPopoverOpen(true)}
        setData={setData}
      />
      {/* <MainHeader ShowBlock={false} OptionalComponent={null} stats={[]} showArrows={false}/> */}
      <div className="">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20 md:mt-40 px-4">
          <Tabs
            items={tabItems}
            activeTabIndex={activeTabIndex}
            onTabClick={setActiveTabIndex}
          />
        </section>
        {/* ტაბების ქვემოთ იცვლება მხოლოდ კონტენტი */}
        <div className="px-4 py-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
            <div className="order-3 md:order-2 p-4 md:p-[40px] md:mb-20 bg-[rgba(249,247,254,1)] rounded-[20px] md:rounded-[30px]">
              {activeTabIndex === 0 && (
                <>
                  <div className="flex flex-col md:gap-5 gap-4 pb-6 md:pb-[80px]">
                    <strong className="text-[rgba(61,51,74,1)] tracking-[-3%] leading-[120%] text-[18px] md:text-[40px] font-medium">
                      {getLocalizedText(setData.name, locale)}
                    </strong>
                    <span className="text-[rgba(132,111,160,1)] md:text-2xl text-[16px] leading-[120%] font-medium">
                      {getLocalizedText(setData.description, locale)}
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-[10px] text-[rgba(61,51,74,1)] tracking-[-1%] leading-[100%] text-[18px] ">
                      Общие указания:
                    </h4>
                    <p className="text-[rgba(132,111,160,1)] md:text-[18px] tex-[14px] leading-[150%]  ">
                      Комплекс состоит из {setData.totalExercises} упражнений,
                      общая длительность комплекса {setData.totalDuration} мин
                    </p>
                  </div>
                </>
              )}
              {activeTabIndex === 1 && (
                <div className="text-lg text-[rgba(61,51,74,1)] md:px-10 md:py-5 bg-[#F9F7FE] rounded-[20px]">
                  <h1 className="md:text-[40px] leading-[120%] tracking-[-3%] text-[#3D334A]">
                    Дополнительно
                  </h1>
                  <p className="font-pt text-[18px] leading-[120%] text-[#846FA0] mt-10">
                    {getLocalizedText(setData.description, locale)}
                  </p>
                </div>
              )}
              {activeTabIndex === 2 && (
                <div className="text-lg text-[rgba(61,51,74,1)]">
                  <h1 className="md:text-[40px] leading-[120%] tracking-[-3%] mb-5">
                    Демо-видео
                  </h1>
                  <div className="rounded-[15px] overflow-hidden shadow-lg">
                    <ReactPlayer
                      src="/videos/hero.mp4"
                      controls
                      width="100%"
                      height="360px"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="order-1 md:order-3 flex flex-col md:gap-4 gap-5">
              {/* Beginner Level */}
              <div className="relative bg-[url('/assets/images/blog.png')] bg-cover bg-center bg-no-repeat p-5 rounded-[10px] flex justify-between items-center">
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3 className="text-[rgba(255,255,255,1))] md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase">
                    Начальный уровень
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {setData.levels.beginner.exerciseCount} упражнений
                  </span>
                </div>
                <button ref={playBtnRef} className="relative z-10">
                  <CiPlay1
                    size={20}
                    color="white"
                    className="hover:text-[#846FA0] hover:text-2xl hover:scale-125"
                  />
                </button>
                {popoverOpen && (
                  <div
                    ref={popoverRef}
                    className="absolute right-0 -top-72 mt-2 bg-white shadow-lg rounded-2xl p-0 min-w-[320px] max-w-[90vw] border border-purple-200 z-20 flex flex-col items-stretch"
                  >
                    {/* 1 месяц */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)]">
                      <span className="font-bold cursor-pointer text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        {t("header.subscription_period.one_month")}
                      </span>
                      <span className="text-[16px] text-[rgba(132,111,160,1)] font-medium">
                        {getPriceByPeriod(
                          "monthly",
                          prices.price,
                          prices.priceEn,
                          prices.priceKa,
                          prices.discountedPrice,
                          prices.discountedPriceEn,
                          prices.discountedPriceKa,
                          locale
                        )}{" "}
                        {t("header.currency")}/{t("header.per_month")}
                      </span>
                    </div>
                    {/* 3 месяца - highlight */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)] bg-[rgba(132,111,160,0.08)]">
                      <span className="font-bold cursor-pointer text-[18px] leading-[120%] tracking-[-2%] text-[rgba(132,111,160,1)] uppercase">
                        {t("header.subscription_period.three_months")}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] cursor-pointer font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {getPriceByPeriod(
                            "threeMonths",
                            prices.price,
                            prices.priceEn,
                            prices.priceKa,
                            prices.discountedPrice,
                            prices.discountedPriceEn,
                            prices.discountedPriceKa,
                            locale
                          )}{" "}
                          {t("header.currency")}/{t("header.per_month")}
                        </span>
                        <span className="text-[14px] cursor-pointer text-[rgba(132,111,160,0.5)] line-through font-medium">
                          {getPriceByPeriod(
                            "monthly",
                            prices.price,
                            prices.priceEn,
                            prices.priceKa,
                            undefined,
                            undefined,
                            undefined,
                            locale
                          ) * 3}{" "}
                          {t("header.currency")}/{t("header.per_month")}
                        </span>
                      </div>
                    </div>
                    {/* 6 месяцев */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)]">
                      <span className="font-bold text-[18px] cursor-pointer leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        {t("header.subscription_period.six_months")}
                      </span>
                      <span className="text-[16px] cursor-pointer text-[rgba(132,111,160,1)] font-medium">
                        {getPriceByPeriod(
                          "sixMonths",
                          prices.price,
                          prices.priceEn,
                          prices.priceKa,
                          prices.discountedPrice,
                          prices.discountedPriceEn,
                          prices.discountedPriceKa,
                          locale
                        )}{" "}
                        {t("header.currency")}/{t("header.per_month")}
                      </span>
                    </div>
                    {/* 12 месяцев */}
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="font-bold text-[18px] cursor-pointer leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        {t("header.subscription_period.twelve_months")}
                      </span>
                      <span className="text-[16px] cursor-pointer text-[rgba(132,111,160,1)] font-medium">
                        {getPriceByPeriod(
                          "yearly",
                          prices.price,
                          prices.priceEn,
                          prices.priceKa,
                          prices.discountedPrice,
                          prices.discountedPriceEn,
                          prices.discountedPriceKa,
                          locale
                        )}{" "}
                        {t("header.currency")}/{t("header.per_month")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Intermediate Level */}
              <div className="bg-[rgba(249,247,254,1)] p-5 rounded-[10px] flex justify-between items-center">
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3 className="text-[rgba(132,111,160,1)] md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase">
                    Средний уровень
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {setData.levels.intermediate.exerciseCount} упражнений
                  </span>
                  {setData.levels.intermediate.isLocked && (
                    <CiLock
                      color="#846FA0"
                      className="absolute right-8"
                      size={24}
                    />
                  )}
                </div>
                <CiPlay1 width={19.28} height={25.44} />
              </div>

              {/* Advanced Level */}
              <div className="bg-[rgba(249,247,254,1)] p-5 rounded-[10px] flex justify-between items-center">
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3 className="text-[rgba(132,111,160,1)] md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase">
                    Продвинутый уровень
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {setData.levels.advanced.exerciseCount} упражнений
                  </span>
                  {setData.levels.advanced.isLocked && (
                    <CiLock
                      color="#846FA0"
                      className="absolute right-8"
                      size={24}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <Subscribe />
        <ReviewSlider title={""} />
        <div className="md:my-10">
          <Works
            title="Может понравиться"
            customMargin={""}
            customBorderRadius={""}
            seeAll={false}
            scrollable={false}
          />
        </div>
        <div className="md:my-10">
          <Blog
            withBanner={false}
            withSlider={true}
            layoutType="default"
            title={"GRS МЕДИА"}
          />
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Модальное окно"
          message="Здесь будет ваш контент (например, видео ან სხვა ინფორმაცია)."
          type="info"
        />
      </div>
    </div>
  );
}

export default function Complex() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
            <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <ComplexContent />
    </Suspense>
  );
}
