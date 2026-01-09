"use client";

import { use } from "react";
import { useCategoryComplete } from "../../hooks/useCategoryComplete";
import Image from "next/image";
import Link from "next/link";
// import Header from "../../components/Header/Header";
import SliderArrows from "../../components/SliderArrows";
import WorksSlider from "../../components/WorksSlider";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Professional from "../../components/Professional";
import Blog from "@/app/components/Blog";
import { useI18n } from "../../context/I18nContext";
import { Footer } from "@/app/components/Footer";
import MainHeader from "@/app/components/Header/MainHeader";
import Section from "../../components/Section";
import Works from "../../components/Works";
// import DesktopNavbar from "@/app/components/Navbar/DesktopNavbar";

export default function CategoriesPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);
  const { categoryData, loading, error } = useCategoryComplete(categoryId);
  const { t } = useI18n();



  const selectedCategory = categoryData?.category;

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

  if (error || !selectedCategory) {
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

  // ამოვიღოთ რაოდენობები
  const setsCount = categoryData?.sets?.length || 0;
  const subcategoriesCount = categoryData?.subcategories?.length || 0;
  
  // 🔍 DEBUG: დალოგვა categoryData-ს
  console.log("📊 Category Page Debug:", {
    categoryId,
    setsCount,
    subcategoriesCount,
    exercisesFromArray: categoryData?.exercises?.length,
    sets: categoryData?.sets?.map((set: any) => ({
      setId: set._id,
      setName: set.name,
      exercisesArray: set.exercises,
      exercisesArrayLength: set.exercises?.length,
      totalExercises: set.totalExercises,
      calculated: set.exercises?.length || set.totalExercises || 0
    }))
  });
  
  // სავარჯიშოების რაოდენობა - ვიყენებთ exercises მასივს, რომელიც აბრუნებს backend-ი
  // ან თუ არ არის, ვითვლით სეტების exercises მასივების ჯამს
  const exercisesCount = categoryData?.exercises?.length || 
    categoryData?.sets?.reduce(
      (total, set: any) => {
        const setExercises = set.exercises?.length || set.totalExercises || 0;
        console.log(`🔢 Set ${set._id}: exercises.length=${set.exercises?.length}, totalExercises=${set.totalExercises}, calculated=${setExercises}`);
        return total + setExercises;
      },
      0
    ) || 0;
  
  console.log("✅ Final exercisesCount:", exercisesCount);

  // ფორმატირების ფუნქცია
  const formatSet = (set: any) => ({
    id: set._id,
    title: getLocalizedText(set?.name, locale),
    description: getLocalizedText(set?.description, locale),
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.totalExercises || 0,
    categoryName: getLocalizedText(selectedCategory?.name, locale),
    price: `${set.price?.monthly || 920}₾/თვე`,
    monthlyPrice: set.price?.monthly || 920,
    categoryId: categoryId,
    subcategoryId: set.subCategoryId || "",
    isPopular: set.isPopular || false,
  });

  // პოპულარული სეტები
  const popularSets = categoryData?.sets
    ?.filter((set: any) => set.isPopular)
    .map(formatSet) || [];

  // დაჯგუფება ქვეკატეგორიების მიხედვით
  const setsBySubcategory = categoryData?.subcategories?.map((subcategory: any) => {
    const subcategorySets = categoryData?.sets
      ?.filter((set: any) => set.subCategoryId === subcategory._id)
      .map(formatSet) || [];
    
    return {
      subcategory,
      sets: subcategorySets,
    };
  }).filter((group: any) => group.sets.length > 0) || [];

  // სეტები რომლებსაც არ აქვთ ქვეკატეგორია
  const directSets = categoryData?.sets
    ?.filter((set: any) => !set.subCategoryId && !set.isPopular)
    .map(formatSet) || [];

  return (
    <div className="">
      {/* <Header
        variant="categories"
        title={getLocalizedText(selectedCategory?.name, locale)}
        description={getLocalizedText(selectedCategory?.description, locale)}
        info={{
          setsCount,
          subcategoriesCount,
          exercisesCount,
        }}
      /> */}
      <MainHeader 
        ShowBlock={false} 
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
                src="/assets/icons/Pulse.png" 
                alt="Subcategories" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            ),
            value: subcategoriesCount,
            label: t("common.subcategories")
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
          }
        ]} 
        showArrows={false} 
        complexData={null}
        useVideo={true}
        customBlockTitle={getLocalizedText(selectedCategory?.name, locale)?.toUpperCase()}
      />
      <div className="md:pt-[100px] pt-[400px]">
        {/* SHOW: Subcategories section */}
        {subcategoriesCount > 0 && (
        <div className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] md:mb-10 mx-6">
          <div className="flex items-center justify-between mb-[20px]">
            <div className="flex flex-col gap-5">
              <h1 className="text-[#3D334A] text-[48px] md:text-[64px] leading-[100%] tracking-[-1%] font-bold font-bowler uppercase">
                {t("common.subcategories")}
              </h1>
              <Link href="/subcategories" className="hover:opacity-80 transition-opacity cursor-pointer">
                <span className="font-bowler text-[#D4BAFC] text-[20px] md:text-[24px] leading-[90%] uppercase">
                  {t("buttons.show_all") || "Смотреть все"} →
                </span>
              </Link>
            </div>
            <div>
              <SliderArrows
                onScrollLeft={() => {
                  const slider = document.getElementById(
                    "subcategories-slider"
                  );
                  if (slider) {
                    slider.scrollBy({ left: -500, behavior: "smooth" });
                  }
                }}
                onScrollRight={() => {
                  const slider = document.getElementById(
                    "subcategories-slider"
                  );
                  if (slider) {
                    slider.scrollBy({ left: 500, behavior: "smooth" });
                  }
                }}
              />
            </div>
          </div>

          <div
            id="subcategories-slider"
            className="flex flex-row items-center gap-[28px] overflow-x-auto"
          >
            {categoryData?.subcategories?.map((subcategory) => (
              <Link
                key={subcategory._id}
                href={`/categories/section?categoryId=${categoryId}&subcategoryId=${subcategory._id}`}
                className="mt-[48px] min-w-[558px] bg-white p-2 rounded-[20px] cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Image
                  src={subcategory.image || "/assets/images/category1.png"}
                  width={542}
                  height={181}
                  alt={getLocalizedText(
                    subcategory.name as { ka: string; en: string; ru: string },
                    locale
                  )}
                  className="w-full h-[181px] object-cover rounded-[15px]"
                />
                <div className="flex items-center justify-between mt-[22px]">
                  <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
                    {getLocalizedText(
                      subcategory.name as {
                        ka: string;
                        en: string;
                        ru: string;
                      },
                      locale
                    )}
                  </h1>
                  <span className="text-[#D4BAFC] leading-[120%] font-medium">
                    {
                      categoryData?.sets?.filter(
                        (set: any) => set.subCategoryId === subcategory._id
                      ).length || 0
                    }{" "}
                    {t("common.sets")}
                  </span>
                </div>
              </Link>
            )) || []}
          </div>
        </div>
        )}

        {/* ✅ EXERCISES Section - All Sets/Complexes */}
        {categoryData?.sets && categoryData.sets.length > 0 && (
          <Works
            title={t("common.exercises")?.toUpperCase() || t("header.exercises_count", { count: String(exercisesCount) }).replace(/\d+\s*/, "").toUpperCase() || "EXERCISES"}
            sets={categoryData.sets as any}
            fromMain={false}
            customMargin=""
            customBorderRadius=""
            seeAll={true}
            scrollable={true}
            totalCount={categoryData.sets.length}
            linkHref="/allComplex"
            showTopLink={true}
          />
        )}

        {/* პოპულარული ვარჯიშები */}
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

        {/* ✅ HIDDEN: ქვეკატეგორიების მიხედვით დაჯგუფებული სეტები - დამალულია */}
        {/* {setsBySubcategory.map((group: any, index: number) => (
          <div key={group.subcategory._id} className="mt-10 mb-10">
            <WorksSlider
              works={group.sets}
              linkType="complex"
              title={getLocalizedText(
                group.subcategory.name as { ka: string; en: string; ru: string },
                locale
              ).toUpperCase()}
              seeAll={false}
              categoryData={categoryData?.category?._id}
              fromMain={false}
              scrollable={true}
              sliderId={`subcategory-${group.subcategory._id}-slider`}
              showTopLink={false}
            />
          </div>
        ))} */}

        {/* ✅ HIDDEN: პირდაპირი სეტები (ქვეკატეგორიის გარეშე) - დამალულია */}
        {/* {directSets.length > 0 && (
          <div className="mt-10 mb-10">
            <WorksSlider
              works={directSets}
              linkType="complex"
              title={t("common.other_complexes") || "ДРУГИЕ КОМПЛЕКСЫ"}
              seeAll={false}
              categoryData={categoryData?.category?._id}
              fromMain={false}
              scrollable={true}
              sliderId="direct-sets-slider"
              showTopLink={false}
            />
          </div>
        )} */}

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
          <ReviewSlider title={""} />
        </div>
        <Blog
          withBanner={false}
          withSlider={true}
          layoutType="default"
          title={"GRS МЕДИА"}
          showCategories={false}
        />
        <div className="mt-10">
          <Professional
            withBanner={false}
            title={""}
            bgColor={"#F9F7FE"}
            withProfText={true}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}
