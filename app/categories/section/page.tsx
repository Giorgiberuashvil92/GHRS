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

  const subcategorySets =
    categoryData?.sets?.filter((set) => set.subCategoryId === subcategoryId) ||
    [];

  // Calculate total hours from subcategory sets (must be before early returns)
  const calculateTotalHours = useMemo(() => {
    if (!subcategorySets || subcategorySets.length === 0) {
      console.log("⏰ No subcategorySets for hours calculation");
      return 0;
    }
    
    console.log("⏰ Calculating hours from sets:", subcategorySets.map((set: any) => ({
      setId: set._id?.substring(0, 8),
      totalDuration: set.totalDuration,
      hasDuration: !!set.totalDuration,
      exercisesCount: set.exercises?.length || 0
    })));
    
    const totalMinutes = subcategorySets.reduce((acc, set: any) => {
      let setMinutes = 0;
      
      if (set.totalDuration && set.totalDuration !== "00:00") {
        // Parse duration format "HH:MM:SS" or "MM:SS"
        const parts = set.totalDuration.split(':').map(Number);
        
        if (parts.length === 3) {
          // HH:MM:SS format
          const [hours, mins, secs] = parts;
          setMinutes = hours * 60 + mins + secs / 60;
          console.log(`⏰ Set ${set._id?.substring(0, 8)}...: ${set.totalDuration} = ${hours}h ${mins}m ${secs}s = ${setMinutes.toFixed(2)} minutes`);
        } else if (parts.length === 2) {
          // MM:SS format
          const [mins, secs] = parts;
          setMinutes = mins + secs / 60;
          console.log(`⏰ Set ${set._id?.substring(0, 8)}...: ${set.totalDuration} = ${mins}m ${secs}s = ${setMinutes.toFixed(2)} minutes`);
        } else {
          console.log(`⏰ Set ${set._id?.substring(0, 8)}...: Invalid duration format: ${set.totalDuration}`);
        }
      } 
      // თუ არ აქვს totalDuration ან არის "00:00", ვითვლით exercises-ის videoDuration-ების ჯამს
      else if (set.exercises && set.exercises.length > 0) {
        console.log(`⏰ Set ${set._id?.substring(0, 8)}...: Processing ${set.exercises.length} exercises`);
        
        // დეტალური ლოგი თითოეული exercise-ისთვის
        set.exercises.forEach((exercise: any, index: number) => {
          console.log(`  Exercise ${index + 1}:`, {
            id: exercise._id?.substring(0, 8),
            videoDuration: exercise.videoDuration,
            duration: exercise.duration,
            videoUrl: exercise.videoUrl,
            videoUrlEn: exercise.videoUrlEn,
            videoDurationType: typeof exercise.videoDuration,
            durationType: typeof exercise.duration
          });
        });
        
        setMinutes = set.exercises.reduce((exerciseAcc: number, exercise: any) => {
          let exerciseMinutes = 0;
          
          // პირველ რიგში ვცდილობთ videoDuration-ს
          if (exercise.videoDuration) {
            const videoDur = String(exercise.videoDuration).trim();
            if (videoDur && videoDur !== "0" && videoDur !== "00:00" && videoDur !== "0:00") {
              const parts = videoDur.split(':').map(Number).filter(n => !isNaN(n));
              if (parts.length === 3) {
                // HH:MM:SS format
                const [hours, mins, secs] = parts;
                exerciseMinutes = hours * 60 + mins + secs / 60;
                console.log(`  📹 Exercise ${exercise._id?.substring(0, 8)}...: videoDuration="${videoDur}" = ${hours}h ${mins}m ${secs}s = ${exerciseMinutes.toFixed(2)} minutes`);
              } else if (parts.length === 2) {
                // MM:SS format
                const [mins, secs] = parts;
                exerciseMinutes = mins + secs / 60;
                console.log(`  📹 Exercise ${exercise._id?.substring(0, 8)}...: videoDuration="${videoDur}" = ${mins}m ${secs}s = ${exerciseMinutes.toFixed(2)} minutes`);
              } else if (parts.length === 1) {
                // წამებში (number)
                exerciseMinutes = parts[0] / 60;
                console.log(`  📹 Exercise ${exercise._id?.substring(0, 8)}...: videoDuration="${videoDur}" (seconds) = ${exerciseMinutes.toFixed(2)} minutes`);
              } else {
                console.log(`  ⚠️ Exercise ${exercise._id?.substring(0, 8)}...: Invalid videoDuration format: "${videoDur}"`);
              }
            } else {
              console.log(`  ⚠️ Exercise ${exercise._id?.substring(0, 8)}...: videoDuration is empty or zero: "${videoDur}"`);
            }
          }
          
          // თუ videoDuration-ით არაფერი გამოვიდა, ვცდილობთ duration-ს
          if (exerciseMinutes === 0 && exercise.duration) {
            const dur = String(exercise.duration).trim();
            if (dur && dur !== "0" && dur !== "00:00" && dur !== "0:00") {
              const parts = dur.split(':').map(Number).filter(n => !isNaN(n));
              if (parts.length === 2) {
                const [mins, secs] = parts;
                exerciseMinutes = mins + secs / 60;
                console.log(`  ⏱️ Exercise ${exercise._id?.substring(0, 8)}...: duration="${dur}" = ${mins}m ${secs}s = ${exerciseMinutes.toFixed(2)} minutes`);
              } else if (parts.length === 1) {
                exerciseMinutes = parts[0] / 60;
                console.log(`  ⏱️ Exercise ${exercise._id?.substring(0, 8)}...: duration="${dur}" (seconds) = ${exerciseMinutes.toFixed(2)} minutes`);
              }
            }
          }
          
          if (exerciseMinutes === 0) {
            console.log(`  ❌ Exercise ${exercise._id?.substring(0, 8)}...: No valid duration found`);
          }
          
          return exerciseAcc + exerciseMinutes;
        }, 0);
        
        console.log(`⏰ Set ${set._id?.substring(0, 8)}...: Total = ${setMinutes.toFixed(2)} minutes (${(setMinutes / 60).toFixed(2)} hours)`);
      } else {
        console.log(`⏰ Set ${set._id?.substring(0, 8)}...: No totalDuration and no exercises`);
      }
      
      return acc + setMinutes;
    }, 0);
    
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
    console.log(`⏰ Total: ${totalMinutes.toFixed(2)} minutes = ${totalHours} hours`);
    
    return totalHours;
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
  
  // 🔍 DEBUG: დალოგვა subcategorySets-ის
  console.log("📊 Section Page Debug:", {
    subcategoryId,
    categoryId,
    setsCount,
    subcategorySets: subcategorySets.map((set: any) => ({
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
  const exercisesCount = 
    subcategorySets.reduce(
      (total, set: any) => {
        const setExercises = set.exercises?.length || set.totalExercises || 0;
        console.log(`🔢 Set ${set._id?.substring(0, 8)}...: exercises.length=${set.exercises?.length}, totalExercises=${set.totalExercises}, calculated=${setExercises}, runningTotal=${total + setExercises}`);
        return total + setExercises;
      },
      0
    ) || 0;
  
  console.log("✅ Final exercisesCount:", exercisesCount);
  console.log("📈 Summary:", {
    setsCount,
    exercisesCount,
    expectedTotal: subcategorySets.reduce((sum: number, set: any) => sum + (set.exercises?.length || 0), 0)
  });

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
