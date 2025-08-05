"use client";
import React, { useRef, useEffect, useState } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import Category from "../components/Category";
import { CiSearch } from "react-icons/ci";
import Works from "../components/Works";
import { useCategories } from "../hooks/useCategories";
import { useAllSets } from "../hooks/useSets";
import { useI18n } from "../context/I18nContext";
import Section from "../components/Section";
import { IoIosArrowDown } from "react-icons/io";
import { Footer } from "../components/Footer";
import { API_CONFIG } from "../config/api";

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
  const { locale } = useI18n();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  // const [visibleWorksCount, setVisibleWorksCount] = useState(1); // რამდენი Works გამოჩნდეს

  const { categories } = useCategories();
  const { sets } = useAllSets();

  // Helper to get localized text
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
    // return (
    //   field[locale as keyof typeof field] ||
    //   field.ru ||
    //   field.en ||
    //   field.ka ||
    //   ""
    // );
  };

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
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories/subcategories/all`);
        const data = await response.json();
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
        menuItems={defaultMenuItems}
        blogBg={false}
        allCourseBg={false}
      />
      <MobileNavbar />

      <h1 className="md:text-[64px] md:px-10 px-5 leading-[100%] tracking-[-3%] text-[#3D334A]">
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
            placeholder="Введите название упражнения"
            className="w-full font-[Pt] bg-white text-[#846FA0]  md:text-[19px] font-medium ml-2 md:ml-4"
          />
        </div>

        <div
          ref={dropdownRef}
          className="w-full px-10 min-h-[64px] bg-white rounded-[40px] mb-6 p-4 flex flex-wrap gap-2 md:gap-3 items-center"
        >
          {categories.map((cat, idx) => {
            const isDropdown = !!cat.subcategories;
            const isOpen = openDropdownId === cat._id;
            return (
              <div key={cat._id} className="relative">
                <button
                  className={`text-[#3D334A] text-[13px] md:text-lg tracking-wide font-medium rounded-[8px] px-3 md:px-4 py-3 h-[33px] transition-colors whitespace-nowrap flex items-center gap-1
                  ${idx === 0 ? "bg-[#E9DDFB] font-bold" : "bg-[#F9F7FE]"}
                  
                  ${isOpen ? "ring-2 ring-[#D4BAFC] bg-[#F3D57F]" : ""}
                `}
                  onClick={() => {
                    if (isDropdown) {
                      setOpenDropdownId(isOpen ? null : cat._id);
                    }
                  }}
                  type="button"
                >
                  {getLocalizedText(cat.name)}
                  {isDropdown && (
                    <span
                      className={`ml-1 text-sm  transition-transform p-1 bg-[#E9D9FF] rounded-sm ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <IoIosArrowDown />
                    </span>
                  )}
                </button>

                {isDropdown && isOpen && (
                  <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-[10px] shadow-lg min-w-[160px] py-2 animate-fade-in">
                    {cat.subcategories.map((subcategoryId: string, i: number) => {
                      // ვპოულობთ subcategory-ს ID-ის მიხედვით
                      const subcategory = subcategories.find((sub: Subcategory) => sub._id === subcategoryId);
                      const subcategoryName = subcategory ? getLocalizedText(subcategory.name) : subcategoryId;
                      
                      return (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-[#F3D57F] cursor-pointer text-[#3D334A] text-[13px]"
                        >
                          {subcategoryName}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Section border={1} borderColor="#D4BAFC" subcategories={subcategories} />

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
        seeAll={false}
        scrollable={false}
        border={1} 
        borderColor="#D4BAFC"
      />

      {/* Dynamic Works components for each category */}
      {categories.map((category) => {
        const categorySets = sets.filter(set => set.categoryId === category._id);
        // Only render if category has sets
        if (categorySets.length === 0) return null;
        
        return (
          <Works
            key={category._id}
            title={getLocalizedText(category.name)}
            sets={categorySets}
            fromMain={true}
            customMargin={""}
            customBorderRadius={""}
            seeAll={false}
            scrollable={false}
            border={1} 
            borderColor="#D4BAFC"
          />
        );
      })}
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
