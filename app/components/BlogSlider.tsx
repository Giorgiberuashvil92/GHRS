// BlogSlider.tsx
"use client";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";
// import { useCategories } from "../hooks/useCategories";

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
  imageUrl: string;
  featuredImages: string[];
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
  }> | string[];  // Can be either array of objects or array of strings
}

interface BlogSliderProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Blog[];
  language: "ka" | "en" | "ru";
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
  language
}) => {
  const isDesktop = useIsDesktop();
  const featuredBlog = blogs[0];
  const otherBlogs = blogs.slice(1);
  const { t } = useI18n();
  
  console.log("BlogSlider - featuredBlog:", featuredBlog);
  console.log("BlogSlider - featuredBlog._id:", featuredBlog?._id);
  console.log("BlogSlider - blogs structure:", blogs.map(b => ({ _id: b._id, title: b.title })));

  const getCurrentBlogs = () => {
    const startIndex = currentPage * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return otherBlogs.slice(startIndex, endIndex);
  };

  // Helper function to get article link
  const getArticleLink = (blog: Blog) => {
    // Check if blog exists
    if (!blog || !blog._id) {
      return '#';
    }

    // For now, link directly to the blog article itself
    // Since the data structure shows this is actually an article, not a blog with multiple articles
    return `/article/${blog._id}`;
  };

  // const getArticleCount = (count: number) => {
  //   if (count === 1) {
  //     return t("blog.articles_count_one");
  //   }
  //   return t("blog.articles_count", { count: String(count) });
  // };

  return (
    <div className="w-full font-[Pt]">
      <div className="flex md:flex-row flex-col gap-2.5 mb-10 w-full px-0">
        {/* Featured Blog */}
        {featuredBlog && isDesktop && (
          <Link href={getArticleLink(featuredBlog)}>
            <div className="bg-white md:p-2 md:pb-5 md:h-[518px] w-[280px] md:w-auto flex-shrink-0 rounded-[20px] flex-col justify-between snap-center">
              <div className="relative min-w-[300px] max-w-[690px]">
                <Image
                  src={featuredBlog.featuredImages?.[0] || featuredBlog.imageUrl || ''}
                  width={694}
                  height={232}
                  alt={featuredBlog.title[language]}
                  className="md:h-[232px] object-cover rounded-[20px]"
                />
                <div className="text-[#3D334A] tracking-[0%] md:mt-[10px] mt-0 md:mb-2 mb-2 text-[14px] md:text-[24px] leading-[120%] font-semibold px-3">
                  <div className="line-clamp-2">{featuredBlog.title[language]?.trim()}</div>
                </div>
                <div className="mt-0 text-[#846FA0] font-medium leading-[120%] tracking-[0%] px-3">
                  <div dangerouslySetInnerHTML={{ __html: featuredBlog?.content[language].slice(0, 90) }} />
                </div>
                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3 font-[Bowler] mt-4">
                {/* <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                  {getArticleCount(featuredBlog.articles?.length || 0)}
                </span> */}
              </div>
            </div>
          </Link>
        )}

        {/* Desktop Grid */}
        {isDesktop ? (
          <div className="relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-5">
              {getCurrentBlogs().map((blog) => (
                <Link key={blog._id} href={getArticleLink(blog)}>
                  <div className="min-w-[200px] max-w-full md:h-[249px] p-5 bg-white flex flex-col justify-between rounded-[20px]">
                    <p className="text-[#3D334A] text-[18px] leading-[120%] line-clamp-2 font-bold md:text-[24px]">
                      {blog.title[language]}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      {/* <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                        {getArticleCount(blog.articles?.length || 0)}
                      </span> */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-10 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                          <CiBookmark className="w-[14.2px] h-[18.68px] text-black" />
                        </div>
                        <div className="w-10 h-10 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                          <IoIosShareAlt className="w-[14.2px] h-[18.68px] text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex overflow-auto gap-5 flex-row overflow-x-auto snap-x snap-mandatory">
            {otherBlogs.map((blog) => (
              <Link key={blog._id} href={getArticleLink(blog)}>
                <div className="w-[200px] flex-shrink-0 p-3 bg-white flex flex-col justify-between rounded-[10px] snap-center">
                  <Image
                    src={blog.featuredImages?.[0] || blog.imageUrl || ''}
                    width={189}
                    height={172}
                    alt={blog.title[language]}
                    className="flex"
                  />
                  <p className="text-[#3D334A] text-[14px] leading-[120%] mt-2 line-clamp-2">
                    {blog.title[language]}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    {/* <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                      {getArticleCount(blog.articles?.length || 0)}
                    </span> */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                        <CiBookmark className="text-black" />
                      </div>
                      <div className="w-8 h-8 bg-[#F9F7FE] rounded-[6px] flex justify-center items-center">
                        <IoIosShareAlt className="text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <span className="text-[#D4BAFC] leading-[90%] text-[15px] md:text-[24px] md:px-5 px-0 cursor-pointer">
        {t("blog.see_all")} {t("navigation.rightArrow")}
      </span>
    </div>
  );
};

export default BlogSlider;

