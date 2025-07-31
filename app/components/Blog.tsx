"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import Banner from "./Banner";
import SliderArrows from "./SliderArrows";
import GridLayouts, { LayoutType } from "./GridLayouts";
import { useI18n } from "../context/I18nContext";
import { API_CONFIG, apiRequest } from "../config/api";
import { useArticles } from "../hooks/useArticles";
import { useCategories } from "../hooks/useCategories";

interface BlogProps {
  withBanner: boolean;
  withSlider: boolean;
  layoutType?: LayoutType;
  title?: string;
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
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useI18n();
  const { categories } = useCategories();
  const blogsPerPage = 4;
  console.log(title)

  const { articles } = useArticles({
    page: currentPage,
    limit: 4,
  });

  console.log('Blog Categories:', categories);
  console.log('Blog Articles:', articles);

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



  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<Blog[]>(API_CONFIG.ENDPOINTS.BLOGS.WITH_ARTICLES);
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  const totalPages = useMemo(() => {
    const otherBlogs = blogs.slice(1);
    return Math.ceil(otherBlogs.length / blogsPerPage);
  }, [blogs, blogsPerPage]);

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



  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  if (error) {
    return <div>{t("common.error")}: {error}</div>;
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
        {/* Popular Articles - All articles */}
        {withSlider && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] leading-[120%] md:my-5 md:mx-3 text-[#3D334A] md:text-[40px] md:tracking-[-3%]">
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

        <GridLayouts
          blogs={articles || []}
          layoutType={layoutType}
          scrollRef={scrollRef}
          currentPage={currentPage}
          blogsPerPage={blogsPerPage}
        />

        {/* Dynamic Blog sections for each category */}
        {categories.map((category) => {
          const categoryArticles = articles?.filter(article => {
            // Handle both single categoryId and array of categoryIds
            if (Array.isArray(article.categoryId)) {
              // Check if any of the article's categoryIds match this category
              // or if any of them are subcategories of this category
              return article.categoryId.some(catId => {
                // Direct match with main category
                if (catId === category._id) return true;
                
                // Check if this catId is a subcategory of current category
                return category.subcategories && category.subcategories.includes(catId);
              });
            }
            
            // Single categoryId case
            if (article.categoryId === category._id) return true;
            
            // Check if single categoryId is a subcategory of current category
            return category.subcategories && category.subcategories.includes(article.categoryId);
          }) || [];
          
          console.log(`Category: ${getLocalizedText(category.name)} (${category._id})`);
          console.log(`Category subcategories:`, category.subcategories);
          console.log(`Articles found: ${categoryArticles.length}`);
          if (categoryArticles.length > 0) {
            console.log('Category articles:', categoryArticles.map(a => ({
              title: a.title.en,
              categoryId: a.categoryId
            })));
          }
          
          // Only render if category has articles
          if (categoryArticles.length === 0) return null;
          
          return (
            <div key={category._id} className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] leading-[120%] md:my-5 md:mx-3 text-[#3D334A] md:text-[40px] md:tracking-[-3%]">
                  {getLocalizedText(category.name)}
                </h2>
              </div>
              
              <GridLayouts
                blogs={categoryArticles}
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
