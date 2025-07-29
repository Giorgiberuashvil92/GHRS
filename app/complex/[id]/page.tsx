/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { CiPlay1 } from "react-icons/ci";
import Header from "../../components/Header";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Tabs from "../../components/Tabs";
import Modal from "../../components/Modal";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { CiLock } from "react-icons/ci";
import Blog from "../../components/Blog";
import Works from "../../components/Works";
import { useCategoryComplete } from "../../hooks/useCategoryComplete";
import { useSet } from "../../hooks/useSet";
import { useI18n } from "../../context/I18nContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useExercisesBySet } from "../../hooks/useExercises";
import { Footer } from "@/app/components/Footer";
import WorksSlider from "@/app/components/WorksSlider";

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
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  


  // თუ არ არის categoryId URL-ში, მაშინ პირდაპირ set-ს ვიღებთ
  const shouldUseCategoryComplete = !!categoryIdFromUrl;
  
  // Hook-ები conditionally
  const { categoryData, loading: categoryLoading, error: categoryError } = useCategoryComplete(
    shouldUseCategoryComplete ? categoryIdFromUrl : ''
  );
  
  // ალტერნატიული: პირდაპირ set-ის მოძიება
  const { set: directSet, loading: setLoading, error: setError } = useSet(
    shouldUseCategoryComplete ? '' : setId
  );

  // საბოლოო loading და error states
  const loading = shouldUseCategoryComplete ? categoryLoading : setLoading;
  const error = shouldUseCategoryComplete ? categoryError : setError;

  // Set-ის მონაცემების მიღება
  let rawSetData;
  if (shouldUseCategoryComplete && categoryData) {
    // კატეგორიიდან ვეძებთ set-ს
    rawSetData = categoryData.sets?.find(set => set._id === setId);
  } else if (!shouldUseCategoryComplete && directSet) {
    // პირდაპირ set
    rawSetData = directSet;
  }

  // ვიღებთ სავარჯიშოებს
  const { exercises, loading: exercisesLoading } = useExercisesBySet(setId);

  // ვითვლით სავარჯიშოების რაოდენობას სირთულის მიხედვით
  const exercisesByDifficulty = exercises?.reduce((acc, exercise) => {
    acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });


  // ვითვლით ჯამურ ხანგრძლივობას
  const totalDurationInMinutes = exercises?.reduce((total: number, exercise: any) => {
    const duration = exercise.duration || "0:00";
    const [minutes, seconds] = duration.split(":").map(Number);
    return total + minutes + (seconds || 0) / 60;
  }, 0) || 0;

  // ვაფორმატებთ ხანგრძლივობას "HH:MM" ფორმატში
  const formattedTotalDuration = `${Math.floor(totalDurationInMinutes)}:${String(Math.round((totalDurationInMinutes % 1) * 60)).padStart(2, '0')}`;

  // ვამატებთ დათვლილ მონაცემებს setData-ში
  const setData = rawSetData ? {
    ...rawSetData,
    totalExercises: exercises?.length || 0,
    totalDuration: formattedTotalDuration,
    exercises // ვამატებთ სავარჯიშოების სრულ სიას
  } : null;

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

  const handleSubscriptionSelect = (period: string, price: number) => {
    if (!setData) return;
    
    const cartItem = {
      id: setId,
      type: 'subscription',
      name: setData.name,
      price: price,
      period: period,
      image: '/assets/images/course.png',
      description: setData.description,
      totalExercises: setData.totalExercises,
      totalDuration: setData.totalDuration
    };

    // Get existing cart or initialize empty array
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item
    cart.push(cartItem);
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to shopping cart
    window.location.href = '/shoppingcard';
  };

  return (
    <div>
      <Header variant="complex" onPriceClick={() => setPopoverOpen(true)} setData={setData} />
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
                  <div 
                    className="font-[Pt] text-[18px] leading-[120%] text-[#846FA0] mt-10"
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedText(setData.additional, locale) || ''
                    }}
                  />
                </div>
              )}
              {activeTabIndex === 2 && (
                <div className="text-lg text-[rgba(61,51,74,1)]">
                  <h1 className="md:text-[40px] leading-[120%] tracking-[-3%] mb-5">
                    Демо-видео
                  </h1>
                  <div className="rounded-[15px] overflow-hidden shadow-lg">
                    <ReactPlayer
                      src={setData.demoVideoUrl || '/videos/hero.mp4'}
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
                    {exercisesByDifficulty?.easy || 0} упражнений
                  </span>
                </div>
                <Link 
                  href={{
                    pathname: '/player',
                    query: { 
                      setId,
                      difficulty: 'easy',
                      exercises: JSON.stringify(exercises?.filter(ex => ex.difficulty === 'easy')),
                      set: JSON.stringify(setData)
                    }
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
                {popoverOpen && (
                  <div
                    ref={popoverRef}
                    className="absolute right-0 -top-72 mt-2 bg-white shadow-lg rounded-2xl p-0 min-w-[320px] max-w-[90vw] border border-purple-200 z-20 flex flex-col items-stretch"
                  >
                    {/* 1 месяц */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)]">
                      <span 
                        onClick={() => handleSubscriptionSelect('1 month', setData.discountedPrice?.monthly || setData.price.monthly)}
                        className="font-bold cursor-pointer text-[18px] leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        1 месяц
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] cursor-pointer font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {setData.discountedPrice?.monthly ? (
                            <>
                              {setData.discountedPrice.monthly} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.monthly} ₽/мес
                              </span>
                            </>
                          ) : (
                            <>
                              {setData.price.monthly} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.monthly} ₽/мес
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {/* 3 месяца - highlight */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)] bg-[rgba(132,111,160,0.08)]">
                      <span 
                        onClick={() => handleSubscriptionSelect('3 months', setData.discountedPrice?.threeMonths || setData.price.threeMonths)}
                        className="font-bold cursor-pointer text-[18px] leading-[120%] tracking-[-2%] text-[rgba(132,111,160,1)] uppercase">
                        3 месяца
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] cursor-pointer font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {setData.discountedPrice?.threeMonths ? (
                            <>
                              {setData.discountedPrice.threeMonths} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.threeMonths} ₽/мес
                              </span>
                            </>
                          ) : (
                            <>
                              {setData.price.threeMonths} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.monthly * 3} ₽/мес
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {/* 6 месяцев */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(132,111,160,0.12)]">
                      <span 
                        onClick={() => handleSubscriptionSelect('6 months', setData.discountedPrice?.sixMonths || setData.price.sixMonths)}
                        className="font-bold text-[18px] cursor-pointer leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        6 месяцев
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] cursor-pointer font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {setData.discountedPrice?.sixMonths ? (
                            <>
                              {setData.discountedPrice.sixMonths} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.sixMonths} ₽/мес
                              </span>
                            </>
                          ) : (
                            <>
                              {setData.price.sixMonths} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.monthly * 6} ₽/мес
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {/* 12 месяцев */}
                    <div className="flex justify-between items-center px-6 py-4">
                      <span 
                        onClick={() => handleSubscriptionSelect('12 months', setData.discountedPrice?.yearly || setData.price.yearly)}
                        className="font-bold text-[18px] cursor-pointer leading-[120%] tracking-[-2%] text-[rgba(61,51,74,1)] uppercase">
                        12 месяцев
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] cursor-pointer font-bold text-[rgba(132,111,160,1)] leading-[120%]">
                          {setData.discountedPrice?.yearly ? (
                            <>
                              {setData.discountedPrice.yearly} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.yearly} ₽/мес
                              </span>
                            </>
                          ) : (
                            <>
                              {setData.price.yearly} ₽/мес
                              <span className="text-[14px] text-[rgba(132,111,160,0.5)] line-through block">
                                {setData.price.monthly * 12} ₽/мес
                              </span>
                            </>
                          )}
                        </span>
                      </div>
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
                    {exercisesByDifficulty?.medium || 0} упражнений
                  </span>
                  {setData.levels.intermediate.isLocked && (
                    <CiLock
                      color="#846FA0"
                      className="absolute right-8"
                      size={24}
                    />
                  )}
                </div>
                {!setData.levels.intermediate.isLocked && (
                  <Link 
                    href={{
                      pathname: '/player',
                      query: { 
                        setId,
                        difficulty: 'medium',
                        exercises: JSON.stringify(exercises?.filter(ex => ex.difficulty === 'medium')),
                        set: JSON.stringify(setData)
                      }
                    }}
                  >
                    <CiPlay1 width={19.28} height={25.44} />
                  </Link>
                )}
              </div>

              {/* Advanced Level */}
              <div className="bg-[rgba(249,247,254,1)] p-5 rounded-[10px] flex justify-between items-center">
                <div className="flex md:flex-row md:gap-[40px] flex-col md:items-center">
                  <h3 className="text-[rgba(132,111,160,1)] md:text-2xl text-[18px] leading-[120%] tracking-[-3%] uppercase">
                    Продвинутый уровень
                  </h3>
                  <span className="text-[rgba(132,111,160,1)] md:text-[14px] text-xs leading-[90%] tracking-[0%] uppercase">
                    {exercisesByDifficulty?.hard || 0} упражнений
                  </span>
                  {setData.levels.advanced.isLocked && (
                    <CiLock
                      color="#846FA0"
                      className="absolute right-8"
                      size={24}
                    />
                  )}
                </div>
                {!setData.levels.advanced.isLocked && (
                  <Link 
                    href={{
                      pathname: '/player',
                      query: { 
                        setId,
                        difficulty: 'hard',
                        exercises: JSON.stringify(exercises?.filter(ex => ex.difficulty === 'hard')),
                        set: JSON.stringify(setData)
                      }
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
          <WorksSlider title="Может понравиться" seeAll={true} works={[]} fromMain={false} />
        </div>
        <div className="md:my-10">
          <Blog
            withBanner={false}
            withSlider={true}
            layoutType="default"
            title={"GRS МЕДИА"}
          />
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col items-center justify-center min-w-[250px] min-h-[120px]">
            <h2 className="text-xl font-bold mb-4">Модальное окно</h2>
            <p>Здесь будет ваш контент (например, видео ან სხვა ინფორმაცია).</p>
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Complex; 