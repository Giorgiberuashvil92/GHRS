"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Article from "../../components/Article";
import DesktopNavbar from "../../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../../components/Header";
import MobileNavbar from "../../components/Navbar/MobileNavbar";
import { getArticleById } from "../../api/articles";
import type { Article as ArticleType } from "../../api/articles";

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid article ID");
        setLoading(false);
        return;
      }

      try {
        const data = await getArticleById(params.id);
        setArticle(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Article not found...</div>;
  }

  return (
    <div className="bg-[#F9F7FE] py-1">
      <DesktopNavbar
        menuItems={defaultMenuItems}
        blogBg={true}
        allCourseBg={false}
      />
      <MobileNavbar />

      <div className="mx-10">
        <Article article={article} />
      </div>
    </div>
  );
}
