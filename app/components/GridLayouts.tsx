// GridLayouts.tsx
"use client";
import React from "react";
import BlogSlider from "./BlogSlider";
import OtherGrid from "./OtherGrid";
import ThirdGrid from "./ThirdGrid";
import { useI18n } from "../context/I18nContext";
import { Article } from "../api/articles";

export type LayoutType = "default" | "other" | "thirdGrid";

export interface Blog {
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
  }>;
}

interface GridLayoutsProps {
  layoutType: LayoutType;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Article[];
}

const GridLayouts: React.FC<GridLayoutsProps> = ({
  layoutType,
  scrollRef,
  currentPage,
  blogsPerPage,
  blogs,
}) => {
  const { locale } = useI18n();
  // Mobile horizontal scroll wrapper
  return (
    <div className="sm:block flex sm:flex-col flex-row overflow-x-auto gap-4 p-2 sm:overflow-visible sm:gap-0">
      {/* Render the selected layout inside the scrollable row for mobile */}
      {(() => {
        switch (layoutType) {
          case "default":
            return (
              <BlogSlider
                blogs={blogs as unknown as Blog[]}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={locale}
              />
            );
          case "other":
            return (
              <OtherGrid
                blogs={blogs as unknown as Blog[]}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={locale}
              />
            );
          case "thirdGrid":
            return (
              <ThirdGrid
                blogs={blogs as unknown as Blog[]}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={locale}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default GridLayouts;
