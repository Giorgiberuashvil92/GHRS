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
import { RiTwitterXFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa6";
import { BsYoutube } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
interface ArticleProps {
  article: ArticleType;
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  const [similarArticles, setSimilarArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useI18n();

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
    
    // Find all h1-h6 tags and extract their text content
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    let index = 1;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const headingText = match[2]
        .replace(/<[^>]*>/g, '') // Remove any HTML tags inside heading
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      
      if (headingText) {
        // Create anchor ID from text with unique index to avoid duplicates
        let anchor = headingText
          .toLowerCase()
          .replace(/<[^>]+>/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
        
        // Add index to make it unique
        anchor = `${anchor}-${index}`;
        
        headings.push({
          anchor,
          title: {
            [language]: headingText,
            en: headingText,
            ru: headingText,
            ka: headingText
          },
          level,
          index
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
        // Get the first category ID for fetching similar articles
        let categoryId: string;
        
        if (Array.isArray(article.categoryId)) {
          // If it's an array, use the first non-empty category ID
          categoryId = article.categoryId.find(id => id && id.trim() !== '') || '';
        } else if (article.categoryId && typeof article.categoryId === "object" && "_id" in article.categoryId) {
          // Check if category is an object with _id property
          categoryId = (article.categoryId as { _id: string })._id;
        } else {
          categoryId = article.categoryId as string;
        }

        if (!categoryId) {
          setSimilarArticles([]);
          return;
        }

        const articles = await getArticlesByCategory(categoryId);
        // Filter out the current article and limit to 3
        const filtered = articles
          .filter((a) => a._id !== article._id)
          .slice(0, 3);
        setSimilarArticles(filtered);
      } catch (error) {
        console.error("Error fetching similar articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (article.categoryId) {
      fetchSimilarArticles();
    }
  }, [article.categoryId, article._id]);

  // Helper function to get category names
  const getCategoryNames = (article: ArticleType): string[] => {
    if (article.categories && article.categories.length > 0) {
      return article.categories.map(cat => cat.name[language]);
    }
    if (article.category?.name) {
      return [article.category.name[language]];
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
          src="/assets/images/article.jpg"
          alt="article"
          fill
          className="object-cover rounded-[40px]"
        />
        <div className=" absolute flex bottom-5 right-5 gap-[10px]">
          <div className="bg-[#3D334A4D] hover:bg-[#5447654d] duration-300 cursor-pointer w-[70px] h-[70px] flex items-center justify-center rounded-[20px]">
            <Image
              src="/assets/images/rightIcon.svg"
              alt="vallet"
              width={15}
              height={15}
            />
          </div>
          <div className="bg-[#3D334A4D] hover:bg-[#5447654d] duration-300 cursor-pointer w-[70px] h-[70px] flex items-center justify-center rounded-[20px]">
            <Image
              src="/assets/images/leftIcon.svg"
              alt="vallet"
              width={15}
              height={15}
            />
          </div>
        </div>
      </div>

      <main className="flex justify-between gap-[30px] text-[#3D334A] mt-10">
        {/* Left Sidebar - Table of Contents */}
        {tableOfContents.length > 0 && (
          <div className="p-5 bg-[rgba(255,255,255,1)] min-h-[700px] h-[700px] rounded-[20px] max-w-[335px] hidden md:block">
            <h2 className="text-lg font-semibold mb-4 text-[rgba(61,51,74,1)]">
              {t("article.table_of_contents")}
            </h2>

            <div className="space-y-3">
              {tableOfContents.map((item, index) => (
                <div
                  key={item.anchor}
                  className="flex items-start gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleScrollToSection(item.anchor)}
                >
                  <span className="text-[rgba(61,51,74,1)]">{index + 1}.</span>
                  <span className="text-[rgba(61,51,74,1)] underline tracking-[-2%]">
                    {item.title[language]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`mt-0 ${tableOfContents.length > 0 ? 'md:max-w-[890px] w-[890px]' : 'w-full max-w-full'}`}>
          <section className="bg-[rgba(255,255,255,1)] rounded-[20px] p-4">
            <header className="hidden md:flex flex-col gap-[30px]">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {getCategoryNames(article).map((categoryName, index) => (
                    <button key={index} className="bg-[rgba(233,223,246,1)] rounded-[6px] p-[8px] text-[18px] uppercase leading-[90%]">
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
                <h2 className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[32px]">
                  {article.title[language]}
                </h2>
                <p className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] pt-6">
                  {article.excerpt[language]}
                </p>
                <div className="flex items-center gap-[30px] pt-[30px]">
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium">
                    {t("article.comment_count", {
                      count: String(article.commentsCount || 0),
                    })}
                  </span>
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium">
                    {t("article.read_time", { time: String(dynamicReadTime) })}
                  </span>
                </div>
              </section>
            </header>

            {/* Article Content */}
            <div
              dangerouslySetInnerHTML={{
                __html: addAnchorsToContent(article.content[language]),
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
                font-family: "PT", sans-serif !important;
                font-size: 1.125rem !important;
                line-height: 1.7 !important;
                color: #846FA0 !important;
                margin: 1rem 0 !important;
                text-align: justify !important;
              }

              /* Article Lists */
              .article-content ul,
              .article-content ol {
                font-family: "PT", sans-serif !important;
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
                font-family: "PT", sans-serif !important;
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
                font-family: "PT", sans-serif !important;
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
            {article.featuredImages?.map((image, index) => (
              <section key={index} className="p-4 hidden md:block">
                <div className="max-w-[630px] max-h-[309px] rounded-[10px] overflow-hidden">
                  <Image
                    src={image}
                    alt={`Article image ${index + 1}`}
                    className="w-full h-full rounded-[10px] object-cover"
                    width={630}
                    height={309}
                  />
                </div>
              </section>
            ))}
          </section>

          {/* Rating Section */}
          <section className="w-full px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5">
            <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5">
              {t("article.rate_article")}
            </h2>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-[4.16px] md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="max-w-[55.5px] max-h-[50.7px] rounded-[10px] overflow-hidden flex items-center justify-center bg-yellow-50"
                  >
                    <MdStar className="text-yellow-400 w-full h-full" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:justify-center items-center gap-[4.16px]">
                <h4 className="md:text-[32px] text-lg text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
                  4.7
                </h4>
                <span className="md:text-[16px] text-[10px] text-[rgba(213,209,219,1)] leading-[100%] tracking-[-1%]">
                  {t("article.ratings", { count: "26" })}
                </span>
              </div>
            </div>
          </section>

          {/* Comments Section */}
          <section className="w-full px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5">
            <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5">
              {t("article.comments")}
            </h2>
            <form className="max-w-[650px] mx-auto relative">
              <input
                type="text"
                placeholder={t("article.write_comment")}
                className="w-full p-4 text-lg font-medium border-2 rounded-lg outline-none border-[rgba(249,247,254,1)] transition-colors bg-transparent leading-none tracking-normal placeholder:text-[rgba(226,204,255,1)]"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
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
            <hr className="h-[2px] w-full bg-[rgba(249,247,254,1)] mt-[40px] border-none md:mb-5 mb-0" />
            <div className="flex flex-col gap-5">
              {article.comments && article.comments.length > 0
                ? article.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex gap-5 items-start max-w-[650px] bg-[rgba(249,247,254,1)] rounded-[20px] p-4"
                  >
                    <div className="w-[50px] h-[50px] rounded-[10px] bg-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <FaUserCircle className="text-gray-400 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-[rgba(61,51,74,1)] text-sm md:[18px]">
                          {comment.author}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {comment.date}
                        </p>
                      </div>
                      <p className="md:text-[18px] text-[16px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
                : null}
            </div>
            {article.comments && article.comments.length > 0 && (
              <button className="block m-auto py-[17.5px] w-[319px] mt-[40px] max-w-[343px] md:w-[343px] bg-[rgba(212,186,252,1)] rounded-[10px] items-center text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
                {t("article.show_more_comments")}
              </button>
            )}
          </section>
          <div className="w-full pr-40 flex flex-col items-center mt-10 md:mb-20 gap-8">
              <h1 className="text-[18px] leading-[100%] tracking-[-1%] text-[#3D334A]">поделиться в соцсетях</h1>
              <div className="flex gap-10">
              <div className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300">
              <FaFacebookF color="black" size={30} />
              </div>
              <div className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300">
              <RiTwitterXFill color="black" size={30} />
              </div>
              <div className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300">
              <BsInstagram color="black" size={30} />
              </div>
              <div className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300">
              <BsYoutube color="black" size={30} />
              </div>
              <div className="w-14 h-14 bg-white rounded-[5px] items-center justify-center flex cursor-pointer hover:scale-105 duration-300 ">
              <FaLinkedin color="black" size={30} className="hover:text-white" />
              </div>
              </div>
          </div>
        </div>



        {/* Right Sidebar */}
        <div className="p-5 bg-[rgba(255,255,255,1)] min-h-[700px] h-[700px] rounded-[20px] max-w-[335px] hidden md:block">
          <h2 className="text-lg font-semibold mb-4 text-[rgba(61,51,74,1)]">
            {t("article.similar_articles")}
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
                        similarArticle.featuredImages?.[0] ||
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
                        <span key={index} className="text-xs text-[rgba(132,111,160,1)] bg-[rgba(249,247,254,1)] px-2 py-1 rounded-full">
                          {categoryName}
                        </span>
                      ))}
                      {getCategoryNames(similarArticle).length > 2 && (
                        <span className="text-xs text-[rgba(132,111,160,1)] bg-[rgba(249,247,254,1)] px-2 py-1 rounded-full">
                          +{getCategoryNames(similarArticle).length - 2}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[rgba(61,51,74,1)] text-sm font-medium mb-2">
                      {similarArticle.title[language]}
                    </h3>
                    <p className="text-[rgba(132,111,160,1)] text-xs line-clamp-2">
                      {similarArticle.excerpt[language]}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-[rgba(132,111,160,1)]">
                {t("article.no_similar_articles")}
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
