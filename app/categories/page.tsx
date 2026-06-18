"use client";
import { useCategories } from "../hooks/useCategories";
import { useAllSets } from "../hooks/useSets";
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
import {
  sumSetsExerciseCount,
} from "@/app/utils/setDescriptionMeta";

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { sets, loading: setsLoading, error: setsError } = useAllSets();
  const { t, locale } = useI18n();

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
  const exercisesCount = sumSetsExerciseCount(sets, locale);
  
  const mainCategory = categories.find((cat: any) => !cat.parentId);
  const categoryTitle = mainCategory ? getLocalized(mainCategory.name) : (t("common.categories") || "Категории");

  return (
    <div className="">
      <MainHeader
        ShowBlock={false}
        OptionalComponent={null}
        stats={[
          {
            icon: (
              <Image
                src="/assets/icons/Book.png"
                alt="Sections"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            ),
            value: subcategoriesCount,
            label: t("common.sections") || "Sections",
          },
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
            label: t("common.complexes") || "Complexes",
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
            label: t("common.exercises") || "Exercises",
          },
        ]}
        showArrows={false}
        useVideo={true}
        customBlockTitle={categoryTitle.toUpperCase()}
        customBlockDescription={
          mainCategory
            ? getLocalized(mainCategory.description)
            : t("common.categories") || "Categories"
        }
        hideBlock={false}
        hideHeaderText={false}
      />
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