"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Subcategory {
  _id: string;
  name: {
    ka: string;
    en: string;
    ru: string;
  };
  description?: {
    ka: string;
    en: string;
    ru: string;
  };
}

interface SubcategoryDropdownProps {
  subcategories: Subcategory[] | any;
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
}

const SubcategoryDropdown = ({
  subcategories,
  isOpen,
  onClose,
  categoryId,
}: SubcategoryDropdownProps) => {
  const router = useRouter();
  if (!isOpen || subcategories.length === 0) return null;

  // ვიღებთ ენის პარამეტრს
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

  return (
    <div className="sticky top-[10px] left-[2px] z-[99999] bg-white border border-[#E9DFF6] rounded-[20px] shadow-lg dropdown-content animate-in fade-in-0 zoom-in-95 duration-200 mt-2 w-[240px] md:w-[455px]">
      {subcategories.map((subcategory: { _id: React.Key | null | undefined; name: { ka: string; en: string; ru: string; } | undefined; }, index: number) => (
        <button
          key={subcategory._id}
          type="button"
          onClick={() => {
            onClose();
            // ვქმნით URL-ს პარამეტრებით
            const url = `/categories/section?subcategoryId=${subcategory._id}${categoryId ? `&categoryId=${categoryId}` : ''}`;
            router.push(url);
          }}
          className={`
            flex items-center justify-between w-full p-3 md:p-4 cursor-pointer
            hover:bg-[#F9F7FE] transition-colors duration-200
            ${
              index !== subcategories.length - 1
                ? "border-b border-[#E9DFF6]"
                : ""
            }
            ${index === 0 ? "rounded-t-[20px]" : ""}
            ${index === subcategories.length - 1 ? "rounded-b-[20px]" : ""}
            group
          `}
        >
          <span className="text-[#3D334A] font-righteous text-sm md:text-base group-hover:text-[#734ea4] transition-colors duration-200">
            {getLocalizedText(subcategory.name, locale)}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:translate-x-1 transition-transform duration-200"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#D4BAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-[#734ea4] transition-colors duration-200"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default SubcategoryDropdown;
