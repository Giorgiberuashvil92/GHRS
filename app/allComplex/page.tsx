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
import { useAllExercises } from "../hooks/useExercises";
import { useI18n } from "../context/I18nContext";
import Section from "../components/Section";

const AllComplex = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  // Real data hooks
  const { categories, loading: categoriesLoading } = useCategories();
  const { sets, loading: setsLoading } = useAllSets();
  const { exercises, loading: exercisesLoading } = useAllExercises();

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
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // No dropdown state to manage anymore
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter sets by categories
  const popularSets = sets.slice(0, 6);
  const orthopedicSets = sets.filter(
    (set) =>
      set.categoryId &&
      categories.some(
        (cat) =>
          cat._id === set.categoryId &&
          getLocalizedText(cat.name)
            .toLowerCase()
            .includes(
              locale === "ka"
                ? "ორთოპედ"
                : locale === "en"
                ? "orthoped"
                : "ортопед"
            )
      )
  );

  // Create category buttons from real data
  const allCategoriesText = {
    ka: "ყველა კატეგორია",
    en: "All Categories",
    ru: "Все категории",
  };

  const realCategories = [
    {
      id: "all",
      title:
        allCategoriesText[locale as keyof typeof allCategoriesText] ||
        allCategoriesText.ru,
      active: true,
    },
    ...categories.map((cat) => ({
      id: cat._id,
      title: getLocalizedText(cat.name),
      active: false,
    })),
  ];

  // Loading text
  const loadingText = {
    ka: "იტვირთება...",
    en: "Loading...",
    ru: "Загрузка..",
  };

  // Page texts
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

  if (categoriesLoading || setsLoading || exercisesLoading) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {loadingText[locale as keyof typeof loadingText] || loadingText.ru}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} />
      <MobileNavbar />
      <h1 className="md:text-[64px] md:px-10 px-5 leading-[100%] tracking-[-3%] text-[#3D334A]">
        {pageTexts.title[locale as keyof typeof pageTexts.title] ||
          pageTexts.title.ru}
      </h1>
      <div className="bg-white md:mx-5 md:my-10 md:rounded-[30px]">
        <Category bgColor="white" />

        {/* Subcategories section like in categories/[categoryId]/page.tsx */}
        <div className="md:px-10 px-5 mb-8">
          <div className="flex flex-row items-center gap-[28px] overflow-x-auto">
            {/* Sample subcategories data */}
            {[
              {
                _id: "1",
                name: {
                  ka: "ზურგის პრობლემები",
                  en: "Back Problems",
                  ru: "Проблемы спины",
                },
                image:
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
                setsCount: 8,
              },
              {
                _id: "2",
                name: {
                  ka: "სახსრების პრობლემები",
                  en: "Joint Problems",
                  ru: "Проблемы суставов",
                },
                image:
                  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
                setsCount: 12,
              },
              {
                _id: "3",
                name: {
                  ka: "გულის ჯანმრთელობა",
                  en: "Heart Health",
                  ru: "Здоровье сердца",
                },
                image:
                  "https://images.unsplash.com/photo-1628348068343-c6a848d2d497?w=500",
                setsCount: 6,
              },
            ].map((subcategory) => (
              <div
                key={subcategory._id}
                className="mt-[48px] min-w-[558px] bg-white p-2 rounded-[20px] cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={subcategory.image}
                  alt={getLocalizedText(subcategory.name)}
                  className="w-full h-[181px] object-cover rounded-[15px]"
                />
                <div className="flex items-center justify-between mt-[22px]">
                  <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
                    {getLocalizedText(subcategory.name)}
                  </h1>
                  <span className="text-[#D4BAFC] leading-[120%] font-medium">
                    {subcategory.setsCount} სეტი
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Search input */}
      <div className="bg-white md:mx-5 md:rounded-[30px] md:p-10 mb-10">
        <div className="relative mb-6 max-w-full">
          <input
            type="text"
            placeholder="Введите название упражнения"
            className="w-full border-[#D4BAFC] border font-[Pt] bg-white rounded-[54px] px-[50px] py-[21px] mb-2 text-[#846FA0] text-[19px] font-medium"
          />
          <CiSearch
            color="black"
            size={25}
            className="absolute top-[22px] left-4"
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
                  className={`text-[#3D334A] text-[13px] md:text-[15px] font-medium rounded-[8px] px-3 md:px-5 h-[33px] transition-colors whitespace-nowrap flex items-center gap-1
                  ${idx === 0 ? "bg-[#E9DDFB] font-bold" : "bg-[#F9F7FE]"}
                  ${cat.isActive ? "shadow-sm" : ""}
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
                      className={`ml-1 text-xs transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </button>
                {/* Dropdown menu */}
                {isDropdown && isOpen && (
                  <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-[10px] shadow-lg min-w-[160px] py-2 animate-fade-in">
                    {cat.subcategories.map((item: string, i: number) => (
                      <div
                        key={i}
                        className="px-4 py-2 hover:bg-[#F3D57F] cursor-pointer text-[#3D334A] text-[13px]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Section border={1} borderColor="#D4BAFC" />
      <Works title={"Sets"} sets={sets} border={1} borderColor="#D4BAFC" />
      {/* <Works title={"Популярные комплексы "} />
      <Works title={"Ортопедия"} />
      <Works title={""} /> */}
      <div className="relative mb-6 max-w-full mx-10 mt-8">
        <input
          type="text"
          placeholder={
            pageTexts.searchPlaceholder[
              locale as keyof typeof pageTexts.searchPlaceholder
            ] || pageTexts.searchPlaceholder.ru
          }
          className="w-full bg-white rounded-[54px] px-[50px] py-[21px] mb-2 text-[#846FA0] text-[19px] font-medium"
        />
        <CiSearch
          color="black"
          size={25}
          className="absolute top-[22px] left-4"
        />
      </div>

      {/* Category bar with real data */}
      <div
        ref={dropdownRef}
        className="w-full px-10 min-h-[64px] bg-white rounded-[40px] mb-6 p-4 flex flex-wrap gap-2 md:gap-3 items-center"
      >
        {realCategories.map((cat, idx) => (
          <div key={cat.id} className="relative">
            <button
              className={`text-[#3D334A] text-[13px] md:text-[15px] font-medium rounded-[8px] px-3 md:px-5 h-[33px] transition-colors whitespace-nowrap flex items-center gap-1
                ${idx === 0 ? "bg-[#E9DDFB] font-bold" : "bg-[#F9F7FE]"}
                ${cat.active ? "shadow-sm" : ""}
              `}
              type="button"
            >
              {cat.title}
            </button>
          </div>
        ))}
      </div>

      {/* Works components with real data */}
      <Works
        title={
          pageTexts.sections.popularSections[
            locale as keyof typeof pageTexts.sections.popularSections
          ] || pageTexts.sections.popularSections.ru
        }
        sets={popularSets}
        fromMain={true}
      />

      <Works
        title={
          pageTexts.sections.popularComplexes[
            locale as keyof typeof pageTexts.sections.popularComplexes
          ] || pageTexts.sections.popularComplexes.ru
        }
        sets={sets.slice(0, 8)}
        fromMain={true}
      />

      <Works
        title={
          pageTexts.sections.orthopedics[
            locale as keyof typeof pageTexts.sections.orthopedics
          ] || pageTexts.sections.orthopedics.ru
        }
        sets={orthopedicSets.length > 0 ? orthopedicSets : sets.slice(0, 4)}
        fromMain={true}
      />

      <Works
        title={
          pageTexts.sections.recommended[
            locale as keyof typeof pageTexts.sections.recommended
          ] || pageTexts.sections.recommended.ru
        }
        sets={sets.slice(-6)}
        fromMain={true}
      />
    </div>
  );
};

export default AllComplex;
