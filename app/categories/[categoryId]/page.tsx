"use client";

import { use } from "react";
import { useCategoryComplete } from "../../hooks/useCategoryComplete";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import SliderArrows from "../../components/SliderArrows";
import WorksSlider from "../../components/WorksSlider";
import Subscribe from "../../components/Subscribe";
import ReviewSlider from "../../components/ReviewSlider";
import Professional from "../../components/Professional";
import Blog from "@/app/components/Blog";
import { useI18n } from "../../context/I18nContext";
import { Footer } from "@/app/components/Footer";
// import DesktopNavbar from "@/app/components/Navbar/DesktopNavbar";

export default function CategoriesPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);
  const { categoryData, loading, error } = useCategoryComplete(categoryId);
  const { t } = useI18n();


  // ახლა სრული მონაცემები გვაქვს
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

  // ტექნიკურად ვფილტრავთ სეტებს წყაროს მიხედვით
  const directSets =
    categoryData?.sets?.filter((set) => !set.subCategoryId) || [];
  const subcategorySets =
    categoryData?.sets?.filter((set) => set.subCategoryId) || [];

  // ვაერთიანებთ ყველა სეტს ერთ სიაში
  const allSets = [...directSets, ...subcategorySets];

  // ამოვიღოთ რაოდენობები
  const setsCount = categoryData?.sets?.length || 0;
  const subcategoriesCount = categoryData?.subcategories?.length || 0;
  const exercisesCount =
    categoryData?.sets?.reduce(
      (total, set) => total + (set.exercises?.length || 0),
      0
    ) || 0;

  // გარდავქმნით ყველა სეტს WorksSlider-ის ფორმატში
  const formattedSets = allSets.map((set) => ({
    id: set._id,
    title: getLocalizedText(set?.name, locale),
    description: getLocalizedText(set?.description, locale),
    image: set.thumbnailImage || "/assets/images/workMan.png",
    exerciseCount: set.exercises?.length || 0,
    categoryName: getLocalizedText(selectedCategory?.name, locale),
    price: `${set.price?.monthly || 920}₾/თვე`,
    monthlyPrice: set.price?.monthly || 920,
    categoryId: categoryId,
    subcategoryId: set.subCategoryId || "",
  }));


  return (
    <div className="">
      <Header
        variant="categories"
        title={getLocalizedText(selectedCategory?.name, locale)}
        info={{
          setsCount,
          subcategoriesCount,
          exercisesCount,
        }}
      />
      <div className="md:pt-[100px] pt-[400px]">
        <div className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] md:mb-10 mx-6">
          <div className="flex items-center justify-between mb-[20px]">
            <div className="flex flex-col gap-5">
              <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%]">
                {t("common.subcategories")}
              </h1>
              <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase">
                {subcategoriesCount} {t("common.subcategory")}
              </span>
            </div>
            <div>
              <SliderArrows
                onScrollLeft={function (): void {
                  throw new Error("Function not implemented.");
                }}
                onScrollRight={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-[28px] overflow-x-auto">
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
                      subcategorySets.filter(
                        (set) => set.subCategoryId === subcategory._id
                      ).length
                    }{" "}
                    {t("common.sets")}
                  </span>
                </div>
              </Link>
            )) || []}
          </div>
        </div>

        {Array.isArray(formattedSets) && formattedSets.length > 0 && (
          <div className="mt-10 mb-10">
            <WorksSlider
              works={formattedSets}
              linkType="complex"
              title={t("common.complexes")}
              seeAll={true}
              categoryData={categoryData?.category?._id}
              fromMain={false} scrollable={false} />
          </div>
        )}

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
        <div className="my-10">
          <ReviewSlider title={""} />
        </div>
        <Blog
          withBanner={false}
          withSlider={true}
          layoutType="default"
          title={'GRS МЕДИА'}
        />
        <div className="mt-10">
          <Professional withBanner={false} title={""} bgColor={"#F9F7FE"} withProfText={true} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
