"use client";
import React, { useRef, useState, useMemo } from "react";
import Banner from "./Banner";
import SliderArrows from "./SliderArrows";
import GridLayouts, { LayoutType } from "./GridLayouts";
import { useI18n } from "../context/I18nContext";

// import { useBlogs } from "../hooks/useBlogs";
import { useArticles } from "../hooks/useArticles";
import { useCategories } from "../hooks/useCategories";

interface BlogProps {
  withBanner: boolean;
  withSlider: boolean;
  layoutType?: LayoutType;
  title?: string;
  showCategories?: boolean;
}

interface Blog {
  _id: string;
  title: {
    [key in "ka" | "en" | "ru"]: string;
  };
  description: {
    [key in "ka" | "en" | "ru"]: string;
  };
  excerpt: {
    [key in "ka" | "en" | "ru"]: string;
  };
  content: {
    [key in "ka" | "en" | "ru"]: string;
  };
  imageUrl?: string;
  featuredImages: string[];
  articles?: Array<{
    _id: string;
    title: {
      [key in "ka" | "en" | "ru"]: string;
    };
    excerpt: {
      [key in "ka" | "en" | "ru"]: string;
    };
    author: {
      name: string;
      bio?: string;
      avatar?: string;
    };
    readTime: string;
    viewsCount: number;
    likesCount: number;
    createdAt: string;
  }>;
}

const Blog: React.FC<BlogProps> = ({
  withBanner,
  withSlider,
  layoutType = "default",
  title,
  showCategories = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);


  const { t, locale } = useI18n();
  const { categories } = useCategories();
  const blogsPerPage = 4;

  const { articles, loading: articlesLoading } = useArticles({
    isFeatured: true,
    isPublished: true,
  });



  // Helper to get localized text
  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined
  ): string => {
    if (!field) return "";
    return (
      field[locale as keyof typeof field] ||
      field.en ||
      ""
    );
  };






  const totalPages = useMemo(() => {
    if (!articles?.length) return 0;
    const rest = articles.slice(1);
    return Math.max(1, Math.ceil(rest.length / blogsPerPage));
  }, [articles, blogsPerPage]);

  const scrollLeft = (): void => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (): void => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const canScrollLeft = currentPage > 0;
  const canScrollRight = currentPage < totalPages - 1;



  if (articlesLoading) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <div className="bg-[#F9F7FE] md:pb-10 md:mx-5 md:rounded-[20px]"> 
      {withBanner && (
        <Banner
          backgroundUrl="/assets/images/blog.png"
          logoUrl="/assets/images/simpleLogo.svg"
          icon="/assets/images/media.png"
          iconHeight={33}
          iconWidth={125}
        />
      )}

      <div className="py-5 md:px-6">
        {withSlider && articles?.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] leading-[120%] md:my-5 md:mx-3 text-[#3D334A] md:text-[40px] md:tracking-[-3%] font-bowler">
              {title || t("navigation.blog")}
            </h2>
            <SliderArrows
              onScrollLeft={scrollLeft}
              onScrollRight={scrollRight}
              canScrollLeft={canScrollLeft} 
              canScrollRight={canScrollRight}
            />
          </div>
        )}

        {articles?.length > 0 && (
          <GridLayouts
            blogs={articles}
            layoutType={layoutType}
            scrollRef={scrollRef}
            currentPage={currentPage}
            blogsPerPage={blogsPerPage}
            showHeader={showCategories}
          />
        )}

        {/* Dynamic Blog sections for each category */}
        {showCategories && categories?.length > 0 && categories.map((category) => {
          const categoryArticles = articles?.filter(article => {
            const catId = article?.categoryId;
            // categoryId can be string or array
            if (Array.isArray(catId)) {
              return catId.some(id => {
                if (id === category?._id) return true;
                return category?.subcategories && Array.isArray(category.subcategories) && category.subcategories.includes(id);
              });
            }
            if (typeof catId === 'string' && catId === category?._id) return true;
            return category?.subcategories && Array.isArray(category.subcategories) && typeof catId === 'string' && category.subcategories.includes(catId);
          }) || [];

          // Only render if category has articles
          if (categoryArticles.length === 0) return null;
          
          return (
            <div key={category?._id} className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] leading-[120%] md:my-5 md:mx-3 text-[#3D334A] md:text-[40px] md:tracking-[-3%] font-bowler">
                  {getLocalizedText(category?.name)}
                </h2>
              </div>
              
              <GridLayouts
                blogs={categoryArticles?.length ? categoryArticles : []}
                layoutType={layoutType}
                scrollRef={scrollRef}
                currentPage={0}
                blogsPerPage={blogsPerPage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
