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
import {
  getSetExerciseCount,
  sumSetsDurationHours,
} from "@/app/utils/setDescriptionMeta";

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

  const subcategorySets = useMemo(() => {
    const currentSubCategoryId = String(subcategoryId || "");
    return (
      categoryData?.sets?.filter((set: any) => {
        const setSubCategoryId = set.subCategoryId
          ? typeof set.subCategoryId === "object"
            ? String(set.subCategoryId._id || set.subCategoryId)
            : String(set.subCategoryId)
          : "";
        return (
          setSubCategoryId === currentSubCategoryId ||
          setSubCategoryId === subcategoryId
        );
      }) || []
    );
  }, [categoryData?.sets, subcategoryId]);

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
    loc: string = "ru"
  ): string => {
    if (!field) return "";
    return (
      field[loc as keyof typeof field] ||
      field.ru ||
      field.en ||
      field.ka ||
      ""
    );
  };

  const locale = getLocale();

  const calculateTotalHours = useMemo(
    () => sumSetsDurationHours(subcategorySets),
    [subcategorySets]
  );

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

  // ამოვიღოთ რაოდენობები
  const setsCount = subcategorySets.length;
  
  // სავარჯიშოების რაოდენობა — description / totalExercises / exercises
  const exercisesCount = subcategorySets.reduce((total, set: any) => {
    return (
      total +
      getSetExerciseCount({
        description: getLocalizedText(set.description, locale),
        totalExercises: set.totalExercises,
        fallbackExerciseCount: set.exercises?.length,
      })
    );
  }, 0);

  // დებაგინგი - ყველა სეტის subCategoryId
  console.log('🔍 All sets subCategoryIds:', {
    subcategoryId,
    categoryId,
    allSets: categoryData?.sets?.map((set: any) => ({
      setId: set._id?.substring(0, 8),
      setName: getLocalizedText(set?.name, locale),
      subCategoryId: set.subCategoryId,
      subCategoryIdString: String(set.subCategoryId || ''),
      isPopular: set.isPopular,
      categoryId: set.categoryId
    })) || []
  });

  // ყველა სეტი ამ subcategory-იდან
  const popularSets = categoryData?.sets
    ?.filter((set: any) => {
      const setSubCategoryId = set.subCategoryId 
        ? (typeof set.subCategoryId === 'object' ? String(set.subCategoryId._id || set.subCategoryId) : String(set.subCategoryId))
        : '';
      const currentSubCategoryId = String(subcategoryId || '');
      
      const isSubCategoryMatch = setSubCategoryId === currentSubCategoryId || 
                                 setSubCategoryId === subcategoryId ||
                                 (set.subCategoryId && String(set.subCategoryId) === currentSubCategoryId);
      
      return isSubCategoryMatch;
    })
    .map((set: any) => ({
      id: set._id,
      title: getLocalizedText(set?.name, locale),
      description: getLocalizedText(set?.description, locale),
      image: set.thumbnailImage || "/assets/images/workMan.png",
      exerciseCount: set.totalExercises || 0,
      categoryName: getLocalizedText(
        selectedSubcategory?.name as { ka: string; en: string; ru: string },
        locale
      ) || getLocalizedText(
        categoryData?.category?.name as { ka: string; en: string; ru: string },
        locale
      ),
      price: `${set.price?.monthly || 920}₾/თვე`,
      monthlyPrice: set.price?.monthly || 920,
      categoryId: categoryId,
      subcategoryId: set.subCategoryId || "",
    })) || [];
  
  console.log('📊 Popular Sets Debug:', {
    subcategoryId,
    categoryId,
    totalSets: categoryData?.sets?.length || 0,
    popularSetsCount: popularSets.length,
    popularSets: popularSets.map((s: any) => ({
      id: s.id,
      title: s.title,
      subcategoryId: s.subcategoryId,
      exerciseCount: s.exerciseCount,
      price: s.price
    })),
    allPopularSetsDetails: popularSets
  });

  // ყველაზე ახალი სეტები ამ კატეგორიიდან (createdAt ან updatedAt-ის მიხედვით)
  const latestSets = categoryData?.sets
    ?.filter((set: any) => {
      // მხოლოდ ამ კატეგორიის სეტები, გამოვრიცხოთ პოპულარული და ამ subcategory-ის სეტები
      return set.categoryId === categoryId && !set.isPopular && set.subCategoryId !== subcategoryId;
    })
    .sort((a: any, b: any) => {
      // დავალაგოთ updatedAt-ის მიხედვით (ყველაზე ახალი პირველი)
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 10) // მხოლოდ 10 ყველაზე ახალი
    .map((set: any) => {
      // ვპოულობთ ამ სეტის subcategory-ს
      const setSubcategory = categoryData?.subcategories?.find(
        (sub: any) => sub._id === set.subCategoryId
      );
      
      return {
        id: set._id,
        title: getLocalizedText(set?.name, locale),
        description: getLocalizedText(set?.description, locale),
        image: set.thumbnailImage || "/assets/images/workMan.png",
        exerciseCount: set.totalExercises || 0,
        categoryName: getLocalizedText(
          setSubcategory?.name as { ka: string; en: string; ru: string },
          locale
        ) || getLocalizedText(
          categoryData?.category?.name as { ka: string; en: string; ru: string },
          locale
        ),
        price: `${set.price?.monthly || 920}₾/თვე`,
        monthlyPrice: set.price?.monthly || 920,
        categoryId: categoryId,
        subcategoryId: set.subCategoryId || "",
      };
    }) || [];

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
                src="/assets/icons/Book.png" 
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
                src="/assets/icons/Video.png" 
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
                src="/assets/icons/Pulse.png" 
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
      <div className="md:pt-[20px] pt-[400px]">
      {popularSets.length > 0 && (
          <div className="mt-10 mb-10">
            <WorksSlider
              works={popularSets}
              linkType="complex"
              title={t("common.popular_exercises") || "ПОПУЛЯРНЫЕ УПРАЖНЕНИЯ"}
              seeAll={false}
              categoryData={categoryData?.category?._id}
              fromMain={false}
              scrollable={true}
              sliderId="popular-exercises-slider"
              showTopLink={false}
            />
          </div>
        )}

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
       
        {/* Latest/New Content Section */}
       

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
        <div className="mb-10">
          <Blog
            withBanner={true}
            withSlider={true}
            layoutType="default"
            title={t("navigation.blog")}
            showCategories={false}
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
