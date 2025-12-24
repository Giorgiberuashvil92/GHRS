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
  description: {
    en: string;
    ru: string;
    ka: string;
  };
  image: string;
  isActive: boolean;
  isPublished: boolean;
  parentId?: string; // თუ ეს არის, მაშინ საბკატეგორიაა
}

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string | null) => void;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  onSortChange?: (sortBy: string) => void;
}

export default function CategoryFilter({ onCategoryChange, onSubcategoryChange, onSortChange }: CategoryFilterProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
  const [sort, setSort] = useState(t("sort.popularity"));

  // მთავარი კატეგორიები (parentId არ აქვთ)
  const mainCategories = allCategories.filter(cat => !cat.parentId);
  
  // არჩეული კატეგორიის საბკატეგორიები
  const subcategories = selectedCategory 
    ? allCategories.filter(cat => cat.parentId === selectedCategory._id)
    : [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // ✅ FIXED: Always use /api prefix - Next.js rewrites will handle routing
        const endpoint = '/api/categories';
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      <div className="bg-white p-10 mb-10 rounded-2xl">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 mb-10 rounded-2xl text-[#1e1b29] text-sm font-medium space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => handleCategorySelect(null)}
          className={`${
            !selectedCategory 
              ? "bg-[#e8d8ff] text-white" 
              : "bg-[#f7f4ff] text-[#1e1b29]"
          } text-[19px] px-3 py-1 rounded-md uppercase tracking-widest`}
        >
          все категории
        </button>

        <select
          value={selectedCategory?._id || ""}
          onChange={(e) => {
            const category = mainCategories.find(c => c._id === e.target.value);
            handleCategorySelect(category || null);
          }}
          className="bg-[#f7f4ff] border-none text-[19px] outline-none text-[#1e1b29] cursor-pointer px-3 py-1 rounded-md"
        >
          <option value="">Выберите категорию</option>
          {mainCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name.ru}
            </option>
          ))}
        </select>

        {subcategories.length > 0 && (
          <select
            value={selectedSubcategory?._id || ""}
            onChange={(e) => {
              const subcategory = subcategories.find(c => c._id === e.target.value);
              handleSubcategorySelect(subcategory || null);
            }}
            className="bg-[#f7f4ff] text-[19px] border-none outline-none text-[#1e1b29] cursor-pointer px-3 py-1 rounded-md"
          >
            <option value="">Выберите подкатегорию</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name.ru}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 mt-10">
        <span className="text-[#a29bb6]">Сортировать:</span>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            onSortChange?.(e.target.value);
          }}
          className="bg-[#f7f4ff] border-none text-[19px] outline-none text-[#1e1b29] cursor-pointer px-3 py-1 rounded-md"
        >
          <option>{t("sort.popularity")}</option>
          <option>{t("sort.newest")}</option>
          <option>{t("sort.priceAsc")}</option>
          <option>{t("sort.priceDesc")}</option>
        </select>
      </div>
    </div>
  );
}
