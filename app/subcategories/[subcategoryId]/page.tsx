"use client";

import { use } from "react";
import Link from "next/link";
import { useCategories } from "../../hooks/useCategories";
import { useAllSets } from "../../hooks/useSets";
import Header from "../../components/Header/Header";
import WorksSlider from "../../components/WorksSlider";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Professional from "../../components/Professional";
import Blog from "@/app/components/Blog";
import { useI18n } from "../../context/I18nContext";
import SliderArrows from "../../components/SliderArrows";

export default function SubcategoryPage({
  params,
}: {
  params: Promise<{ subcategoryId: string }>;
}) {
  const { subcategoryId } = use(params);
  const { t, locale } = useI18n();

  // ✅ Use real API hooks like complex page does
  const { categories, loading: categoriesLoading } = useCategories();
  const { sets, loading: setsLoading } = useAllSets();

  const loading = categoriesLoading || setsLoading;

  // Find the subcategory from categories
  const selectedSubcategory = categories
    .flatMap(cat => (cat.subcategories || []) as any[])
    .find((sub: any) => sub._id === subcategoryId);

  // Find sets for this subcategory
  const subcategorySets = sets.filter(set => set.subCategoryId === subcategoryId);

  const error = !selectedSubcategory && !loading ? "Subcategory not found" : null;

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

  // Helper function to get localized text
  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined
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

  // ამოვიღოთ რაოდენობები
  const setsCount = subcategorySets.length;
  const exercisesCount = subcategorySets.reduce(
    (total, set) => total + (set.totalExercises || 0),
    0
  );

  // გარდავქმნით სეტებს WorksSlider-ის ფორმატში
  const formattedSets = subcategorySets.map((set) => ({
    id: set._id,
    title: getLocalizedText(set?.name),
    description: getLocalizedText(set?.description),
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.totalExercises || 0,
    categoryName: getLocalizedText(selectedSubcategory?.name),
    price: `${set.price?.monthly || 920}₾/თვე`,
    monthlyPrice: set.price?.monthly || 920,
    categoryId: set.categoryId || "",
    subcategoryId: subcategoryId,
  }));

  return (
    <div className="">
      <Header
        variant="categories"
        title={getLocalizedText(selectedSubcategory?.name)}

        info={{
          setsCount,
          subcategoriesCount: 0, // subcategory-ს ქვეკატეგორიები არ აქვს
          exercisesCount,
        }}
      />
      <div className="md:pt-[100px] pt-[400px]">
        {Array.isArray(formattedSets) && formattedSets.length > 0 && (
          <div className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] md:mb-10 mx-6">
            <div className="flex items-center justify-between mb-[20px]">
              <div className="flex flex-col gap-5">
                <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%]">
                  {t("common.complexes")}
                </h1>
                <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase">
                  {setsCount} {t("common.sets")}
                </span>
              </div>
              <div>
                <SliderArrows
                  onScrollLeft={() => {
                    const slider = document.getElementById('complexes-slider');
                    if (slider) {
                      slider.scrollBy({ left: -500, behavior: 'smooth' });
                    }
                  }}
                  onScrollRight={() => {
                    const slider = document.getElementById('complexes-slider');
                    if (slider) {
                      slider.scrollBy({ left: 500, behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            </div>

            <div id="complexes-slider" className="flex flex-row items-center gap-[28px] overflow-x-auto">
              {formattedSets.map((set) => (
                <Link
                  key={set.id}
                  href={`/complex/${set.id}`}
                  className="mt-[48px] min-w-[558px] bg-white p-2 rounded-[20px] cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-[181px] bg-gray-200 rounded-[15px] mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                  <div className="flex items-center justify-between mt-[22px]">
                    <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
                      {set.title}
                    </h1>
                    <span className="text-[#D4BAFC] leading-[120%] font-medium">
                      {set.exerciseCount} {t("common.exercises")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
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

        <Subscribe />
        <ReviewSlider title={""} />
        <div className="mb-10">
          <Blog
            withBanner={true}
            withSlider={true}
            layoutType="default"
            title={t("navigation.blog")}
            showCategories={false}
          />
        </div>
        <Professional withBanner={false} title={""} bgColor={"#F9F7FE"} withProfText={true} />
      </div>
    </div>
  );
}
