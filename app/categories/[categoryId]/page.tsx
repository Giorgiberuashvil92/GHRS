"use client";

import { use, useMemo } from "react";
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

  // საათების გამოთვლა (როგორც subcategory-ს გვერდზე) - early return-ის წინ
  const calculateTotalHours = useMemo(() => {
    if (!categoryData?.sets || categoryData.sets.length === 0) {
      return 0;
    }
    
    const subcategoriesCount = categoryData?.subcategories?.length || 0;
    const setsToCalculate = subcategoriesCount > 0
      ? categoryData.sets.filter((set: any) => !set.subCategoryId) || []
      : categoryData.sets || [];
    
    if (!setsToCalculate || setsToCalculate.length === 0) {
      return 0;
    }
    
    const totalMinutes = setsToCalculate.reduce((acc: number, set: any) => {
      let setMinutes = 0;
      
      if (set.totalDuration && set.totalDuration !== "00:00") {
        const parts = set.totalDuration.split(':').map(Number);
        
        if (parts.length === 3) {
          const [hours, mins, secs] = parts;
          setMinutes = hours * 60 + mins + secs / 60;
        } else if (parts.length === 2) {
          const [mins, secs] = parts;
          setMinutes = mins + secs / 60;
        }
      } else if (set.exercises && set.exercises.length > 0) {
        setMinutes = set.exercises.reduce((exerciseAcc: number, exercise: any) => {
          let exerciseMinutes = 0;
          
          if (exercise.videoDuration) {
            const videoDur = String(exercise.videoDuration).trim();
            if (videoDur && videoDur !== "0" && videoDur !== "00:00" && videoDur !== "0:00") {
              const parts = videoDur.split(':').map(Number).filter(n => !isNaN(n));
              if (parts.length === 3) {
                const [hours, mins, secs] = parts;
                exerciseMinutes = hours * 60 + mins + secs / 60;
              } else if (parts.length === 2) {
                const [mins, secs] = parts;
                exerciseMinutes = mins + secs / 60;
              } else if (parts.length === 1) {
                exerciseMinutes = parts[0] / 60;
              }
            }
          }
          
          if (exerciseMinutes === 0 && exercise.duration) {
            const dur = String(exercise.duration).trim();
            if (dur && dur !== "0" && dur !== "00:00" && dur !== "0:00") {
              const parts = dur.split(':').map(Number).filter(n => !isNaN(n));
              if (parts.length === 2) {
                const [mins, secs] = parts;
                exerciseMinutes = mins + secs / 60;
              } else if (parts.length === 1) {
                exerciseMinutes = parts[0] / 60;
              }
            }
          }
          
          return exerciseAcc + exerciseMinutes;
        }, 0);
      }
      
      return acc + setMinutes;
    }, 0);
    
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    return totalHours;
  }, [categoryData?.sets, categoryData?.subcategories]);

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

  const setsCount = categoryData?.sets?.length || 0;
  const subcategoriesCount = categoryData?.subcategories?.length || 0;
  


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
  // - თუ subcategories აქვს: მხოლოდ პოპულარული სეტები (isPopular: true)
  // - თუ subcategories არ აქვს: ყველა სეტი, რომელიც პირდაპირ კატეგორიას ეკუთვნის (როგორც subcategory-ს გვერდზე)
  const popularSets = subcategoriesCount > 0
    ? (categoryData?.sets
        ?.filter((set: any) => set.isPopular)
        .map(formatSet) || [])
    : (categoryData?.sets
        ?.filter((set: any) => !set.subCategoryId) // ყველა სეტი, რომელსაც არ აქვს subcategory
        .map(formatSet) || []);

  // დაჯგუფება ქვეკატეგორიების მიხედვით (მხოლოდ თუ აქვს subcategories)
  const setsBySubcategory = subcategoriesCount > 0 
    ? (categoryData?.subcategories?.map((subcategory: any) => {
        const subcategorySets = categoryData?.sets
          ?.filter((set: any) => set.subCategoryId === subcategory._id)
          .map(formatSet) || [];
        
        return {
          subcategory,
          sets: subcategorySets,
        };
      }).filter((group: any) => group.sets.length > 0) || [])
    : [];

  // სეტები რომლებსაც არ აქვთ ქვეკატეგორია
  const directSets = categoryData?.sets
    ?.filter((set: any) => !set.subCategoryId && !set.isPopular)
    .map(formatSet) || [];

  // სეტები Works კომპონენტისთვის:
  // - თუ subcategories აქვს: მხოლოდ ის სეტები, რომლებსაც არ აქვთ subcategory (პირდაპირ კატეგორიას ეკუთვნის)
  // - თუ subcategories არ აქვს: ყველა სეტი (რადგან ყველა პირდაპირ კატეგორიას ეკუთვნის)
  // ⚠️ Works კომპონენტი იღებს raw sets-ს და თავად ფორმატირებს, ამიტომ უნდა დავამატოთ category ინფორმაცია
  const setsForWorks = (subcategoriesCount > 0
    ? categoryData?.sets?.filter((set: any) => !set.subCategoryId) || []
    : categoryData?.sets || []
  ).map((set: any) => ({
    ...set,
    category: set.category || selectedCategory, // დავამატოთ category თუ არ აქვს
  }));

  // ⚠️ დებაგინგი subcategory-ების გარეშე
  if (subcategoriesCount === 0) {
    console.log("⚠️ No subcategories found for this category.");
    console.log("📦 Total sets:", setsCount);
    console.log("📦 Popular sets:", popularSets.length);
    console.log("📦 Sets for Works (all sets):", setsForWorks.length);
    console.log("📦 Direct sets (without subcategory):", directSets.length);
    console.log("📋 Sets for Works details:", setsForWorks.map((set: any) => ({
      id: set._id,
      title: getLocalizedText(set?.name, locale),
      hasSubCategory: !!set.subCategoryId,
      isPopular: set.isPopular || false
    })));
  }

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
        customBlockTitle={getLocalizedText(selectedCategory?.name, locale)?.toUpperCase()}
        customBlockDescription={getLocalizedText(selectedCategory?.description, locale)}
        hideBlock={false}
        hideHeaderText={false}
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

        {/* ✅ EXERCISES Section - All Sets/Complexes */}
        {setsForWorks && setsForWorks.length > 0 && (
          <Works
            title={getLocalizedText(selectedCategory?.name, locale)?.toUpperCase() || t("common.exercises")?.toUpperCase() || "EXERCISES"}
            sets={setsForWorks as any}
            fromMain={false}
            customMargin=""
            customBorderRadius=""
            seeAll={true}
            scrollable={true}
            totalCount={setsForWorks.length}
            linkHref="/allComplex"
            showTopLink={true}
          />
        )}

        {/* პოპულარული ვარჯიშები */}


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
        <div className="mb-10">
          <Blog
            withBanner={true}
            withSlider={true}
            layoutType="default"
            title={t("navigation.blog")}
            showCategories={false}
          />
        </div>
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
