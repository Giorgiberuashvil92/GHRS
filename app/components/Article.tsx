"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import { Article as ArticleType, getArticlesByCategory } from "../api/articles";
import { FaFacebookF, FaShare } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useLanguage, useI18n } from "../context/I18nContext";
import { useCategories } from "../hooks/useCategories";
import { useComments } from "../hooks/useComments";
import { RiTwitterXFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { sanitizeHtml } from "../utils/sanitize";

interface ArticleProps {
  article: ArticleType;
}

const extractImageUrl = (input?: string): string | null => {
  if (!input) return null;

  // If input is a simple URL, return it
  if (!input.includes('[') && !input.includes('"')) {
    return input;
  }

  try {
    // Try to parse as JSON
    let parsed = input;
    while (typeof parsed === 'string' && (parsed.includes('[') || parsed.includes('"'))) {
      parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) {
        parsed = parsed[0];
      }
    }
    return typeof parsed === 'string' ? parsed : null;
  } catch (e) {
    console.error('Failed to parse image URL:', e);
    return null;
  }
};

const Article: React.FC<ArticleProps> = ({ article }) => {
  const [similarArticles, setSimilarArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language } = useLanguage();
  const { t } = useI18n();
  const { categories } = useCategories();
  const { comments, isLoading: commentsLoading, addComment, toggleLike } = useComments(article._id);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  // Calculate reading time based on content
  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;

    // Remove HTML tags and decode HTML entities
    const cleanText = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&[a-zA-Z0-9#]+;/g, '') // Remove other HTML entities
      .trim();

    // Count words (split by whitespace and filter empty strings)
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Average reading speed is 200-250 words per minute
    // We'll use 220 words per minute as average
    const wordsPerMinute = 220;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    // Minimum reading time should be 1 minute
    return Math.max(1, readingTimeMinutes);
  };

  const dynamicReadTime = calculateReadingTime(article.content[language]);

  // Extract headings from article content for automatic table of contents
  const extractHeadingsFromContent = (content: string) => {
    if (!content) return [];

    // Find only h2 and h3 tags and extract their text content
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const headings = [];
    let match;
    let index = 1;
    let mainIndex = 1;
    let subIndex = 1;
    let currentMainHeading = null;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const decodeHtmlEntities = (text: string) => {
        const entities = {
          '&ndash;': '–',
          '&mdash;': '—',
          '&laquo;': '«',
          '&raquo;': '»',
          '&lt;': '<',
          '&gt;': '>',
          '&amp;': '&',
          '&quot;': '"',
          '&nbsp;': ' '
        } as const;
        return text.replace(/&[^;]+;/g, (entity) => entities[entity as keyof typeof entities] || entity);
      };

      const headingText = decodeHtmlEntities(
        match[2]
          .replace(/<[^>]*>/g, '') // Remove any HTML tags inside heading
          .trim()
      );

      if (headingText) {
        // Create anchor ID from text with unique index to avoid duplicates
        let anchor = headingText
          .toLowerCase()
          .replace(/<[^>]+>/g, "") // Remove HTML tags
          .replace(/[^\w\s-]/g, "") // Remove special characters but keep Cyrillic
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

        // Add index to make it unique
        anchor = `${anchor}-${index}`;

        // Create numbered prefix based on heading level and content
        let prefix = '';
        const isNumberedHeading = /^\d+(\.\d+)*\.?\s+/.test(headingText);

        if (isNumberedHeading) {
          // Use the existing number from the heading
          const match = headingText.match(/^\d+(\.\d+)*\.?\s+/);
          if (!match) return;
          prefix = match[0];
          const parts = prefix.split('.');
          if (parts.length === 1) {
            currentMainHeading = parseInt(parts[0]);
            mainIndex = currentMainHeading + 1;
            subIndex = 1;
          } else if (parts.length === 2) {
            subIndex = parseInt(parts[1]) + 1;
          }
        } else {
          // Generate number if not present in heading
          if (level === 2) {
            prefix = `${mainIndex}. `;
            currentMainHeading = mainIndex;
            mainIndex++;
            subIndex = 1;
          } else if (level === 3 && currentMainHeading !== null) {
            prefix = `${currentMainHeading}.${subIndex}. `;
            subIndex++;
          }
        }

        headings.push({
          anchor,
          title: {
            [language]: prefix + headingText,
            en: prefix + headingText,
            ru: prefix + headingText,
            ka: prefix + headingText
          },
          level,
          index,
          isSubHeading: level > 2
        });
        index++;
      }
    }

    return headings;
  };

  // Get table of contents - use provided or generate from content
  const getTableOfContents = () => {
    if (article.tableOfContents && article.tableOfContents.length > 0) {
      return article.tableOfContents;
    }

    // Generate from content if no predefined table of contents
    return extractHeadingsFromContent(article.content[language]);
  };

  const tableOfContents = getTableOfContents();

  useEffect(() => {
    const fetchSimilarArticles = async () => {
      try {
        setIsLoading(true);

        // Get all category IDs
        const categoryIds = Array.isArray(article.categoryId) ? article.categoryId : [article.categoryId];
        console.log("Category IDs:", categoryIds);

        // Filter out empty IDs
        const validCategoryIds = categoryIds.filter(id => id && id.trim() !== '');
        console.log("Valid Category IDs:", validCategoryIds);

        let allArticles: ArticleType[] = [];

        if (validCategoryIds.length > 0) {
          try {
            // Fetch articles for each category
            console.log("Fetching articles for categories:", validCategoryIds);
            const allArticlesPromises = validCategoryIds.map(id => getArticlesByCategory(id));
            const allArticlesArrays = await Promise.all(allArticlesPromises);
            console.log("Articles from all categories:", allArticlesArrays);

            // Flatten and deduplicate articles
            allArticles = Array.from(new Set(allArticlesArrays.flat()))
              .filter(a => a._id !== article._id); // Remove current article
          } catch (categoryError) {
            console.warn("Failed to fetch by category, falling back to all articles:", categoryError);
          }
        }

        // Fallback: if no articles found by category, get latest published articles
        if (allArticles.length === 0) {
          console.log("No articles found by category, fetching latest articles");
          const { getArticles } = await import('../api/articles');
          const latestArticles = await getArticles({ isPublished: true, limit: 10 });
          allArticles = latestArticles.filter(a => a._id !== article._id);
        }

        // Limit to 3 articles
        const finalArticles = allArticles.slice(0, 3);
        console.log("Final similar articles:", finalArticles);
        setSimilarArticles(finalArticles);
      } catch (error) {
        console.error("Error fetching similar articles:", error);
        console.error("Error details:", {
          categoryId: article.categoryId,
          error: error instanceof Error ? error.message : error
        });
        // Set empty array on error
        setSimilarArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarArticles();
  }, [article.categoryId, article._id]);

  // Helper function to get category names
  const getCategoryNames = (article: ArticleType): string[] => {
    if (article.categories && article.categories.length > 0) {
      return article.categories.map(cat => cat.name[language]);
    }
    if (article.category?.name) {
      return [article.category.name[language]];
    }

    // If we have categoryId but no category name, try to find it in categories
    if (article.categoryId) {
      const categoryIds = Array.isArray(article.categoryId) ? article.categoryId : [article.categoryId];
      const foundCategories = categories.filter(cat => categoryIds.includes(cat._id));
      if (foundCategories.length > 0) {
        return foundCategories.map(cat => cat.name[language]);
      }
    }

    return ["Category"];
  };

  const handleScrollToSection = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative w-full h-[518px]">
        <Image
          src={extractImageUrl(article.featuredImages?.[0]) || '/assets/images/default-article.jpg'}
          alt={article.title[language]}
          fill
          className="object-cover rounded-10"
        />
      </div>

      <main className="flex justify-between gap-[30px] text-[#3D334A] mt-10">
        {/* Left Sidebar - Table of Contents */}
        {(tableOfContents || []).length > 0 && (
          <div className="sticky top-24 p-6 bg-[rgba(255,255,255,1)] rounded-5 max-w-[335px] hidden md:block shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-[#3D334A] border-b pb-4 font-bowler">
              {t("article.table_of_contents")}
            </h2>

            <div className="space-y-4">
              {(tableOfContents || []).map((item) => (
                <div
                  key={item.anchor}
                  className={`group relative flex items-start cursor-pointer transition-all duration-200 ${item.level === 3 ? 'ml-8 pl-4 border-l-2 border-purple-100' : ''
                    }`}
                  onClick={() => handleScrollToSection(item.anchor)}
                >
                  {/* Hover Effect Line */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-in-out" />

                  {/* Content */}
                  <div className="flex-1">
                    <span className={`block text-[#3D334A] tracking-[-0.5px] font-pt ${item.level === 3
                      ? 'text-sm font-medium hover:text-purple-600'
                      : 'text-base font-semibold hover:text-purple-700'
                      }`}>
                      {item.title[language]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`mt-0 ${(tableOfContents || []).length > 0 ? 'md:max-w-[890px] w-[890px]' : 'w-full max-w-full'}`}>
          <section className="bg-[rgba(255,255,255,1)] rounded-[20px] p-4">
            <header className="hidden md:flex flex-col gap-[30px]">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {getCategoryNames(article).map((categoryName, index) => (
                    <button key={index} className="bg-[rgba(233,223,246,1)] rounded-[6px] p-[8px] text-[18px] uppercase leading-[90%] font-bowler">
                      {categoryName}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center gap-[6px]">
                  <div className="w-[40px] h-[40px] hover:scale-105 duration-500 cursor-pointer hover:bg-[#dbc9f2] rounded-[6px] bg-[rgba(233,223,246,1)] flex items-center justify-center">
                    <CiBookmark className="" />
                  </div>
                  <div className="w-[40px] h-[40px] rounded-[6px] hover:scale-105 duration-500 cursor-pointer hover:bg-[#dbc9f2] bg-[rgba(233,223,246,1)] flex items-center justify-center">
                    <FaShare />
                  </div>
                </div>
              </div>
              <section>
                <h2 className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[32px] font-bowler">
                  {article.title[language]}
                </h2>
                <p className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] pt-6 font-pt">
                  {article.excerpt[language]}
                </p>
                <div className="flex items-center gap-[30px] pt-[30px]">
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium font-pt">
                    {t("article.comment_count", {
                      count: String(article.commentsCount || 0),
                    })}
                  </span>
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium font-pt">
                    {t("article.read_time", { time: String(dynamicReadTime) })}
                  </span>
                </div>
              </section>
            </header>

            {/* Article Content */}
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(addAnchorsToContent(article.content[language])),
              }}
              className="mt-[60px] prose max-w-none text-[rgba(132,111,160,1)] article-content"
            />

            {/* Global styles for article content */}
            <style jsx global>{`
              /* Article Links */
              .article-content a {
                color: #6D28D9 !important;
                text-decoration: underline !important;
                text-decoration-color: rgba(109, 40, 217, 0.3) !important;
                text-underline-offset: 3px !important;
                transition: all 0.3s ease !important;
                font-weight: 500 !important;
              }
              
              .article-content a:hover {
                color: #5B21B6 !important;
                text-decoration-color: #5B21B6 !important;
                background-color: rgba(109, 40, 217, 0.1) !important;
                padding: 2px 4px !important;
                border-radius: 4px !important;
                text-shadow: 0 1px 2px rgba(109, 40, 217, 0.2) !important;
              }
              
              .article-content a:visited {
                color: #7C3AED !important;
              }
              
              .article-content a:active {
                color: #4C1D95 !important;
                transform: translateY(1px) !important;
              }

              /* Article Headings */
              .article-content h1 {
                font-family: "Bowler", sans-serif !important;
                font-size: 2.5rem !important;
                font-weight: 700 !important;
                line-height: 1.2 !important;
                color: #3D334A !important;
                margin: 2rem 0 1rem 0 !important;
                padding-bottom: 0.5rem !important;
                border-bottom: 2px solid #D4BAFC !important;
              }

              .article-content h2 {
                font-family: "Bowler", sans-serif !important;
                font-size: 2rem !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
                color: #3D334A !important;
                margin: 1.5rem 0 0.75rem 0 !important;
                padding-bottom: 0.25rem !important;
                border-bottom: 1px solid #E9DFF6 !important;
              }

              .article-content h3 {
                font-family: "Bowler", sans-serif !important;
                font-size: 1.5rem !important;
                font-weight: 600 !important;
                line-height: 1.4 !important;
                color: #3D334A !important;
                margin: 1.25rem 0 0.5rem 0 !important;
              }

              .article-content h4 {
                font-family: "Bowler", sans-serif !important;
                font-size: 1.25rem !important;
                font-weight: 500 !important;
                line-height: 1.4 !important;
                color: #3D334A !important;
                margin: 1rem 0 0.5rem 0 !important;
              }

              .article-content h5 {
                font-family: "Bowler", sans-serif !important;
                font-size: 1.125rem !important;
                font-weight: 500 !important;
                line-height: 1.4 !important;
                color: #3D334A !important;
                margin: 0.75rem 0 0.5rem 0 !important;
              }

              .article-content h6 {
                font-family: "Bowler", sans-serif !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                line-height: 1.4 !important;
                color: #3D334A !important;
                margin: 0.75rem 0 0.5rem 0 !important;
              }

              /* Article Paragraphs */
              .article-content p {
                font-family: "Pt", sans-serif !important;
                font-size: 1.125rem !important;
                line-height: 1.7 !important;
                color: #846FA0 !important;
                margin: 1rem 0 !important;
                text-align: justify !important;
              }

              /* Article Lists */
              .article-content ul,
              .article-content ol {
                font-family: "Pt", sans-serif !important;
                font-size: 1.125rem !important;
                line-height: 1.7 !important;
                color: #846FA0 !important;
                margin: 1rem 0 !important;
                padding-left: 2rem !important;
              }

              .article-content li {
                margin: 0.5rem 0 !important;
              }

              .article-content ul li {
                list-style-type: disc !important;
              }

              .article-content ol li {
                list-style-type: decimal !important;
              }

              /* Article Images */
              .article-content img {
                max-width: 100% !important;
                height: auto !important;
                border-radius: 10px !important;
                margin: 1.5rem auto !important;
                display: block !important;
                box-shadow: 0 4px 20px rgba(61, 51, 74, 0.1) !important;
              }

              /* Article Videos */
              .article-content video {
                max-width: 100% !important;
                height: auto !important;
                border-radius: 10px !important;
                margin: 1.5rem auto !important;
                display: block !important;
                box-shadow: 0 4px 20px rgba(61, 51, 74, 0.1) !important;
                background: #000 !important;
              }

              /* Video Container for responsive videos */
              .article-content .video-container {
                position: relative !important;
                width: 100% !important;
                height: 0 !important;
                padding-bottom: 56.25% !important; /* 16:9 aspect ratio */
                margin: 1.5rem 0 !important;
                border-radius: 10px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 20px rgba(61, 51, 74, 0.1) !important;
              }

              .article-content .video-container iframe,
              .article-content .video-container video {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                border-radius: 10px !important;
              }

              .article-content iframe {
                max-width: 100% !important;
                height: auto !important;
                min-height: 315px !important;
                border-radius: 10px !important;
                margin: 1.5rem auto !important;
                display: block !important;
                border: none !important;
                box-shadow: 0 4px 20px rgba(61, 51, 74, 0.1) !important;
              }

              /* YouTube and Vimeo specific */
              .article-content iframe[src*="youtube.com"],
              .article-content iframe[src*="youtu.be"],
              .article-content iframe[src*="vimeo.com"] {
                aspect-ratio: 16 / 9 !important;
                width: 100% !important;
                height: auto !important;
                min-height: 315px !important;
              }

              @media (max-width: 768px) {
                .article-content iframe {
                  min-height: 200px !important;
                }
                
                .article-content iframe[src*="youtube.com"],
                .article-content iframe[src*="youtu.be"],
                .article-content iframe[src*="vimeo.com"] {
                  min-height: 200px !important;
                }
              }

              /* Article Blockquotes */
              .article-content blockquote {
                font-family: "Pt", sans-serif !important;
                font-size: 1.25rem !important;
                line-height: 1.6 !important;
                color: #6D28D9 !important;
                background: #F9F7FE !important;
                border-left: 4px solid #D4BAFC !important;
                padding: 1.5rem !important;
                margin: 2rem 0 !important;
                border-radius: 8px !important;
                font-style: italic !important;
              }

              /* Article Code */
              .article-content code {
                font-family: 'Courier New', monospace !important;
                font-size: 0.9rem !important;
                background: #F3F4F6 !important;
                color: #374151 !important;
                padding: 0.25rem 0.5rem !important;
                border-radius: 4px !important;
                border: 1px solid #E5E7EB !important;
              }

              .article-content pre {
                font-family: 'Courier New', monospace !important;
                font-size: 0.9rem !important;
                background: #1F2937 !important;
                color: #F9FAFB !important;
                padding: 1.5rem !important;
                border-radius: 8px !important;
                overflow-x: auto !important;
                margin: 1.5rem 0 !important;
              }

              .article-content pre code {
                background: transparent !important;
                color: inherit !important;
                padding: 0 !important;
                border: none !important;
              }

              /* Article Tables */
              .article-content table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 1.5rem 0 !important;
                background: white !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                box-shadow: 0 2px 10px rgba(61, 51, 74, 0.1) !important;
              }

              .article-content th,
              .article-content td {
                font-family: "Pt", sans-serif !important;
                padding: 0.75rem 1rem !important;
                text-align: left !important;
                border-bottom: 1px solid #E9DFF6 !important;
              }

              .article-content th {
                background: #F9F7FE !important;
                font-weight: 600 !important;
                color: #3D334A !important;
              }

              .article-content td {
                color: #846FA0 !important;
              }

              /* Article Dividers */
              .article-content hr {
                border: none !important;
                height: 2px !important;
                background: linear-gradient(to right, transparent, #D4BAFC, transparent) !important;
                margin: 2rem 0 !important;
              }

              /* Article Strong/Bold */
              .article-content strong,
              .article-content b {
                font-weight: 700 !important;
                color: #3D334A !important;
              }

              /* Article Emphasis/Italic */
              .article-content em,
              .article-content i {
                font-style: italic !important;
                color: #6D28D9 !important;
              }
            `}</style>

            {/* Featured Images */}
            {article.featuredImages?.map((image, index) => {
              // Try to parse JSON string if it contains array-like structure
              let imageUrl = image;
              if (typeof image === 'string' && image.includes('[')) {
                try {
                  const parsed = JSON.parse(image);
                  imageUrl = Array.isArray(parsed) ? parsed[0] : image;
                } catch (e) {
                  // If parsing fails, use the original string
                  console.error('Failed to parse image URL:', e);
                }
              }

              // Skip if image URL is not a valid string or contains array-like structure
              if (typeof imageUrl !== 'string' || imageUrl.includes('[')) {
                return null;
              }

              return (
                <section key={index} className="p-4 hidden md:block">
                  <div className="max-w-[630px] max-h-[309px] rounded-[10px] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`Article image ${index + 1}`}
                      className="w-full h-full rounded-[10px] object-cover"
                      width={630}
                      height={309}
                    />
                  </div>
                </section>
              );
            })}
          </section>

          {/* Rating Section */}
          <section className="w-full px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5">
            <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5 font-bowler">
              {t("article.rate_article")}
            </h2>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-[4.16px] md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setUserRating(i + 1)}
                    onMouseEnter={() => setHoveredStar(i + 1)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="max-w-[55.5px] max-h-[50.7px] rounded-[10px] overflow-hidden flex items-center justify-center bg-yellow-50 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <MdStar 
                      className={`w-full h-full transition-colors ${
                        (hoveredStar > 0 ? i < hoveredStar : i < userRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`} 
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:justify-center items-center gap-[4.16px]">
                <h4 className="md:text-[32px] text-lg text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] font-bowler">
                  4.7
                </h4>
                <span className="md:text-[16px] text-[10px] text-[rgba(213,209,219,1)] leading-[100%] tracking-[-1%] font-pt">
                  {t("article.ratings", { count: "26" })}
                </span>
              </div>
            </div>
          </section>

          {/* Comments Section */}
          <section className="w-full px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5">
            <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5 font-bowler">
              {t("article.comments")}
            </h2>
            {isLoggedIn ? (
              <form className="max-w-[650px] mx-auto relative" onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;
                const success = await addComment(commentText);
                if (success) setCommentText("");
              }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("article.write_comment")}
                  className="w-full p-4 text-lg font-medium border-2 rounded-lg outline-none border-[rgba(249,247,254,1)] focus:border-[rgba(212,186,252,1)] transition-colors bg-white text-[rgba(61,51,74,1)] leading-none tracking-normal placeholder:text-[rgba(226,204,255,1)] font-pt"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <div className="max-w-[650px] mx-auto p-6 bg-[rgba(249,247,254,1)] rounded-lg text-center">
                <p className="text-[rgba(132,111,160,1)] text-lg mb-4 font-pt">
                  {t("article.login_to_comment") || "Please log in to leave a comment"}
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-[rgba(212,186,252,1)] text-white rounded-lg hover:bg-[rgba(132,111,160,1)] transition-colors font-pt font-medium"
                >
                  {t("auth.login") || "Log In"}
                </Link>
              </div>
            )}
            <hr className="h-[2px] w-full bg-[rgba(249,247,254,1)] mt-[40px] border-none md:mb-5 mb-0" />
            <div className="flex flex-col gap-5">
              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(132,111,160,1)]"></div>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-5 items-start max-w-[650px] bg-[rgba(249,247,254,1)] rounded-[20px] p-4"
                  >
                    <div className="w-[50px] h-[50px] rounded-[10px] bg-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {comment.userAvatar ? (
                        <Image src={comment.userAvatar} alt={comment.userName} width={50} height={50} className="object-cover" />
                      ) : (
                        <FaUserCircle className="text-gray-400 w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-[rgba(61,51,74,1)] text-sm md:text-[18px] font-medium font-pt">
                          {comment.userName}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString(language, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <p className="md:text-[18px] text-[16px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%] font-pt">
                        {comment.content}
                      </p>
                      <button 
                        onClick={() => toggleLike(comment._id)}
                        className="mt-3 text-sm text-[rgba(132,111,160,1)] hover:text-[rgba(212,186,252,1)] transition-colors flex items-center gap-1 font-pt"
                      >
                        ❤️ {comment.likes}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[rgba(132,111,160,1)] py-8 font-pt">
                  {t("article.no_comments")}
                </p>
              )}
            </div>
          </section>
          <div className="w-full pr-40 flex flex-col items-center mt-10 md:mb-20 gap-8">
            <h1 className="text-[18px] leading-[100%] tracking-[-1%] text-[#3D334A] font-bowler uppercase">{t("blog.share_social")}</h1>
            <div className="flex gap-10">
              <a 
                href="https://www.facebook.com/ghrs.gr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300"
              >
                <FaFacebookF color="black" size={30} />
              </a>
              <a 
                href="https://twitter.com/ghrs_group"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300"
              >
                <RiTwitterXFill color="black" size={30} />
              </a>
              <a 
                href="https://instagram.com/ghrs_group"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300"
              >
                <BsInstagram color="black" size={30} />
              </a>
              <a 
                href="https://www.youtube.com/@ghrsgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300"
              >
                <BsYoutube color="black" size={30} />
              </a>
              <a 
                href="https://www.linkedin.com/in/ghrs-group"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300"
              >
                <FaLinkedin color="black" size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-5 bg-[rgba(255,255,255,1)] min-h-[700px] h-[700px] rounded-[20px] max-w-[335px] hidden md:block">
          <h2 className="text-[18px] md:text-[20px] font-bold mb-6 text-[rgba(61,51,74,1)] font-bowler uppercase leading-[100%] tracking-[-1%]">
            {t("common.similar_articles")}
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(132,111,160,1)]"></div>
              </div>
            ) : similarArticles.length > 0 ? (
              similarArticles.map((similarArticle) => (
                <Link
                  href={`/article/${similarArticle._id}`}
                  key={similarArticle._id}
                  className="flex gap-3 hover:bg-[rgba(249,247,254,1)] p-2 rounded-[10px] transition-colors"
                >
                  <div className="w-[100px] h-[100px] rounded-[10px] overflow-hidden">
                    <Image
                      src={
                        extractImageUrl(similarArticle.featuredImages?.[0]) ||
                        "/assets/images/article.jpg"
                      }
                      alt={similarArticle.title[language]}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getCategoryNames(similarArticle).slice(0, 2).map((categoryName, index) => (
                        <span key={index} className="text-xs text-[rgba(132,111,160,1)] bg-[rgba(249,247,254,1)] px-2 py-1 rounded-full font-pt">
                          {categoryName}
                        </span>
                      ))}
                      {getCategoryNames(similarArticle).length > 2 && (
                        <span className="text-xs text-[rgba(132,111,160,1)] bg-[rgba(249,247,254,1)] px-2 py-1 rounded-full">
                          +{getCategoryNames(similarArticle).length - 2}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[rgba(61,51,74,1)] text-sm font-medium mb-2 font-bowler">
                      {similarArticle.title[language]}
                    </h3>
                    <p className="text-[rgba(132,111,160,1)] text-xs line-clamp-2 font-pt">
                      {similarArticle.excerpt[language]}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-[rgba(132,111,160,1)]">
                {t("common.no_similar_articles")}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

// Helper function to add anchor IDs to content headers and process videos
const addAnchorsToContent = (content: string): string => {
  let index = 1;

  // First, process shortcodes
  const processedContent = content
    // Process [su_youtube] shortcodes
    .replace(
      /\[su_youtube\s+([^\]]+)\]/g,
      (match, attributes) => {
        // Parse attributes using a more flexible approach
        const urlMatch = attributes.match(/url=["']([^"']+)["']/);
        const widthMatch = attributes.match(/width=["']?(\d+)["']?/);
        const heightMatch = attributes.match(/height=["']?(\d+)["']?/);
        const titleMatch = attributes.match(/title=["']([^"']*)["']/);

        if (!urlMatch) return match; // Return original if no URL found

        const url = urlMatch[1];
        const width = widthMatch ? widthMatch[1] : '560';
        const height = heightMatch ? heightMatch[1] : '315';
        const title = titleMatch ? titleMatch[1] : '';

        // Extract video ID from various YouTube URL formats
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const matchResult = url.match(youtubeRegex);

        if (matchResult) {
          const videoId = matchResult[1];
          return `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" width="${width}" height="${height}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }

        return match; // Return original if can't parse
      }
    )
    // Wrap iframe videos (YouTube, Vimeo, etc.)
    .replace(
      /<iframe([^>]*src=["'][^"']*(?:youtube\.com|youtu\.be|vimeo\.com)[^"']*["'][^>]*)><\/iframe>/g,
      '<div class="video-container"><iframe$1></iframe></div>'
    )
    // Wrap regular video tags
    .replace(
      /<video([^>]*)>(.*?)<\/video>/g,
      '<div class="video-container"><video$1>$2</video></div>'
    );

  // Add id attributes to h1-h6 tags that match the anchors
  return processedContent.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
    (match, level, attrs, text) => {
      // Create anchor ID from text (same logic as extractHeadingsFromContent)
      let anchor = text
        .toLowerCase()
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-"); // Replace spaces with hyphens

      // Add index to make it unique
      anchor = `${anchor}-${index}`;
      index++;

      return `<h${level}${attrs} id="${anchor}">${text}</h${level}>`;
    }
  );
};

export default Article;