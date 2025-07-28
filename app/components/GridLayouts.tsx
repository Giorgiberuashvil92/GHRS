// GridLayouts.tsx
"use client";
import React from "react";
import BlogSlider from "./BlogSlider";
import OtherGrid from "./OtherGrid";
import ThirdGrid from "./ThirdGrid";

export type LayoutType = "default" | "other" | "thirdGrid";

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

interface GridLayoutsProps {
  layoutType: LayoutType;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Blog[];
  language: "ka" | "en" | "ru";
}

const GridLayouts: React.FC<GridLayoutsProps> = ({
  layoutType,
  scrollRef,
  currentPage,
  blogsPerPage,
  blogs,
  language
}) => {
  // Mobile horizontal scroll wrapper
  return (
    <div className="sm:block flex sm:flex-col flex-row overflow-x-auto gap-4 p-2 sm:overflow-visible sm:gap-0">
      {/* Render the selected layout inside the scrollable row for mobile */}
      {(() => {
        switch (layoutType) {
          case "default":
            return (
              <BlogSlider
                blogs={blogs}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={language}
              />
            );
          case "other":
            return (
              <OtherGrid
                blogs={blogs}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={language}
              />
            );
          case "thirdGrid":
            return (
              <ThirdGrid
                blogs={blogs}
                scrollRef={scrollRef}
                currentPage={currentPage}
                blogsPerPage={blogsPerPage}
                language={language}
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
