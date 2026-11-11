// BlogSlider.tsx
"use client";
import { useArticleText } from "../hooks/useArticleText";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";

interface Blog {
  _id: string;
  title: {
    en: string;
    ru: string;
    ka?: string;
  };
  description: {
    en: string;
    ru: string;
    ka?: string;
  };
  excerpt: {
    en: string;
    ru: string;
    ka?: string;
  };
  imageUrl: string;
  categoryId: string | any;
  category?: {
    name: {
      en: string;
      ru: string;
      ka?: string;
    };
  };
  categories?: Array<{
    name: {
      en: string;
      ru: string;
      ka?: string;
    };
  }>;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishDate: Date;
  viewsCount: number;
  likesCount: number;
  isActive: boolean;
  sortOrder: number;
  featuredImages?: string[];
  articles?: unknown[];
}

interface BlogSliderProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Blog[];
  language: "ka" | "en" | "ru";
  showHeader?: boolean;
}

const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

const BlogSlider: React.FC<BlogSliderProps> = ({
  scrollRef,
  currentPage,
  blogsPerPage,
  blogs,
  language,
  showHeader = true,
}) => {
  const isDesktop = useIsDesktop();
  const featuredBlog = blogs[0];
  const otherBlogs = blogs.slice(1);
  const { t } = useI18n();
  const articleText = useArticleText();

  const getLocalizedText = (field: { en: string; ru: string; ka?: string } | undefined): string => {
    if (!field) return "";
    return field[language] || field.en || "";
  };

  const getCategoryName = (blog: Blog): string => {
    if (blog.categories && blog.categories.length > 0) {
      return getLocalizedText(blog.categories[0].name);
    }
    if (blog.category?.name) {
      return getLocalizedText(blog.category.name);
    }
    if (blog.categoryId && typeof blog.categoryId === 'object' && !Array.isArray(blog.categoryId)) {
      const categoryObj = blog.categoryId as any;
      if (categoryObj.name) {
        return getLocalizedText(categoryObj.name);
      }
    }
    if (Array.isArray(blog.categoryId) && blog.categoryId.length > 0) {
      const firstCategory = blog.categoryId[0] as any;
      if (firstCategory && typeof firstCategory === 'object' && firstCategory.name) {
        return getLocalizedText(firstCategory.name);
      }
    }
    return "";
  };

  const clampText = (text: string, max: number): string => {
    if (!text) return "";
    const trimmed = text.trim();
    return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
  };

  const getCurrentBlogs = () => {
    const startIndex = currentPage * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return otherBlogs.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(otherBlogs.length / blogsPerPage);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef?.current) return;

      const { scrollLeft, clientWidth } = scrollRef.current;
      const currentPageFromScroll = Math.round(scrollLeft / clientWidth);

      if (currentPageFromScroll !== currentPage) {
        const newPage = Math.min(Math.max(0, currentPageFromScroll), totalPages - 1);
        if (newPage !== currentPage) {
        }
      }
    };

    const scrollContainer = scrollRef?.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage, totalPages, scrollRef]);

  const getBlogLink = (blog: Blog) => {
    if (!blog || !blog._id) {
      return "#";
    }
    return `/article/${blog._id}`;
  };

  return (
    <div className="w-full" data-show-header={String(showHeader)}>
      <div className="flex md:flex-row flex-col gap-5 mb-10 w-full px-0">
        {/* Featured Blog */}
        {featuredBlog && isDesktop && (
          <Link href={getBlogLink(featuredBlog)} className="flex-1">
            <div className="bg-white p-8 hover:shadow-lg duration-300 transition-shadow h-[518px] rounded-[20px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[45%] overflow-hidden">
                <Image
                  src={
                    featuredBlog.featuredImages?.[0] ||
                    featuredBlog.imageUrl ||
                    "/assets/images/blogbg.jpg"
                  }
                  fill
                  alt={articleText(featuredBlog, "title")}
                  className="object-cover opacity-80"
                />
              </div>
              <div className="absolute top-8 right-8 flex flex-col gap-4 z-10">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <CiBookmark className="w-6 h-6 text-white" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <IoIosShareAlt className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col gap-4 mt-auto relative z-10">
                {getCategoryName(featuredBlog) && (
                  <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[12px] font-bold leading-[90%] uppercase font-bowler self-start">
                    {getCategoryName(featuredBlog)}
                  </span>
                )}
                <h2 className="font-bowler text-[#1A1A1A] text-lg md:text-xl font-semibold leading-tight">
                  {clampText(articleText(featuredBlog, "title"), 110)}
                </h2>
                <p className="font-pt text-[#1A1A1A]/80 text-sm line-clamp-3">
                  {clampText(articleText(featuredBlog, "excerpt") || getLocalizedText(featuredBlog.description) || "", 100)}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Desktop Grid */}
        {isDesktop ? (
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-5 h-full">
              {getCurrentBlogs().map((blog) => (
                <Link key={blog._id} href={getBlogLink(blog)}>
                  <div className="h-[249px] p-5 bg-white flex flex-col justify-between rounded-[20px] hover:shadow-lg duration-300 transition-shadow">
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bowler text-[#1A1A1A] text-xl font-semibold leading-tight">
                        {clampText(articleText(blog, "title"), 90)}
                      </h3>
                      <p className="font-pt text-[#1A1A1A]/70 text-sm line-clamp-3">
                        {clampText(articleText(blog, "excerpt") || getLocalizedText(blog.description) || "", 180)}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="items-center flex">
                        {getCategoryName(blog) && (
                          <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[12px] font-bold leading-[90%] uppercase font-bowler">
                            {getCategoryName(blog)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <CiBookmark className="w-6 h-6 text-[#667085]" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <IoIosShareAlt className="w-6 h-6 text-[#667085]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-auto gap-5 flex-row overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {getCurrentBlogs().map((blog) => (
              <Link key={blog._id} href={getBlogLink(blog)}>
                <div className="w-[200px] flex-shrink-0 p-3 bg-white flex flex-col justify-between rounded-[10px]">
                  <Image
                    src={blog.featuredImages?.[0] || blog.imageUrl || ""}
                    width={189}
                    height={172}
                    alt={articleText(blog, "title")}
                    className="rounded-[10px]"
                  />
                  <p className="text-[#1A1A1A] text-sm leading-tight mt-2 line-clamp-2 font-semibold font-bowler">
                    {articleText(blog, "title")}
                  </p>
                  <div className="flex justify-end items-center gap-1.5 mt-2">
                    <div className="w-8 h-8 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                      <CiBookmark className="text-black" />
                    </div>
                    <div className="w-8 h-8 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                      <IoIosShareAlt className="text-black" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Link
        href="/blog"
        className="text-[#D4BAFC] leading-[90%] text-[15px] md:text-[24px] md:px-5 px-0 cursor-pointer hover:text-[#734ea4] transition-colors duration-300 font-bowler"
      >
        {t("blog.see_all", { count: blogs?.length.toString() })} →
      </Link>
    </div>
  );
};

export default BlogSlider;
