"use client";

import { getDefaultMenuItems } from "../components/Header/Header";
import Link from "next/link";
import Image from "next/image";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { Footer } from "../components/Footer";
import SubHeader from "../components/Header/SubHeader";
// import { useBlogs, useFeaturedBlogs, usePopularBlogs } from "../hooks/useBlogs";
import { useArticles } from "../hooks/useArticles";
import { useI18n } from "../context/I18nContext";
import type { Article } from "../api/articles";

// Limit long texts to a reasonable number of characters while keeping line-clamp for layout
const clampText = (text: string, max: number): string => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
};

interface BlogCardProps {
  article?: Article;
}

const BlogCard = ({ article }: BlogCardProps) => {
  const { t, locale } = useI18n();

  if (!article) {
    return (
      <div className="bg-white rounded-[20px] p-5 flex flex-col justify-between h-full shadow-sm animate-pulse">
        <div className="flex flex-col gap-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const getLocalizedText = (field: { en: string; ru: string; ka?: string }) => {
    return field[locale as keyof typeof field] || field.ru || field.en || "";
  };

  // Get category name
  const getCategoryName = () => {
    if (article.categories && article.categories.length > 0) {
      return getLocalizedText(article.categories[0].name);
    }
    if (article.category?.name) {
      return getLocalizedText(article.category.name);
    }
    // Check if categoryId is populated object (from backend populate)
    if (article.categoryId && typeof article.categoryId === 'object' && !Array.isArray(article.categoryId)) {
      const categoryObj = article.categoryId as any;
      if (categoryObj.name) {
        return getLocalizedText(categoryObj.name);
      }
    }
    // Check if categoryId is array of populated objects
    if (Array.isArray(article.categoryId) && article.categoryId.length > 0) {
      const firstCategory = article.categoryId[0] as any;
      if (firstCategory && typeof firstCategory === 'object' && firstCategory.name) {
        return getLocalizedText(firstCategory.name);
      }
    }
    return "";
  };

  const categoryName = getCategoryName();

  return (
    <Link href={`/article/${article._id}`}>
      <div className="bg-white rounded-[20px] p-5 flex flex-col justify-between h-full shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="flex flex-col gap-3">
          <h3 className="font-bowler text-[#1A1A1A] text-xl font-semibold leading-tight line-clamp-2">
            {clampText(getLocalizedText(article.title), 90)}
          </h3>
          <p className="font-pt text-[#1A1A1A]/70 text-sm line-clamp-3">
            {clampText(getLocalizedText(article.excerpt), 180)}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="items-center flex">
            {categoryName && (
              <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[12px] font-bold leading-[90%] uppercase font-bowler">
                {categoryName}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.593 3.322C18.693 3.45 19.5 4.399 19.5 5.507V21L12 17.25L4.5 21V5.507C4.5 4.399 5.306 3.45 6.407 3.322C10.123 2.89 13.877 2.89 17.593 3.322Z"
                  stroke="#667085"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  stroke="#667085"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface BigBlogCardProps {
  article?: Article;
}

const BigBlogCard = ({ article }: BigBlogCardProps) => {
  const { t, locale } = useI18n();

  if (!article) {
    return (
      <div className="rounded-[20px] h-full md:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden bg-white shadow-sm animate-pulse">
        <div className="absolute top-0 left-0 w-full h-[45%] overflow-hidden bg-gray-200"></div>
        <div className="flex flex-col gap-4 mt-auto relative z-10">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const getLocalizedText = (field: { en: string; ru: string; ka?: string }) => {
    return field[locale as keyof typeof field] || field.ru || field.en || "";
  };

  // Get category name
  const getCategoryName = () => {
    if (article.categories && article.categories.length > 0) {
      return getLocalizedText(article.categories[0].name);
    }
    if (article.category?.name) {
      return getLocalizedText(article.category.name);
    }
    // Check if categoryId is populated object (from backend populate)
    if (article.categoryId && typeof article.categoryId === 'object' && !Array.isArray(article.categoryId)) {
      const categoryObj = article.categoryId as any;
      if (categoryObj.name) {
        return getLocalizedText(categoryObj.name);
      }
    }
    // Check if categoryId is array of populated objects
    if (Array.isArray(article.categoryId) && article.categoryId.length > 0) {
      const firstCategory = article.categoryId[0] as any;
      if (firstCategory && typeof firstCategory === 'object' && firstCategory.name) {
        return getLocalizedText(firstCategory.name);
      }
    }
    return "";
  };

  const categoryName = getCategoryName();

  return (
    <Link href={`/article/${article._id}`}>
      <div className="rounded-[20px] h-full md:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Add image div that takes up the top space */}
        <div className="absolute top-0 left-0 w-full h-[45%] overflow-hidden">
          <Image
            src={article.featuredImages?.[0] || "/assets/images/blogbg.jpg"}
            alt={getLocalizedText(article.title)}
            fill
            className="object-cover opacity-80"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#6941C6]" /> */}
        </div>

        {/* Existing buttons */}
        <div className="absolute top-8 right-8 flex flex-col gap-4 z-10">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.593 3.322C18.693 3.45 19.5 4.399 19.5 5.507V21L12 17.25L4.5 21V5.507C4.5 4.399 5.306 3.45 6.407 3.322C10.123 2.89 13.877 2.89 17.593 3.322Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Existing text content */}
        <div className="flex flex-col gap-4 mt-auto relative z-10">
          {categoryName && (
            <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[12px] font-bold leading-[90%] uppercase font-bowler self-start">
              {categoryName}
            </span>
          )}
          <h2 className="font-bowler text-[#1A1A1A] text-lg md:text-xl font-semibold leading-tight line-clamp-2">
            {clampText(getLocalizedText(article.title), 110)}
          </h2>
          <p className="font-pt text-[#1A1A1A]/80 text-sm line-clamp-3">
            {clampText(getLocalizedText(article.excerpt).slice(0, 100), 100)}
          </p>
          
        </div>
      </div>
    </Link>
  );
};

interface BlogHeaderProps {
  BlogCategory: string;
  totalCount?: number;
}

const BlogHeader = ({ BlogCategory, totalCount }: BlogHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-[#F9F7FE] md:mx-5 md:px-10 px-4 pb-6">
      <h1 className="font-bowler text-[32px] md:text-[64px] pt-10 text-[#3D334A] leading-[100%] tracking-[-1%] uppercase">
        {BlogCategory}
      </h1>

      {totalCount && (
        <Link
          href="/categories"
          className="font-pt text-[20px] md:text-[32px] uppercase text-[#D4BAFC] hover:text-[#C4A6F1] transition-colors inline-block mt-4 font-medium leading-[110%]"
        >
          {t("blog.see_all")} →
        </Link>
      )}
    </div>
  );
};

const BlogRoute = () => {
  const { t } = useI18n();
  const { articles: allArticles } = useArticles({ isPublished: true, limit: 8 });
  const { articles: featuredArticles } = useArticles({ isFeatured: true, isPublished: true, limit: 4 });
  const { articles: popularArticles } = useArticles({ isPublished: true, limit: 6 });
  const menuItems = getDefaultMenuItems(t);
  
  // TODO: Get actual total count from API
  const totalArticles = 439;

  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar
        menuItems={menuItems}
        blogBg={true}
        allCourseBg={false}
      />
      <MobileNavbar />
      {/* <Header variant="blog" /> */}
      <SubHeader />

      {/* Featured Blogs Section */}
      <BlogHeader BlogCategory={t("navigation.blog")} totalCount={totalArticles} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-12 px-10">
        <div className="col-span-2">
          <BigBlogCard article={featuredArticles[0]} />
        </div>

        <div className="col-span-2 gap-6 grid grid-cols-1 md:grid-cols-2 h-[500px]">
          <BlogCard article={allArticles[0]} />
          <BlogCard article={allArticles[1]} />
          <BlogCard article={allArticles[2]} />
          <BlogCard article={allArticles[3]} />
        </div>
      </div>

      {/* Popular Articles Section */}
      <BlogHeader BlogCategory={t("blog.popular_articles")} totalCount={1} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-12 px-10">
        <BigBlogCard article={popularArticles[0]} />
        <BigBlogCard article={popularArticles[1]} />
        <div className="col-span-2 gap-6 grid  grid-cols-1 md:grid-cols-2 h-[500px]">
          <div className="col-span-2">
            <BlogCard article={popularArticles[2]} />
          </div>
          <BlogCard article={popularArticles[3]} />
          <BlogCard article={popularArticles[4]} />
        </div>
      </div>

      {/* Recent Articles Section */}
      <BlogHeader BlogCategory={t("blog.recent_articles")} totalCount={1} />
      <div className="grid grid-cols-2 md:grid-cols-4  gap-6 w-full mb-12 px-10">
        <div className="col-span-2">
          <BigBlogCard article={allArticles[4]} />
        </div>

        <div className="col-span-2 gap-6 grid grid-cols-1 md:grid-cols-2 h-[500px]">
          <BlogCard article={allArticles[5]} />
          <BlogCard article={allArticles[6]} />
          <BlogCard article={allArticles[7]} />
          <BlogCard article={featuredArticles[1]} />
        </div>
      </div>

      {/* All Articles Section */}
      <BlogHeader BlogCategory={t("blog.all_articles")} totalCount={1} />
      <div className="grid grid-cols-2 md:grid-cols-4  gap-6 w-full mb-12 px-10">
        <div className="col-span-2 gap-6 grid  grid-cols-1 md:grid-cols-2 h-[500px]">
          <div className="col-span-2">
            <BlogCard article={featuredArticles[2]} />
          </div>
          <BlogCard article={popularArticles[5]} />
          <BlogCard article={allArticles[0]} />
        </div>
        <div className="col-span-2 gap-6 grid grid-cols-1 md:grid-cols-2 h-[500px]">
          <BlogCard article={allArticles[1]} />
          <div className="row-span-2">
            <BigBlogCard article={featuredArticles[3]} />
          </div>
          <BlogCard article={allArticles[2]} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogRoute;
