"use client";

import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";
import { useI18n } from "../context/I18nContext";

interface Category {
  _id: string;
  name: {
    en: string;
    ru: string;
    ka: string;
  };
  description?: {
    en: string;
    ru: string;
    ka: string;
  };
  image?: string;
  isActive?: boolean;
  isPublished?: boolean;
  parentId?: string;
}

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string | null) => void;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  onSortChange?: (sortBy: string) => void;
  /** კურსების რაოდენობა კატეგორიების მიხედვით (categoryId -> count) */
  courseCountByCategory?: Record<string, number>;
  /** მიმდინარე სორტის ტექსტი (ლოკალიზებული), რომ dropdown სწორი ენა აჩვენოს */
  sortValue?: string;
  /** true = კურსების კატეგორიები (/api/course-categories), false = ჩვეულებრივი კატეგორიები */
  forCourses?: boolean;
}

const getLocalizedCategoryName = (
  name: Category["name"],
  locale: string
): string => {
  if (typeof name === "string") return name;
  const key = locale as keyof typeof name;
  return (name[key] || name.ru || name.en || name.ka || "").trim() || name.ru || "";
};

export default function CategoryFilter({
  onCategoryChange,
  onSubcategoryChange,
  onSortChange,
  courseCountByCategory = {},
  sortValue,
  forCourses = false,
}: CategoryFilterProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
  const [sort, setSort] = useState(t("sort.popularity"));
  const displaySort = sortValue ?? sort;

  const mainCategories = allCategories.filter((cat) => !cat.parentId);
  const subcategories = selectedCategory
    ? allCategories.filter((cat) => cat.parentId === selectedCategory._id)
    : [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const endpoint = forCourses ? "/api/course-categories" : "/api/categories";
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [forCourses]);

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    onCategoryChange(category?._id || null);
    onSubcategoryChange(null);
  };

  const handleSubcategorySelect = (subcategory: Category | null) => {
    setSelectedSubcategory(subcategory);
    onSubcategoryChange(subcategory?._id || null);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-10 mb-6 md:mb-10 rounded-2xl">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  const allCategoriesLabel = t("all_categories") || "ВСЕ КАТЕГОРИИ";

  return (
    <div className="bg-white p-6 md:p-10 mb-6 md:mb-10 rounded-2xl text-[#1e1b29] text-sm font-medium">
      {/* კატეგორიების ჩიპები */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => handleCategorySelect(null)}
          className={`
            text-[14px] md:text-[19px] px-4 py-2 rounded-xl uppercase tracking-wide font-medium
            border transition-colors
            ${
              !selectedCategory
                ? "bg-[#D4BAFC] text-white border-[#D4BAFC]"
                : "bg-white text-[#3D334A] border-[#E9DFF6] hover:border-[#D4BAFC] hover:bg-[#F9F7FE]"
            }
          `}
        >
          {allCategoriesLabel}
        </button>

        {mainCategories.map((category) => {
          const count = courseCountByCategory[category._id] ?? 0;
          const isSelected = selectedCategory?._id === category._id;
          const label = getLocalizedCategoryName(category.name, locale);
          const displayLabel = count > 0 ? `${label} [${count}]` : label;

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategorySelect(isSelected ? null : category)}
              className={`
                text-[14px] md:text-[19px] px-4 py-2 rounded-xl uppercase tracking-wide font-medium
                border transition-colors flex items-center gap-1
                ${
                  isSelected
                    ? "bg-[#D4BAFC] text-white border-[#D4BAFC]"
                    : "bg-white text-[#3D334A] border-[#E9DFF6] hover:border-[#D4BAFC] hover:bg-[#F9F7FE]"
                }
              `}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {/* საბკატეგორიები – ჩიპები, როცა მთავარი კატეგორია არჩეულია */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 pt-4 border-t border-[#E9DFF6]">
          {subcategories.map((subcategory) => {
            const count = courseCountByCategory[subcategory._id];
            const isSelected = selectedSubcategory?._id === subcategory._id;
            const label = getLocalizedCategoryName(subcategory.name, locale);
            const displayLabel =
              typeof count === "number" && count > 0 ? `${label} [${count}]` : label;

            return (
              <button
                key={subcategory._id}
                type="button"
                onClick={() =>
                  handleSubcategorySelect(isSelected ? null : subcategory)
                }
                className={`
                  text-[14px] md:text-[17px] px-3 py-1.5 rounded-xl uppercase tracking-wide font-medium
                  border transition-colors
                  ${
                    isSelected
                      ? "bg-[#D4BAFC] text-white border-[#D4BAFC]"
                      : "bg-white text-[#3D334A] border-[#E9DFF6] hover:border-[#D4BAFC] hover:bg-[#F9F7FE]"
                  }
                `}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* სორტირება */}
      <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-10">
        <span className="text-[#846FA0] text-[14px] md:text-[19px] font-medium">
          {t("sort.label") || "Сортировать:"}
        </span>
        <select
          value={sort}
          onChange={(e) => {
            const v = e.target.value;
            setSort(v);
            onSortChange?.(v);
          }}
          className="bg-[#F7F4FF] border border-[#E9DFF6] text-[#3D334A] text-[14px] md:text-[19px] font-medium cursor-pointer px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#D4BAFC] focus:border-[#D4BAFC]"
        >
          <option value={t("sort.popularity")}>{t("sort.popularity")}</option>
          <option value={t("sort.newest")}>{t("sort.newest")}</option>
          <option value={t("sort.priceAsc")}>{t("sort.priceAsc")}</option>
          <option value={t("sort.priceDesc")}>{t("sort.priceDesc")}</option>
        </select>
      </div>
    </div>
  );
}
