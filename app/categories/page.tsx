"use client";
import { useCategories } from "../hooks/useCategories";
import { useAllSets } from "../hooks/useSets";
import Header from "../components/Header/Header";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Professional from "../components/Professional";
import Blog from "../components/Blog";
import Section from "../components/Section";
import { Footer } from "../components/Footer";
import MainHeader from "../components/Header/MainHeader";
import { useI18n } from "../context/I18nContext";
import Image from "next/image";

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { sets, loading: setsLoading, error: setsError } = useAllSets();
  const { t, locale } = useI18n();

  console.log("📊 Categories Page Data:");
  console.log("  Total categories:", categories.length);
  console.log("  Categories:", categories);
  console.log("  Total sets:", sets.length);
  console.log("  Sets:", sets);

  // Helper to get localized string
  const getLocalized = (value: any): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && locale in value) {
      return value[locale] || value.ru || value.en || value.ka || "";
    }
    return "";
  };

  // Get all subcategories in two ways:
  // 1. Categories with parentId (if backend has them)
  const subcategoriesWithParentId = categories.filter((cat: any) => cat.parentId);
  
  // 2. Get subcategory IDs from main categories' subcategories array
  const mainCategories = categories.filter((cat: any) => !cat.parentId);
  const subcategoryIdsFromMain = mainCategories.flatMap((cat: any) => cat.subcategories || []);
  
  // Find actual subcategory objects by ID
  const subcategoriesFromIds = categories.filter((cat: any) => 
    subcategoryIdsFromMain.includes(cat._id)
  );
  
  // Combine both methods (deduplicate by ID)
  const allSubcategoriesRaw = [...subcategoriesWithParentId, ...subcategoriesFromIds];
  const uniqueSubcategoryIds = new Set<string>();
  const allSubcategories = allSubcategoriesRaw
    .filter((cat: any) => {
      if (uniqueSubcategoryIds.has(cat._id)) return false;
      uniqueSubcategoryIds.add(cat._id);
      return true;
    })
    .map((cat: any) => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      image: cat.image || undefined,
      sets: cat.sets || [],
      categoryId: cat.parentId || cat.categoryId,
    }));

  console.log("🔍 Subcategories Analysis:");
  console.log("  Total categories from API:", categories.length);
  console.log("  Categories with parentId:", categories.filter((cat: any) => cat.parentId).length);
  console.log("  Categories WITHOUT parentId:", categories.filter((cat: any) => !cat.parentId).length);
  console.log("  Transformed subcategories:", allSubcategories.length);
  console.log("  Subcategories data:", allSubcategories);
  console.log("  All categories:", categories);

  // ✅ Use real subcategories from API, or show message if none exist
  const displaySubcategories = allSubcategories;
  
  console.log("📌 Displaying subcategories:", displaySubcategories.length, "items (REAL API data only)");
  
  // If no subcategories, show a message to admin
  if (displaySubcategories.length === 0) {
    console.warn("⚠️ No subcategories found in database. Please create subcategories in admin panel.");
  }

  // Transform sets data for WorksSlider
  const transformedSets = sets.map((set: any) => ({
    id: set._id,
    title: getLocalized(set.name),
    description: getLocalized(set.description),
    price: `${set.price?.monthly || 0} ₽/мес`,
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.totalExercises || 0,
    categoryName: getLocalized(set.category?.name),
    monthlyPrice: set.price?.monthly || 0,
    categoryId: set.categoryId || set._id,
  }));

  // Loading state
  const loading = categoriesLoading || setsLoading;
  const error = categoriesError || setsError;

  if (loading) {
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-cinzel font-bold text-red-600 mb-4">
            {t("common.error")}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  // Calculate statistics
  const subcategoriesCount = displaySubcategories.length;
  const setsCount = sets.length;
  const exercisesCount = sets.reduce((total: number, set: any) => total + (set.totalExercises || 0), 0);
  
  // Get the main category name (for now, we'll use a general title, but this can be dynamic per category)
  const mainCategory = categories.find((cat: any) => !cat.parentId);
  const categoryTitle = mainCategory ? getLocalized(mainCategory.name) : (t("common.categories") || "Категории");

  return (
    <div className="">
      {/* Header Section with dynamic statistics */}
      <div className="relative rounded-[20px] h-[100vh] md:h-[85vh] md:m-6 overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-bg absolute h-full w-full object-cover z-[-1] md:rounded-[20px]"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Statistics overlay */}
        <div className="absolute bottom-16 left-16 z-10 max-w-[90%]">
          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Sections badge with glassmorphism */}
            <div className="relative w-[247px] h-[64px]">
              {/* Glass background */}
              <div className="absolute inset-0 bg-[#3D334A]/30 backdrop-blur-[20px] rounded-[15px]"></div>
              {/* Content */}
              <div className="relative w-full h-full px-5 py-2.5 flex items-center gap-2">
                <div className="w-[46px] h-[44px] bg-[#3D334A]/30 backdrop-blur-[20px] rounded-[10px] flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2H15V8H21V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-pt text-white text-base font-medium">
                  {subcategoriesCount} {t("common.sections") || "разделов"}
                </span>
              </div>
            </div>

            {/* Complexes badge with glassmorphism */}
            <div className="relative w-[247px] h-[64px]">
              {/* Glass background */}
              <div className="absolute inset-0 bg-[#3D334A]/30 backdrop-blur-[20px] rounded-[15px]"></div>
              {/* Content */}
              <div className="relative w-full h-full px-5 py-2.5 flex items-center gap-2">
                <div className="w-[46px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
                  <Image 
                    src="/assets/icons/Video.png" 
                    alt="Complexes" 
                    width={30} 
                    height={30}
                    className="w-[30px] h-[30px]"
                  />
                </div>
                <span className="font-pt text-white text-base font-medium">
                  {setsCount} {t("common.complexes") || "комплексов"}
                </span>
              </div>
            </div>

            {/* Exercises badge with glassmorphism */}
            <div className="relative w-[247px] h-[64px]">
              {/* Glass background */}
              <div className="absolute inset-0 bg-[#3D334A]/30 backdrop-blur-[20px] rounded-[15px]"></div>
              {/* Content */}
              <div className="relative w-full h-full px-5 py-2.5 flex items-center gap-2">
                <div className="w-[46px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
                  <Image 
                    src="/assets/icons/Pulse.png" 
                    alt="Exercises" 
                    width={30} 
                    height={30}
                    className="w-[30px] h-[30px]"
                  />
                </div>
                <span className="font-pt text-white text-base font-medium">
                  {exercisesCount} {t("common.exercises") || "упражнений"}
                </span>
              </div>
            </div>
          </div>

          {/* Category title with glassmorphism */}
          <div className="relative w-[779px] h-[158px]">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#3D334A]/30 backdrop-blur-[20px] rounded-[20px]"></div>
            {/* Content */}
            <div className="relative w-full h-full px-6 py-3 flex items-center">
              <h1 className="font-bowler text-white text-3xl md:text-4xl uppercase tracking-wide">
                {categoryTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="md:pt-[100px] pt-[400px]">
        {/* Разделы (Subcategories) */}
        <Section 
          border={0} 
          borderColor="none" 
          subcategories={displaySubcategories}
        />
        
        {/* Комплексы (Sets) */}
        <WorksSlider
          title={t("common.complexes") || "Комплексы"}
          works={transformedSets}
          fromMain={false}
          seeAll={true}
          scrollable={true}
        />
        <div className="md:my-10">
          <Subscribe
            backgroundImage="/assets/images/categorySliderBgs/bg4.jpg"
            titleKey="subscription.title"
            buttonTextKey="buttons.subscribe"
            buttonTextColor="#3D334A"
            buttonBgColor="#FFFFFF"
            href="/shoppingcard"
            containerStyles="custom-class"
            titleStyles="text-white"
            buttonStyles="hover:opacity-80"
            bgCenter={true}
          />
        </div>
        <div className="md:mb-10">
          {" "}
          <ReviewSlider title={t("common.reviews_title") || "ОТЗЫВЫ О НАС"} />
        </div>
        <div
          className="md:mb-10
        "
        >
          {" "}
          <Blog
            withBanner={true}
            withSlider={true}
            layoutType="default"
            title={t("navigation.blog")}
            showCategories={false}
          />
        </div>
        <Professional
          title={t("common.grs_professional") || "GRS Профразвитие"}
          bgColor={"#F9F7FE"}
          withProfText={true}
          withBanner={false}
        />
      </div>
      <Footer />
    </div>
  );
}