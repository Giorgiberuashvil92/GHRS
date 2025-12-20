"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { getDefaultMenuItems } from "../components/Header/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import Category from "../components/Category";
import { CiSearch } from "react-icons/ci";
import { useCategories } from "../hooks/useCategories";
import { useAllSets } from "../hooks/useSets";
import { useI18n } from "../context/I18nContext";
import Section from "../components/Section";
import { IoIosArrowDown } from "react-icons/io";
import { Footer } from "../components/Footer";
import { API_CONFIG } from "../config/api";
import Works from "../components/Works";
import OrthopedicsGrid from "../components/OrthopedicsGrid";

interface Subcategory {
  _id: string;
  name: {
    ka: string;
    en: string;
    ru: string;
  };
}

const AllComplex = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useI18n();
  const menuItems = getDefaultMenuItems(t);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  // const [visibleWorksCount, setVisibleWorksCount] = useState(1); // რამდენი Works გამოჩნდეს

  const { categories } = useCategories();
  const { sets } = useAllSets();

  // Helper to get localized text - MOVED BEFORE USAGE
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

  // Count sets per category
  const setsPerCategory = categories.map((category) => {
    const categorySets = sets.filter((set) => set.categoryId === category._id);
    return {
      category: getLocalizedText(category.name),
      count: categorySets.length
    };
  });

  const totalSetsInCategories = setsPerCategory.reduce((sum, cat) => sum + cat.count, 0);

  console.log('📊 AllComplex Page - Total sets from API:', sets.length);
  console.log('📦 AllComplex Page - Categories:', categories.length);
  console.log('📋 Sets per category:', setsPerCategory);
  console.log('🔢 Total sets displayed in categories:', totalSetsInCategories);
  console.log('⚠️ Sets not in any category:', sets.length - totalSetsInCategories);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // არავიტარ მოქმედებას არ ვახდენ dropdown-ზე
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        // TEMPORARY FIX: Remove /api prefix for production Render backend
        const isProduction = typeof window !== 'undefined' && 
          window.location.hostname !== 'localhost' &&
          API_CONFIG.BASE_URL.includes('render.com');
        
        const endpoint = isProduction 
          ? '/categories/subcategories/all'
          : '/api/categories/subcategories/all';
        
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${endpoint}`
        );
        const data = await response.json();
        console.log('📋 Subcategories from API:', data);
        console.log('📋 First subcategory:', data[0]);
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  const pageTexts = {
    title: {
      ka: "ყველა კომპლექსი",
      en: "All Complexes",
      ru: "Все комплексы",
    },
    searchPlaceholder: {
      ka: "შეიყვანეთ ვარჯიშის სახელი",
      en: "Enter exercise name",
      ru: "Введите название упражнения",
    },
    sections: {
      popularSections: {
        ka: "პოპულარული სექციები",
        en: "Popular Sections",
        ru: "Популярные разделы",
      },
      popularComplexes: {
        ka: "პოპულარული კომპლექსები",
        en: "Popular Complexes",
        ru: "Популярные комплексы",
      },
      orthopedics: {
        ka: "ორთოპედია",
        en: "Orthopedics",
        ru: "Ортопедия",
      },
      recommended: {
        ka: "რეკომენდებული",
        en: "Recommended",
        ru: "Рекомендуемые",
      },
    },
  };

  // if (categoriesLoading || setsLoading) {
  //   return (
  //     <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
  //         <h2 className="text-2xl font-semibold text-gray-700">
  //           {loadingText[locale as keyof typeof loadingText] || loadingText.ru}
  //         </h2>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar
        menuItems={menuItems}
        blogBg={false}
        allCourseBg={false}
      />
      <MobileNavbar />

      <h1 className="font-bowler text-[32px] md:text-[64px] md:px-10 px-5 pt-8 md:pt-10 leading-[120%] tracking-[-3%] text-[#3D334A]">
        {pageTexts.title[locale as keyof typeof pageTexts.title] ||
          pageTexts.title.ru}
      </h1>

      <div className="bg-white md:mx-5 md:my-10 md:rounded-[30px]">
        <Category bgColor="white" customRounded={""} customMx={""} />

        {/* Subcategories section like in categories/[categoryId]/page.tsx */}
      </div>
      {/* Search input */}
      <div className="bg-white mx-5 md:rounded-[30px] md:p-10 my-10">
        <div className="mb-6 max-w-full border-[#D4BAFC] border flex rounded-4xl  p-2 md:p-4">
          <CiSearch color="black" size={25} />
          <input
            type="text"
            placeholder={pageTexts.searchPlaceholder[locale as keyof typeof pageTexts.searchPlaceholder] || pageTexts.searchPlaceholder.ru}
            className="w-full font-bowler bg-white text-[#846FA0] text-[16px] md:text-[19px] font-medium ml-2 md:ml-4 outline-none"
          />
        </div>

        <div
          ref={dropdownRef}
          className="w-full px-4 md:px-10 min-h-[64px] bg-[#F9F7FE] rounded-[20px] mb-6 p-4 flex flex-wrap gap-2 md:gap-3 items-center"
        >
          {categories.map((cat, idx) => {
            const hasSubcategories = !!cat.subcategories && cat.subcategories.length > 0;
            const isOpen = openDropdownId === cat._id;
            
            return (
              <div key={cat._id} className="relative">
                <Link
                  href={`/categories/${cat._id}`}
                  className={`font-bowler text-[#3D334A] text-[14px] md:text-[18px] tracking-wide font-medium rounded-[12px] px-4 md:px-5 py-2 md:py-3 min-h-[40px] transition-colors whitespace-nowrap flex items-center gap-2
                  ${idx === 0 ? "bg-[#E9DDFB]" : "bg-white"}
                  hover:bg-[#E9DDFB]
                  ${isOpen ? "ring-2 ring-[#D4BAFC] bg-[#E9DDFB]" : ""}
                `}
                >
                  {getLocalizedText(cat.name)}
                  {hasSubcategories && (
                    <span
                      className={`ml-1 text-sm transition-transform p-1 bg-[#E9D9FF] rounded-sm ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDropdownId(isOpen ? null : cat._id);
                      }}
                    >
                      <IoIosArrowDown />
                    </span>
                  )}
                </Link>

{hasSubcategories && isOpen && (
                  <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-[10px] shadow-lg min-w-[160px] py-2 animate-fade-in">
                    {cat.subcategories.map(
                      (subcategoryId: string, i: number) => {
                        // ვპოულობთ subcategory-ს ID-ის მიხედვით
                        const subcategory = subcategories.find(
                          (sub: Subcategory) => sub._id === subcategoryId
                        );
                        const subcategoryName = subcategory
                          ? getLocalizedText(subcategory.name)
                          : subcategoryId;

                        return (
                          <Link
                            key={i}
                            href={`/categories/section?categoryId=${cat._id}&subcategoryId=${subcategoryId}`}
                            className="font-bowler px-4 py-3 hover:bg-[#E9DDFB] cursor-pointer text-[#3D334A] text-[14px] md:text-[16px] transition-colors block"
                          >
                            {subcategoryName}
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Section border={1} borderColor="#D4BAFC" subcategories={subcategories} categories={categories} />

      {/* <Works title={"Sets"} sets={sets} border={1} borderColor="#D4BAFC" /> */}
      {/* <Works title={"Популярные комплексы "} />
      <Works title={"Ортопедия"} />
      <Works title={""} /> */}

      {/* Category bar with real data */}

      {/* Popular Complexes - All sets */}
      <Works
        title={
          pageTexts.sections.popularComplexes[
            locale as keyof typeof pageTexts.sections.popularComplexes
          ] || pageTexts.sections.popularComplexes.ru
        }
        sets={sets.slice(0, 8)}
        fromMain={true}
        customMargin={""}
        customBorderRadius={""}
        seeAll={true}
        scrollable={true}
        border={1}
        borderColor="#D4BAFC"
        sliderId="popular-complexes-slider"
        totalCount={sets.length}
        linkHref="/allComplex"
        showTopLink={true}
      />

      {/* Orthopedics category - Slider */}
      {categories
        .filter((category) => {
          const categoryName = getLocalizedText(category.name).toLowerCase();
          return categoryName.includes('orthopedics') || 
                 categoryName.includes('ортопедия') || 
                 categoryName.includes('ორთოპედია');
        })
        .map((category) => {
          const categorySets = sets.filter(
            (set) => set.categoryId === category._id
          );
          // Only render if category has sets
          if (categorySets.length === 0) return null;

          return (
            <React.Fragment key={category._id}>
              {/* Slider Section */}
              <Works
                title={getLocalizedText(category.name)}
                sets={categorySets}
                fromMain={true}
                customMargin={""}
                customBorderRadius={""}
                seeAll={true}
                scrollable={true}
                border={1}
                borderColor="#D4BAFC"
                sliderId={`category-slider-${category._id}`}
                totalCount={categorySets.length}
                linkHref="/allComplex"
                showTopLink={true}
              />
              
              {/* Grid Section Below */}
              <OrthopedicsGrid
                title={getLocalizedText(category.name)}
                sets={categorySets}
              />
            </React.Fragment>
          );
        })}

      {/* Hidden: All other categories - kept for future use */}
      {/* {categories
        .filter((category) => {
          const categoryName = getLocalizedText(category.name).toLowerCase();
          return !(categoryName.includes('orthopedics') || 
                   categoryName.includes('ортопедия') || 
                   categoryName.includes('ორთოპედია'));
        })
        .map((category) => {
          const categorySets = sets.filter(
            (set) => set.categoryId === category._id
          );
          if (categorySets.length === 0) return null;

          return (
            <Works
              key={category._id}
              title={getLocalizedText(category.name)}
              sets={categorySets}
              fromMain={true}
              customMargin={""}
              customBorderRadius={""}
              seeAll={true}
              scrollable={true}
              border={1}
              borderColor="#D4BAFC"
              sliderId={`category-slider-${category._id}`}
              totalCount={categorySets.length}
              linkHref="/allComplex"
            />
          );
        })} */}
      {/* Works components with real data */}
      {/* <Works
        title={pageTexts.sections.popularSections[locale as keyof typeof pageTexts.sections.popularSections] || pageTexts.sections.popularSections.ru}
        sets={popularSets}
        fromMain={true} customMargin={""} customBorderRadius={""} seeAll={false} scrollable={false}      />

      

      <Works
        title={pageTexts.sections.orthopedics[locale as keyof typeof pageTexts.sections.orthopedics] || pageTexts.sections.orthopedics.ru}
        sets={orthopedicSets.length > 0 ? orthopedicSets : sets.slice(0, 4)}
        fromMain={true} customMargin={""} customBorderRadius={""} seeAll={false} scrollable={false}      /> */}

      <div className="mt-40">
        <Footer />
      </div>
    </div>
  );
};

export default AllComplex;
