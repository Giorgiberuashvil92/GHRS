"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCategoryComplete } from "../../hooks/useCategoryComplete";
import Header from "../../components/Header/Header";
import MainHeader from "@/app/components/Header/MainHeader";
import WorksSlider from "../../components/WorksSlider";
import Works from "../../components/Works";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Professional from "../../components/Professional";
import Blog from "@/app/components/Blog";
import { useI18n } from "../../context/I18nContext";
import Image from "next/image";
// import { BackendExercise } from "@/types/exercise";
import { Footer } from "@/app/components/Footer";

function SectionContent() {
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const { t } = useI18n();

  // ვიყენებთ categoryComplete hook-ს მთავარი კატეგორიისთვის
  const { categoryData, loading, error } = useCategoryComplete(categoryId);

  // ვპოულობთ ამ კონკრეტულ subcategory-ს
  const selectedSubcategory = categoryData?.subcategories?.find(
    (sub) => sub._id === subcategoryId
  );

  // ვპოულობთ ამ subcategory-ს სეტებს
  const subcategorySets =
    categoryData?.sets?.filter((set) => set.subCategoryId === subcategoryId) ||
    [];

  // Calculate total hours from subcategory sets (must be before early returns)
  const calculateTotalHours = useMemo(() => {
    if (!subcategorySets || subcategorySets.length === 0) return 0;
    
    const totalMinutes = subcategorySets.reduce((acc, set) => {
      if (!set.totalDuration) return acc;
      
      // Parse duration format "HH:MM:SS" or "MM:SS"
      const parts = set.totalDuration.split(':').map(Number);
      let minutes = 0;
      
      if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, mins, secs] = parts;
        minutes = hours * 60 + mins + secs / 60;
      } else if (parts.length === 2) {
        // MM:SS format
        const [mins, secs] = parts;
        minutes = mins + secs / 60;
      }
      
      return acc + minutes;
    }, 0);
    
    return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
  }, [subcategorySets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
            {t("common.category_loading")}
          </h2>
        </div>
      </div>
    );
  }

  if (error || !selectedSubcategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-cinzel font-bold text-red-600 mb-4">
            {t("common.category_error")}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || t("common.category_not_found")}
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

  const locale = getLocale();

  // ამოვიღოთ რაოდენობები
  const setsCount = subcategorySets.length;
  const exercisesCount = subcategorySets.reduce(
    (total, set) => total + (set.totalExercises || 0),
    0
  );

  // Helper function to get localized text (moved before usage)
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

  // პოპულარული სეტები მთელი კატეგორიიდან
  const popularSets = categoryData?.sets
    ?.filter((set: any) => set.isPopular)
    .map((set: any) => ({
      id: set._id,
      title: getLocalizedText(set?.name, locale),
      description: getLocalizedText(set?.description, locale),
      image: set.thumbnailImage || "/assets/images/workMan.png",
      exerciseCount: set.totalExercises || 0,
      categoryName: getLocalizedText(
        categoryData?.category?.name as { ka: string; en: string; ru: string },
        locale
      ),
      price: `${set.price?.monthly || 920}₾/თვე`,
      monthlyPrice: set.price?.monthly || 920,
      categoryId: categoryId,
      subcategoryId: set.subCategoryId || "",
    })) || [];

  // გარდავქმნით სეტებს WorksSlider-ის ფორმატში
  const formattedSets = subcategorySets.map((set) => ({
    id: set._id,
    title: getLocalizedText(set?.name, locale),
    description: getLocalizedText(set?.description, locale),
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.totalExercises || 0,
    categoryName: getLocalizedText(
      selectedSubcategory?.name as { ka: string; en: string; ru: string },
      locale
    ),
    price: `${set.price?.monthly || 920}₾/თვე`,
    monthlyPrice: set.price?.monthly || 920,
    categoryId: categoryId,
    subcategoryId: subcategoryId,
  }));

  return (
    <div className="">
      {/* <Header
        variant="categories"
        title={getLocalizedText(
          selectedSubcategory?.name as { ka: string; en: string; ru: string },
          locale
        )}
        info={{
          setsCount,
          subcategoriesCount: 0, // subcategory-ს ქვეკატეგორიები არ აქვს
          exercisesCount,
        }}
      /> */}
      <MainHeader 
        ShowBlock={false} 
        OptionalComponent={null} 
        stats={[
          {
            icon: (
              <Image 
                src="/assets/icons/Video.png" 
                alt="Complexes" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            ),
            value: setsCount,
            label: t("common.complexes")
          },
          {
            icon: (
              <Image 
                src="/assets/icons/Pulse.png" 
                alt="Exercises" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            ),
            value: exercisesCount,
            label: t("common.exercises")
          },
          {
            icon: (
              <Image 
                src="/assets/icons/Book.png" 
                alt="Hours" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            ),
            value: calculateTotalHours,
            label: t("common.hours") || t("header.hours_count", { count: String(calculateTotalHours) }).replace(/\d+\s*/, "")
          }
        ]} 
        showArrows={false} 
        complexData={null}
        useVideo={true}
        customBlockTitle={getLocalizedText(
          selectedSubcategory?.name as { ka: string; en: string; ru: string },
          locale
        )?.toUpperCase()}
        customBlockDescription={getLocalizedText(
          selectedSubcategory?.description as { ka: string; en: string; ru: string } | undefined,
          locale
        )}
        hideBlock={false}
        hideHeaderText={false}
      />
      <div className="md:pt-[100px] pt-[400px]">
        {Array.isArray(formattedSets) && formattedSets.length > 0 && (
          <div className="md:mb-10">
            <WorksSlider
              title={getLocalizedText(
                selectedSubcategory?.name as {
                  ka: string;
                  en: string;
                  ru: string;
                },
                locale
              )}
              works={formattedSets}
              linkType="complex"
              fromMain={false}
              seeAll={false}
              scrollable={true}
            />
          </div>
        )}

        {formattedSets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-cinzel text-gray-600 mb-2">
              {t("common.no_sets_found")}
            </h3>
            <p className="text-gray-500">{t("common.no_sets_description")}</p>
          </div>
        )}

        {/* Popular Exercises Section */}
        {popularSets.length > 0 && (
          <div className="mt-10 mb-10">
            <WorksSlider
              works={popularSets}
              linkType="complex"
              title={t("common.popular_exercises") || "ПОПУЛЯРНЫЕ УПРАЖНЕНИЯ"}
              seeAll={false}
              categoryData={categoryId}
              fromMain={false}
              scrollable={true}
              sliderId="popular-exercises-slider"
              showTopLink={false}
            />
          </div>
        )}

        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.title"
          buttonTextKey="buttons.subscribe"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
          
        />
        <div className="my-10">
          <ReviewSlider title={"ОТЗЫВЫ О НАС"} />
        </div>
        <div
          className="mb-10
        "
        >
          <Blog
            withBanner={false}
            withSlider={true}
            layoutType="default"
            title={getLocalizedText(
              selectedSubcategory?.name as {
                ka: string;
                en: string;
                ru: string;
              },
              locale
            )}
          />
        </div>

        <Professional
          withBanner={false}
          title={""}
          bgColor={"#F9F7FE"}
          withProfText={true}
        />
      </div>
      <Footer />
    </div>
  );
}

export default function SectionPage() {
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
      <SectionContent />
    </Suspense>
  );
}
