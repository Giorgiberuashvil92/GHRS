"use client";

import React from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import ArticleWithSlider from "../components/ArticleWithSlider";
import Article from "../components/Article";
import type { Article as ArticleType } from "../api/articles";

const defaultArticle: ArticleType = {
  _id: "1",
  title: {
    ka: "სტატია",
    en: "Article",
    ru: "Статья",
  },
  content: {
    ka: "კონტენტი",
    en: "Content",
    ru: "Контент",
  },
  excerpt: {
    ka: "მოკლე აღწერა",
    en: "Short description",
    ru: "Краткое описание",
  },
  blogId: "1",
  categoryId: "1",
  category: {
    _id: "1",
    name: {
      ka: "კატეგორია",
      en: "Category",
      ru: "Категория",
    },
  },
  author: {
    name: "Admin",
    bio: "",
    avatar: "",
  },
  commentsCount: 0,
  readTime: "5",
  tableOfContents: [],
  comments: [],
  featuredImages: [],
  tags: [],
  isPublished: true,
  isFeatured: false,
  publishDate: new Date(),
  viewsCount: 0,
  likesCount: 0,
  isActive: true,
  sortOrder: 0,
};

const ArticlePage = () => {
  return (
    <div className="bg-[#F9F7FE] py-1">
      <DesktopNavbar
        menuItems={defaultMenuItems}
        blogBg={true}
        allCourseBg={true}
      />
      <MobileNavbar />
      <div className="mx-10">
        <ArticleWithSlider />
        <Article article={defaultArticle as ArticleType} />
      </div>
    </div>
  );
};

export default ArticlePage;
