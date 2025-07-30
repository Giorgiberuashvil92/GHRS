"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import Banner from "./Banner";
import SliderArrows from "./SliderArrows";
import GridLayouts, { LayoutType } from "./GridLayouts";
import { useI18n } from "../context/I18nContext";
import { API_CONFIG, apiRequest } from "../config/api";
import { Article } from "../api/articles";
import { useArticles } from "../hooks/useArticles";

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
  imageUrl: string;
  articles: Array<{
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
  const { articles, loading: articlesLoading, error: articlesError } = useArticles({
    page: currentPage,
  });
  console.log(articles);
  const { t } = useI18n();
  const blogsPerPage = 4;

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

  // Add debugging
  console.log('Blog component props:', {
    title,
    withSlider,
    layoutType
  });

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
        {withSlider && (
          <div className="flex items-center justify-between mb-4">
            <div className="w-[200px] md:w-[400px] overflow-hidden">
              <h2 className="text-[20px] leading-[120%] md:my-5 md:mx-3 text-[#3D334A] md:text-[40px] md:tracking-[-3%] truncate" title={title || t("navigation.blog")}>
                {title || t("navigation.blog")}
              </h2>
            </div>
            <SliderArrows
              onScrollLeft={scrollLeft}
              onScrollRight={scrollRight}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
            />
          </div>
        )}

        <GridLayouts
          blogs={articles as unknown as Article[]}
          layoutType={layoutType}
          scrollRef={scrollRef}
          currentPage={currentPage}
          blogsPerPage={blogsPerPage}
        />
      </div>
    </div>
  );
};

export default Blog;
