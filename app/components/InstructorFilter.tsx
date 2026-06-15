"use client";

import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";
import { useI18n } from "../context/I18nContext";
import { pickLocalized } from "../utils/pickLocalized";

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

interface InstructorFilterProps {
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange?: (sortBy: string) => void;
  instructorCountByCategory?: Record<string, number>;
  sortValue?: string;
}

const getLocalizedCategoryName = (
  name: Category["name"],
  locale: string
): string => {
  if (typeof name === "string") return name;
  const loc = locale === "en" || locale === "ru" || locale === "ka" ? locale : "ka";
  return pickLocalized(name, loc);
};

export default function InstructorFilter({
  onCategoryChange,
  onSortChange,
  instructorCountByCategory = {},
  sortValue,
}: InstructorFilterProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState(t("teachers.sort.most_courses"));
  const displaySort = sortValue ?? sort;

  const mainCategories = allCategories.filter((cat) => !cat.parentId);

  // Sync local sort state with parent sortValue prop
  useEffect(() => {
    if (sortValue) {
      setSort(sortValue);
    }
  }, [sortValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch course categories for instructor filtering
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/course-categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    onCategoryChange(category?._id || null);
    console.log("📁 Category selected:", category?._id || "All");
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-10 mb-6 md:mb-10 rounded-2xl">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  const allInstructorsLabel = t("teachers.all_instructors") || "ყველა ინსტრუქტორი";

  return (
    <div className="bg-white p-6 md:p-10 mb-6 md:mb-10 rounded-2xl text-[#1e1b29] text-sm font-medium">
      {/* კატეგორიების ჩიპები - დროებით დამალულია სანამ backend მზად არ არის */}
      {mainCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
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
            {allInstructorsLabel}
          </button>

          {mainCategories.map((category) => {
            const count = instructorCountByCategory[category._id] ?? 0;
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
      )}

      {/* სორტირება */}
      <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-10">
        <span className="text-[#846FA0] text-[14px] md:text-[19px] font-medium">
          {t("sort.label") || "Сортировать:"}
        </span>
        <select
          value={displaySort}
          onChange={(e) => {
            const v = e.target.value;
            setSort(v);
            onSortChange?.(v);
          }}
          className="bg-[#F7F4FF] border border-[#E9DFF6] text-[#3D334A] text-[14px] md:text-[19px] font-medium cursor-pointer px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#D4BAFC] focus:border-[#D4BAFC]"
        >
          <option value={t("teachers.sort.most_courses")}>{t("teachers.sort.most_courses") || "Most Courses"}</option>
          <option value={t("teachers.sort.alphabetical_asc")}>{t("teachers.sort.alphabetical_asc") || "A-Z"}</option>
          <option value={t("teachers.sort.alphabetical_desc")}>{t("teachers.sort.alphabetical_desc") || "Z-A"}</option>
          <option value={t("teachers.sort.highest_rated")}>{t("teachers.sort.highest_rated") || "Highest Rated"}</option>
        </select>
      </div>
    </div>
  );
}
