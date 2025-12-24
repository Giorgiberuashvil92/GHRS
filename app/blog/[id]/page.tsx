"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DesktopNavbar from "../../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "@/app/components/Header/Header";
import MobileNavbar from "../../components/Navbar/MobileNavbar";
import { getBlogById } from "../../api/blogs";
import type { Blog } from "../../api/blogs";
import { Footer } from "@/app/components/Footer";
import { useI18n } from "../../context/I18nContext";
import SubHeader from "@/app/components/Header/SubHeader";

interface BlogContentProps {
  blog: Blog;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
  const { locale } = useI18n();

  const getLocalizedText = (field: { en: string; ru: string; ka?: string } | undefined) => {
    if (!field) return "";
    return field[locale as keyof typeof field] || field.ru || field.en || "";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[20px] p-8 shadow-sm">
      {/* Blog Image */}
      {blog.imageUrl && (
        <div className="w-full h-[400px] mb-8 overflow-hidden rounded-[15px]">
          <img
            src={blog.imageUrl}
            alt={getLocalizedText(blog.title)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3D334A] mb-4">
          {getLocalizedText(blog.title)}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#F1EBF9] text-[#6941C6] text-sm font-medium py-2 px-4 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>👀 {blog.viewsCount || 0}</span>
            <span>❤️ {blog.likesCount || 0}</span>
          </div>
        </div>

        <p className="text-lg text-[#1A1A1A]/80 leading-relaxed">
          {getLocalizedText(blog.excerpt)}
        </p>
      </div>

      {/* Blog Description/Content */}
      <div className="prose prose-lg max-w-none">
        <div className="text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
          {getLocalizedText(blog.description)}
        </div>
      </div>

      {/* Blog Articles Section */}
      {blog.articles && Array.isArray(blog.articles) && blog.articles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-[#3D334A] mb-6">Related Articles</h3>
          <div className="grid gap-4">
            {blog.articles.map((article) => (
              <div
                key={article._id || Math.random()}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-[#3D334A] mb-2">
                  {typeof article.title === 'object' ? getLocalizedText(article.title) : article.title || 'No title'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {typeof article.excerpt === 'object' ? getLocalizedText(article.excerpt) : article.excerpt || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid blog ID");
        setLoading(false);
        return;
      }

      try {
        const data = await getBlogById(params.id);
        setBlog(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch blog"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen">
        <DesktopNavbar
          menuItems={defaultMenuItems}
          blogBg={true}
          allCourseBg={false}
        />
        <MobileNavbar />
        <div className="flex justify-center items-center h-64">
          <div>{t("common.loading")}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen">
        <DesktopNavbar
          menuItems={defaultMenuItems}
          blogBg={true}
          allCourseBg={false}
        />
        <MobileNavbar />
        <div className="flex justify-center items-center h-64">
          <div>Error: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen">
        <DesktopNavbar
          menuItems={defaultMenuItems}
          blogBg={true}
          allCourseBg={false}
        />
        <MobileNavbar />
        <div className="flex justify-center items-center h-64">
          <div>Blog not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7FE] min-h-screen py-1">
      <DesktopNavbar
        menuItems={defaultMenuItems}
        blogBg={true}
        allCourseBg={false}
        data={{ featuredImages: blog.imageUrl ? [blog.imageUrl] : [] }}
      />
      <SubHeader />
      <MobileNavbar />

      <div className="mx-10 py-8">
        <BlogContent blog={blog} />
      </div>
      <Footer />
    </div>
  );
}