"use client";

import { useState, useEffect } from "react";

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
}

export default function CategoryFilter({ onCategoryChange, onSubcategoryChange }: CategoryFilterProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
  const [sort, setSort] = useState("По популярности");

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
        console.log('Fetching categories...');
        const response = await fetch('http://localhost:4000/categories');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        console.log('Fetched categories:', data);
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
    console.log('Selecting category:', category);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    onCategoryChange(category?._id || null);
    onSubcategoryChange(null);
  };

  const handleSubcategorySelect = (subcategory: Category | null) => {
    console.log('Selecting subcategory:', subcategory);
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
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#f7f4ff] border-none text-[19px] outline-none text-[#1e1b29] cursor-pointer px-3 py-1 rounded-md"
        >
          <option>По популярности</option>
          <option>По новизне</option>
        </select>
      </div>
    </div>
  );
}
