/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CiPlay1 } from "react-icons/ci";
// import Header from "../../components/Header/Header";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Tabs from "../../components/Tabs";
import Modal from "../../components/Modal";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { CiLock } from "react-icons/ci";
import Blog from "../../components/Blog";
import { useSet } from "../../hooks/useSet";
import { useI18n } from "../../context/I18nContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useExercisesBySet } from "../../hooks/useExercises";
import { useUserAccess } from "../../hooks/useUserAccess";
import { FaBook, FaDumbbell, FaClock } from "react-icons/fa";
import { Footer } from "@/app/components/Footer";
import WorksSlider from "@/app/components/WorksSlider";
import MainHeader from "@/app/components/Header/MainHeader";
import { formatPriceByLocale } from "@/app/utils/currency";

interface Params {
  id: string;
}

interface ComplexPageProps {
  params: Promise<Params>;
}

const Complex = ({ params }: ComplexPageProps) => {
  const resolvedParams = React.use(params);
  const setId = resolvedParams.id;
  const { t } = useI18n();

  // ყოველთვის პირდაპირ set-ს ვიღებთ ID-ით
  const {
    set: directSet,
    loading: setLoading,
    error: setError,
  } = useSet(setId);

  // საბოლოო loading და error states
  const loading = setLoading;
  const error = setError;

  // Set-ის მონაცემები
  const rawSetData = directSet;

  // ვიღებთ სავარჯიშოებს
  const { exercises, loading: exercisesLoading } = useExercisesBySet(setId);

  // ვამოწმებთ user-ის access-ს
  const { hasAccess } = useUserAccess(setId);

  // Helper ფუნქცია - უნდა ჩანდეს play ღილაკი თუ არა
  const shouldShowPlayButton = (difficulty: string) => {
    const exerciseCount = exercisesByDifficulty?.[difficulty] || 0;
    // Play button ჩანს თუ user-ს აქვს access და არის ვარჯიშები
    return hasAccess && exerciseCount > 0;
  };

  // Helper ფუნქცია - უნდა ჩანდეს lock icon თუ არა
  const shouldShowLockIcon = (difficulty: string) => {
    const exerciseCount = exercisesByDifficulty?.[difficulty] || 0;
    // Lock icon ჩანს თუ:
    // 1. User-ს არ აქვს access, ან
    // 2. Specific difficulty-ს 0 ვარჯიშო აქვს
    const result = !hasAccess || exerciseCount === 0;
    return result;
  };

  // ვითვლით სავარჯიშოების რაოდენობას სირთულის მიხედვით
  const exercisesByDifficulty = exercises?.reduce((acc, exercise) => {
    acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // ვითვლით ჯამურ ხანგრძლივობას
  const totalDurationInMinutes =
    exercises?.reduce((total: number, exercise: any) => {
      const duration = exercise.duration || "0:00";
      const [minutes, seconds] = duration.split(":").map(Number);
      return total + minutes + (seconds || 0) / 60;
    }, 0) || 0;

  // ვაფორმატებთ ხანგრძლივობას "HH:MM" ფორმატში
  const formattedTotalDuration = `${Math.floor(
    totalDurationInMinutes
  )}:${String(Math.round((totalDurationInMinutes % 1) * 60)).padStart(2, "0")}`;

  // ვითვლით საათებს სტატისტიკისთვის
  const totalHours = Math.round(totalDurationInMinutes / 60);

  // ვამატებთ დათვლილ მონაცემებს setData-ში
  const setData = rawSetData
    ? {
        ...rawSetData,
        totalExercises: exercises?.length || 0,
        totalDuration: formattedTotalDuration,
        exercises, // ვამატებთ სავარჯიშოების სრულ სიას
      }
    : null;

  console.log(setData, "სეტის დატა");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // State for selected subscription
  const [selectedPeriod, setSelectedPeriod] = useState("12 months");
  const [selectedPrice, setSelectedPrice] = useState(setData?.discountedPrice?.yearly || setData?.price?.yearly || 500);

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
      setPopoverOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const [modalOpen, setModalOpen] = useState(false);
  const tabItems = [
    { label: t("complex_description"), href: "#description" },
    { label: t("complex_additional"), href: "#extra" },
    { label: t("complex_demo_video"), href: "#demo" },
  ];

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

  // Helper: გადაყავს `{new paragraph}` (ან `{new paragraph }`) მაკერი ახალ პარაგრაფებად
  const renderParagraphs = (text: string | undefined): React.ReactNode => {
    if (!text) return null;
    const parts = text
      .split(/\{new paragraph\s*\}/i)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.map((part, index) => <p key={index}>{part}</p>);
  };

  // Loading state
  if (loading || exercisesLoading) {
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
  if (error || !setData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-cinzel font-bold text-red-600 mb-4">
            {t("common.error")}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || t("common.set_not_found")}
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

  // Add to cart helper – always uses currently selected period and price
  function handleAddToCart() {
    const finalPeriod = selectedPeriod;
    const finalPrice = selectedPrice;

    console.log("🛒 Adding to cart", {
      period: finalPeriod,
      price: finalPrice,
      setId,
      setData,
    });

    if (!setData) {
      console.error("❌ No setData available");
      return;
    }

    if (!setId) {
      console.error("❌ No setId available");
      return;
    }

    try {
      const cartItem = {
        id: setId,
        type: "set",
        itemType: "set",
        name: setData.name, // multilingual object {ru, en, ka}
        title: setData.name?.ru || setData.name?.en || "", // fallback title
        price: finalPrice,
        period: finalPeriod,
        image: setData.thumbnailImage || "/assets/images/course.png",
        img: setData.thumbnailImage || "/assets/images/course.png",
        description: setData.description, // multilingual object
        desc: setData.description?.ru || setData.description?.en || "",
        totalExercises: setData.totalExercises || 0,
        totalDuration: setData.totalDuration || "0:00",
      };

      console.log("📦 Cart item created:", cartItem);

      // Get existing cart or initialize empty array
      const existingCart = localStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];

      console.log("🛍️ Existing cart:", cart);

      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === setId);
      if (existingItemIndex !== -1) {
        // Update existing item
        cart[existingItemIndex] = cartItem;
        console.log("✏️ Updated existing item in cart");
      } else {
        // Add new item
        cart.push(cartItem);
        console.log("➕ Added new item to cart");
      }

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("💾 Cart saved to localStorage:", cart);

      // Redirect to shopping cart
      console.log("🔄 Redirecting to shopping cart...");
      window.location.href = "/shoppingcard";
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  }

  // Update selection only; BUY button will add to cart with selected plan
  const handleSubscriptionSelect = (period: string, price: number) => {
    console.log("✅ Selection updated", { period, price });

    // Update selected period and price for UI
    setSelectedPeriod(period);
    setSelectedPrice(price);

    // Close popover
    setPopoverOpen(false);
  };

  const statsData = [
    {
      icon: <FaBook size={24} />,
      value: setData?.totalExercises || exercises?.length || 0,
      label: t("header.sets_count", { count: String(setData?.totalExercises || exercises?.length || 0) }).replace(/\d+\s*/, "") || "комплексов",
    },
    {
      icon: <FaDumbbell size={24} />,
      value: exercises?.length || setData?.totalExercises || 0,
      label: t("header.exercises_count", { count: String(exercises?.length || setData?.totalExercises || 0) }).replace(/\d+\s*/, "") || "упражнений",
    },
    {
      icon: <FaClock size={24} />,
      value: totalHours || 0,
      label: t("header.hours_count", { count: String(totalHours || 0) }).replace(/\d+\s*/, "") || "часов",
    },
  ];

  // Helper function to get period display text
  const getPeriodDisplayText = (period: string) => {
    switch(period) {
      case "1 month":
        return "1 МЕСЯЦ";
      case "3 months":
        return "3 МЕСЯЦА";
      case "6 months":
        return "6 МЕСЯЦЕВ";
      case "12 months":
        return "12 МЕСЯЦЕВ";
      default:
        return period.toUpperCase();
    }
  };

  const CustomBlock = (
    <div className="md:absolute bottom-0 right-0 gap-4 flex flex-col">
      <div className="hidden mx-auto text-white text-sm bg-[#3D334A4D] p-4  rounded-2xl md:w-54 w-full z-10 md:flex">
        <p className="text-center font-bold uppercase">{getPeriodDisplayText(selectedPeriod)}</p>
      </div>
      <div className="flex bottom-0 right-0 md:bg-white rounded-tl-4xl p-8 justify-center">
        <div 
          className="flex flex-col text-white bg-gradient-to-br from-[#FFDAB9] via-[#C4A6F1] to-[#C4A6F1] p-4 rounded-2xl h-54 md:w-54 w-full justify-center transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => setPopoverOpen(true)}
        >
          {/* Price */}
          <p className="text-white font-bold text-4xl leading-[90%] uppercase">
            {formatPriceByLocale(selectedPrice, locale as 'ka' | 'ru' | 'en')}
          </p>

          {/* Duration */}
          <p className="text-white font-normal text-lg leading-[90%] uppercase">
            {getPeriodDisplayText(selectedPeriod)}
          </p>

          {/* Button */}
          <div 
            className="text-white font-normal text-xl mx-auto leading-[90%] uppercase mt-auto bg-white/20 px-6 py-2 rounded-lg hover:bg-white/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening popover
              handleAddToCart();
            }}
          >
            {t("common.buy") || "ПРИОБРЕСТИ"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* <Header
        variant="complex"
        onPriceClick={() => setPopoverOpen(true)}
        setData={setData}
      /> */}
      <MainHeader
        ShowBlock={false}
        OptionalComponent={CustomBlock as any}
        stats={statsData as any}
        showArrows={false}
        complexData={setData as any}
      />
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
                    <p className="text-[rgba(132,111,160,1)] md:text-2xl text-[16px] leading-[120%] font-medium">
                      {t("complex_total_duration", {
                        duration: setData.duration,
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-[10px] text-[rgba(61,51,74,1)] tracking-[-1%] leading-[100%] text-[18px]">
                      {t("complex_general_instructions")}
                    </h4>
                    <h4 className="mb-[10px] text-[rgba(61,51,74,1)] tracking-[-1%] leading-[100%] text-[18px] mt-10">
                      {t("complex_recommendations")}
                    </h4>
                    <div className="text-[rgba(132,111,160,1)] md:text-[18px] tex-[14px] leading-[150%] font-pt space-y-4">
                      {renderParagraphs(
                        getLocalizedText(setData.recommendations, locale)
                      )}
                    </div>
                    <h4 className="mb-[10px] text-[rgba(61,51,74,1)] tracking-[-1%] leading-[100%] text-[18px] mt-10">
                      {t("complex_equipment")}
                    </h4>
                    <p className="text-[rgba(132,111,160,1)] md:text-[18px] tex-[14px] leading-[150%] font-pt ">
                      {getLocalizedText(setData.equipment, locale)}
                    </p>
                    <h4 className="mb-[10px] text-[rgba(61,51,74,1)] tracking-[-1%] leading-[100%] text-[18px] mt-10">
                      {t("complex_warnings")}
                    </h4>
                    <p className="text-[rgba(132,111,160,1)] md:text-[18px] tex-[14px] leading-[150%] font-pt ">
                      {getLocalizedText(setData.warnings, locale)}
                    </p>
                  </div>
                </>
              )}
              {activeTabIndex === 1 && (
                <div className="text-lg text-[rgba(61,51,74,1)] md:px-10 md:py-5 bg-[#F9F7FE] rounded-[20px]">
                  <h1 className="md:text-[40px] leading-[120%] tracking-[-3%] text-[#3D334A]">
                    {t("complex_additional")}
                  </h1>
                  <div
                    className="font-pt text-[18px] leading-[120%] text-[#846FA0] mt-10 [&_a]:text-purple-600 [&_a]:underline [&_a]:decoration-purple-400 [&_a]:underline-offset-2 [&_a]:hover:text-purple-800 [&_a]:hover:decoration-purple-600 [&_a]:transition-colors [&_a]:duration-200 [&_a]:font-bold"
                    dangerouslySetInnerHTML={{
                      __html:
                        getLocalizedText(setData.additional, locale) || "",
                    }}
                  />
                </div>
              )}
              {activeTabIndex === 2 && (
                <div className="text-lg text-[rgba(61,51,74,1)]">
                  <h1 className="md:text-[40px] leading-[120%] tracking-[-3%] mb-5">
                    {t("complex_demo_video")}
                  </h1>
                  <div className="rounded-[15px] overflow-hidden shadow-lg">
                    <ReactPlayer
                      src={(() => {
                        let videoUrl: string | undefined;
                        if (typeof setData.demoVideoUrl === "object") {
                          if (locale === "en" && setData.demoVideoUrl.en) {
                            videoUrl = setData.demoVideoUrl.en;
                          } else if (
                            locale === "ru" &&
                            setData.demoVideoUrl.ru
                          ) {
                            videoUrl = setData.demoVideoUrl.ru;
                          } else if (
                            locale === "ka" &&
                            setData.demoVideoUrl.ru
                          ) {
                            videoUrl = setData.demoVideoUrl.ru; // KA-სთვის იყენებთ RU-ს
                          }
                          if (!videoUrl) {
                            videoUrl =
                              setData.demoVideoUrl.en ||
                              setData.demoVideoUrl.ru;
                          }
                        } else {
                          videoUrl = setData.demoVideoUrl as string;
                        }
                        // ვტოვებთ ზუსტად იმ URL-ს და ფორმატს, რაც მოდელშია მითითებული
                        return videoUrl || "/videos/hero.mp4";
                      })()}
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
              <div
                className="relative bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] bg-cover bg-center bg-no-repeat p-5 rounded-[10px] flex justify-between items-center"
              >
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3
                    className="text-[rgba(255,255,255,1)] md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase"
                  >
                    {t("complex_beginner_level")}
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {t("complex_exercises_count", {
                      count: String(exercisesByDifficulty?.easy || 0),
                    })}
                  </span>
                </div>
                {shouldShowPlayButton("easy") && (
                  <Link
                    href={{
                      pathname: "/player",
                      query: {
                        setId,
                        difficulty: "easy",
                      },
                    }}
                  >
                    <button ref={playBtnRef} className="relative z-10">
                      <CiPlay1
                        size={20}
                        color="white"
                        className="hover:text-[#846FA0] hover:text-2xl hover:scale-125"
                      />
                    </button>
                  </Link>
                )}
                {shouldShowLockIcon("easy") && (
                  <CiLock color="#1a1a1a" className="relative z-10" size={28} />
                )}
                {popoverOpen && (
                  <div
                    ref={popoverRef}
                    className="absolute right-0 -top-96 mt-2 bg-white shadow-lg rounded-2xl p-0 min-w-[320px] max-w-[90vw] border border-purple-200 z-20 flex flex-col items-stretch"
                  >
                    {/* 1 Month */}
                    <div 
                      className="flex justify-between items-center px-6 py-4 hover:bg-purple-50 transition-colors cursor-pointer border-b border-gray-100"
                      onClick={() =>
                        handleSubscriptionSelect(
                          "1 month",
                          setData.price?.monthly || 100
                        )
                      }
                    >
                      <span className="font-bold text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        1 МЕСЯЦ
                      </span>
                      <span className="text-[20px] font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                        {setData.price?.monthly || 100} ₽/мес
                      </span>
                    </div>

                    {/* 3 Months */}
                    <div 
                      className="flex justify-between items-center px-6 py-4 hover:bg-purple-50 transition-colors cursor-pointer border-b border-gray-100"
                      onClick={() =>
                        handleSubscriptionSelect(
                          "3 months",
                          setData.price?.quarterly || setData.discountedPrice?.quarterly || 350
                        )
                      }
                    >
                      <span className="font-bold text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        3 МЕСЯЦА
                      </span>
                      <div className="flex flex-col items-end">
                        {setData.discountedPrice?.quarterly && (
                          <span className="text-[14px] text-gray-400 line-through">
                            {setData.price?.quarterly} ₽/мес
                          </span>
                        )}
                        <span className="text-[20px] font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {setData.discountedPrice?.quarterly || setData.price?.quarterly || 350} ₽/мес
                        </span>
                      </div>
                    </div>

                    {/* 6 Months */}
                    <div 
                      className="flex justify-between items-center px-6 py-4 hover:bg-purple-50 transition-colors cursor-pointer border-b border-gray-100"
                      onClick={() =>
                        handleSubscriptionSelect(
                          "6 months",
                          setData.price?.halfYearly || setData.discountedPrice?.halfYearly || 500
                        )
                      }
                    >
                      <span className="font-bold text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        6 МЕСЯЦЕВ
                      </span>
                      <span className="text-[20px] font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                        {setData.discountedPrice?.halfYearly || setData.price?.halfYearly || 500} ₽/мес
                      </span>
                    </div>

                    {/* 12 Months */}
                    <div 
                      className="flex justify-between items-center px-6 py-4 hover:bg-purple-50 transition-colors cursor-pointer rounded-b-2xl"
                      onClick={() =>
                        handleSubscriptionSelect(
                          "12 months",
                          setData.discountedPrice?.yearly || setData.price?.yearly || 500
                        )
                      }
                    >
                      <span className="font-bold text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        12 МЕСЯЦЕВ
                      </span>
                      <span className="text-[20px] font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                        {setData.discountedPrice?.yearly || setData.price?.yearly || 500} ₽/мес
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Intermediate Level */}
              <div
                className={`p-5 rounded-[10px] flex justify-between items-center ${
                  shouldShowPlayButton("medium")
                    ? "bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] bg-cover bg-center bg-no-repeat"
                    : "bg-[rgba(249,247,254,1)]"
                }`}
              >
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3
                    className={`md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase ${
                      shouldShowPlayButton("medium")
                        ? "text-[rgba(255,255,255,1)]"
                        : "text-[rgba(132,111,160,1)]"
                    }`}
                  >
                    {t("complex_intermediate_level")}
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {t("complex_exercises_count", {
                      count: String(exercisesByDifficulty?.medium || 0),
                    })}
                  </span>
                  {shouldShowLockIcon("medium") && (
                    <CiLock
                      color="#2D1B3D"
                      className="absolute right-8"
                      size={28}
                    />
                  )}
                </div>
                {shouldShowPlayButton("medium") && (
                  <Link
                    href={{
                      pathname: "/player",
                      query: {
                        setId,
                        difficulty: "medium",
                      },
                    }}
                  >
                    <CiPlay1 width={19.28} height={25.44} />
                  </Link>
                )}
              </div>

              {/* Advanced Level */}
              <div
                className={`p-5 rounded-[10px] flex justify-between items-center ${
                  shouldShowPlayButton("hard")
                    ? "bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] bg-cover bg-center bg-no-repeat"
                    : "bg-[rgba(249,247,254,1)]"
                }`}
              >
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3
                    className={`md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase ${
                      shouldShowPlayButton("hard")
                        ? "text-[rgba(132,111,160,1)]"
                        : "text-[rgba(132,111,160,1)]"
                    }`}
                  >
                    {t("complex_advanced_level")}
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {t("complex_exercises_count", {
                      count: String(exercisesByDifficulty?.hard || 0),
                    })}
                  </span>
                  {shouldShowLockIcon("hard") && (
                    <CiLock
                      color="#2D1B3D"
                      className="absolute right-8"
                      size={28}
                    />
                  )}
                </div>
                {shouldShowPlayButton("hard") && (
                  <Link
                    href={{
                      pathname: "/player",
                      query: {
                        setId,
                        difficulty: "hard",
                      },
                    }}
                  >
                    <CiPlay1 width={19.28} height={25.44} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.test_title"
          buttonTextKey="buttons.take_test"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
        <ReviewSlider title={"ОТЗЫВЫ О комплексе"} />
        <div className="md:my-10">
          <WorksSlider
            title="Может понравиться"
            seeAll={true}
            works={[]}
            fromMain={false}
            scrollable={true}
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
          title="მოდალური ფანჯარა"
          message="აქ იქნება თქვენი კონტენტი (მაგალითად, ვიდეო ან სხვა ინფორმაცია)."
          type="info"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Complex;
