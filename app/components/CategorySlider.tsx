"use client";

import Link from "next/link";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useCategories } from "../hooks/useCategories";
import SubcategoryDropdown from "./SubcategoryDropdown";

const backgrounds = [
  "/assets/images/categorySliderBgs/bg1.jpg",
  "/assets/images/categorySliderBgs/bg2.jpg",
  "/assets/images/categorySliderBgs/bg3.png",
  "/assets/images/categorySliderBgs/bg1.jpg",
];

const getValidImageUrl = (
  url: string | null | undefined,
  fallback: string
): string => {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  if (url.startsWith("data:")) return url;
  return fallback;
};

// Helper function to get text by locale
interface LocalizedString {
  ka: string;
  en: string;
  ru: string;
  _id: string;
}

const getLocalizedText = (
  localizedString: LocalizedString | string | null | undefined,
  locale: string = "ru"
): string => {
  if (typeof localizedString === "string") return localizedString;
  if (typeof localizedString === "object" && localizedString) {
    return (
      localizedString[locale as keyof LocalizedString] ||
      localizedString.ru ||
      localizedString.en ||
      localizedString.ka ||
      ""
    );
  }
  return "";
};

interface CategorySliderProps {
  onCategoryClick?: (categoryId: string, categoryTitle: string) => void;
}

const CategorySlider = forwardRef<HTMLDivElement, CategorySliderProps>(
  ({ onCategoryClick }, ref) => {
    const { categories, loading, error } = useCategories();
    const [clickedCategory, setClickedCategory] = useState<string | null>(null);

    // Get current locale
    const [locale, setLocale] = useState("ru");
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedLocale = localStorage.getItem("locale");
        if (storedLocale && ["ka", "ru", "en"].includes(storedLocale)) {
          setLocale(storedLocale);
        }
      }
    }, []);

    



    useImperativeHandle(ref, () => sliderRef.current as HTMLDivElement);

    const sliderRef = React.useRef<HTMLDivElement | null>(null);

    const handleCategoryClick = (
      categoryId: string,
      categoryTitle: string,
      event?: React.MouseEvent
    ) => {
      if (onCategoryClick) {
        event?.preventDefault();
        onCategoryClick(categoryId, categoryTitle);
      }
    };

    const handleDropdownToggle = (
      categoryId: string,
      event: React.MouseEvent
    ) => {
      event.preventDefault();
      event.stopPropagation();
      setClickedCategory((prev) => (prev === categoryId ? null : categoryId));
    };

    const handleDropdownClose = () => setClickedCategory(null);
    const isDropdownOpen = (categoryId: string) =>
      clickedCategory === categoryId;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          target.closest(".dropdown-arrow") ||
          target.closest(".dropdown-content")
        ) {
          return;
        }
        setClickedCategory(null);
      };

      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

    if (loading) {
      return (
        <div className="relative md:mt-10 mt-5">
          <div className="flex items-center gap-[14px] md:gap-[26px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 animate-pulse">
                <div className="bg-gray-200 rounded-[20px] w-[240px] h-[140px] md:w-[455px] md:h-[230px]"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="relative md:mt-10">
          <div className="text-red-500 text-center p-4">
            Error loading categories: {error}
          </div>
        </div>
      );
    }

    return (
      <div className="relative md:mt-10 mt-2">
        <div
          ref={sliderRef}
          className="flex items-start  gap-[14px] md:gap-[26px] overflow-x-auto scrollbar-hide overflow-y-visible md:overflow-hidden scroll-smooth"
        >
          {categories.map((category, index) => {
            const categoryTitle = getLocalizedText(category.name, locale);

            const backgroundImageUrl = backgrounds[index % backgrounds.length];
            const categoryImageUrl = getValidImageUrl(
              category.image,
              "/assets/images/services/category.png"
            );

            const hasSubcategories =
              category.subcategories && category.subcategories.length > 0;

            return (
              <div
                key={category._id}
                className="flex-shrink-0 flex flex-col relative z-10 overflow-visible "
              >
                <Link
                  href={`/categories/${category._id}`}
                  onClick={(e) => {
                   
                    handleCategoryClick(category._id, categoryTitle, e);
                  }}
                  className="group cursor-pointer transform transition-transform duration-300"
                >
                  <div
                    className="bg-conic rounded-[14px] w-[330px] h-[240px] md:w-[550px] md:h-[330px] p-2 "
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                  >
                    <div
                      className="h-[80%] bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url(${categoryImageUrl})` }}
                    ></div>
                    {/* <Image
                      src={categoryImageUrl}
                      width={232}
                      height={82}
                      alt={categoryTitle}
                      className="mx-auto rounded-[14px] bg-cover md:w-[443px] md:h-[163px]"
                    /> */}

                    {/* Bottom Text */}
                    <div className="flex items-center justify-between bg-white my-2 px-4 rounded-2xl text-black group-hover:bg-gray-50 transition-colors duration-300">
                      <h4
                        className="my-1 md:my-2 text-[22px] bg-conic md:text-[28px] font-bold overflow-hidden whitespace-nowrap tracking-[-3%] text-ellipsis max-w-[390px]"
                        style={{
                          backgroundImage: `url(${backgroundImageUrl})`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundSize: "conic",
                          backgroundPosition: "center",
                        }}
                      >
                        {categoryTitle}
                      </h4>
                      <div
                        className="bg-[#E9DFF6] w-6 h-6 flex items-center justify-center rounded group-hover:bg-[#D4BAFC] transition-colors cursor-pointer relative z-20 dropdown-arrow"
                        onClick={(e) => {
                          if (hasSubcategories) {
                            handleDropdownToggle(category._id, e);
                          }
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transition-transform duration-200 ${
                            isDropdownOpen(category._id) ? "rotate-90" : ""
                          }`}
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="#734ea4"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
                <SubcategoryDropdown
                  // subcategories={[]} // subcategories არ არის populated useCategories hook-ში
                  subcategories={category.subcategories || []}
                  isOpen={isDropdownOpen(category._id)}
                  onClose={handleDropdownClose}
                  categoryId={category._id}
                />
              </div>
            );
          })}
        </div>
        {/* <hr className="md:mt-10 bg-[#D5D1DB]" /> */}
      </div>
    );
  }
);

CategorySlider.displayName = "CategorySlider";
export default CategorySlider;
