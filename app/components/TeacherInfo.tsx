"use client";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import DesktopNavbar from "./Navbar/DesktopNavbar";
import { getDefaultMenuItems } from "./Header/Header";
import { useI18n } from "../context/I18nContext";
import {
  instructorDisplayNameForLocale,
  pickInstructorLocalizedText,
  resolveCourseLocale,
} from "../utils/instructorDisplay";

import Professional from "./Professional";
import Subscribe from "./Subscribe";
import { Footer } from "./Footer";
import { useInstructor } from "../hooks/useInstructor";
import Certificate from "./Certificate";

const CertificatesIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.0003 3.33333C19.0003 3.14924 18.8511 3 18.667 3H9.33366C7.30861 3 5.66699 4.64162 5.66699 6.66667V25.3333C5.66699 27.3584 7.30861 29 9.33366 29H22.667C24.692 29 26.3337 27.3584 26.3337 25.3333V12.1961C26.3337 12.012 26.1844 11.8627 26.0003 11.8627H20.0003C19.448 11.8627 19.0003 11.415 19.0003 10.8627V3.33333ZM20.0003 16.3333C20.5526 16.3333 21.0003 16.781 21.0003 17.3333C21.0003 17.8856 20.5526 18.3333 20.0003 18.3333H12.0003C11.448 18.3333 11.0003 17.8856 11.0003 17.3333C11.0003 16.781 11.448 16.3333 12.0003 16.3333H20.0003ZM20.0003 21.6667C20.5526 21.6667 21.0003 22.1144 21.0003 22.6667C21.0003 23.219 20.5526 23.6667 20.0003 23.6667H12.0003C11.448 23.6667 11.0003 23.219 11.0003 22.6667C11.0003 22.1144 11.448 21.6667 12.0003 21.6667H20.0003Z"
      fill="#D4BAFC"
    />
    <path
      d="M21.0003 3.76551C21.0003 3.51952 21.2572 3.36333 21.4486 3.51785C21.6098 3.648 21.7547 3.80048 21.8784 3.97273L25.8959 9.56993C25.9874 9.69736 25.8883 9.86275 25.7314 9.86275H21.3337C21.1496 9.86275 21.0003 9.71351 21.0003 9.52941V3.76551Z"
      fill="#D4BAFC"
    />
  </svg>
);

const CoursesIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4741 4.40239C16.1495 4.31027 15.8071 4.31035 15.4824 4.40274C14.7911 4.59947 14.0933 4.78168 13.393 4.96451C10.2682 5.7804 6.82748 6.67876 3.88423 9.08053L2.49652 10.2129C1.38994 11.1159 1.39052 12.8844 2.49806 13.7865L3.86332 14.8985C4.87194 15.72 5.9231 16.3626 7.00033 16.8866V23.0586C7.00033 24.5697 7.92729 25.926 9.33513 26.4748L14.6685 28.5541C15.525 28.888 16.4757 28.888 17.3322 28.5541L22.6655 26.4748C24.0734 25.926 25.0003 24.5697 25.0003 23.0586V16.8977C26.0704 16.3764 27.1146 15.7371 28.1164 14.9195L28.3337 14.7423V21.3334C28.3337 21.8857 28.7814 22.3334 29.3337 22.3334C29.8859 22.3334 30.3337 21.8857 30.3337 21.3334V12C30.3334 11.3323 30.0564 10.6646 29.5026 10.2136L28.1373 9.10161C25.1727 6.68692 21.5874 5.75185 18.5593 4.96208C17.8606 4.77984 17.1641 4.59821 16.4741 4.40239ZM11.0658 17.083C10.5594 16.8627 9.97026 17.0947 9.74998 17.6012C9.52971 18.1076 9.7617 18.6968 10.2682 18.9171C11.972 19.6581 13.7356 20.2644 15.5431 20.7283C15.858 20.8091 16.1884 20.809 16.5034 20.728C18.306 20.264 20.0645 19.6577 21.7628 18.9166C22.269 18.6957 22.5003 18.1063 22.2794 17.6001C22.0585 17.0939 21.4691 16.8626 20.9629 17.0835C19.3674 17.7797 17.7157 18.3498 16.0226 18.7865C14.3243 18.3497 12.6671 17.7794 11.0658 17.083Z"
      fill="#D4BAFC"
    />
  </svg>
);

const WikipediaIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.33301 10.6666C5.33301 7.35292 8.0193 4.66663 11.333 4.66663H24.6663C25.7709 4.66663 26.6663 5.56206 26.6663 6.66663V26.6666C26.6663 27.403 26.0694 28 25.333 28H9.99967C7.64869 28 5.70375 26.2615 5.38027 24H5.33301V10.6666ZM24.6663 20.6666H9.99967C8.52692 20.6666 7.33301 21.8605 7.33301 23.3333C7.33301 24.8061 8.52692 26 9.99967 26H24.6663V20.6666ZM10.9997 10.6666C10.9997 10.1143 11.4474 9.66663 11.9997 9.66663H21.333C21.8853 9.66663 22.333 10.1143 22.333 10.6666C22.333 11.2189 21.8853 11.6666 21.333 11.6666H11.9997C11.4474 11.6666 10.9997 11.2189 10.9997 10.6666ZM11.9997 13.6666C11.4474 13.6666 10.9997 14.1143 10.9997 14.6666C10.9997 15.2189 11.4474 15.6666 11.9997 15.6666H18.6663C19.2186 15.6666 19.6663 15.2189 19.6663 14.6666C19.6663 14.1143 19.2186 13.6666 18.6663 13.6666H11.9997Z"
      fill="#D4BAFC"
    />
  </svg>
);

interface TocItem {
  anchor: string;
  title: string;
  level: 2 | 3;
}

const ContentsSidebar = ({ items }: { items: TocItem[] }) => {
  const { t } = useI18n();

  return (
    <div className="sticky top-24 p-6 bg-[rgba(255,255,255,1)] rounded-[20px] shadow-lg hidden md:block">
      <h3 className="text-xl font-bold mb-6 text-[#3D334A] border-b pb-4 font-bowler">
        {t("teacher.contents")}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500" />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.anchor}
              className={`group relative flex items-start cursor-pointer transition-all duration-200 ${
                item.level === 3 ? "ml-8 pl-4 border-l-2 border-purple-100" : ""
              }`}
              onClick={() =>
                document
                  .getElementById(item.anchor)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-in-out" />
              <div className="flex-1">
                <span
                  className={`block text-[#3D334A] tracking-[-0.5px] font-pt ${
                    item.level === 3
                      ? "text-sm font-medium hover:text-purple-600"
                      : "text-base font-semibold hover:text-purple-700"
                  }`}
                >
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TeacherInfoProps {
  instructorId?: string;
}

const TeacherInfo = ({ instructorId }: TeacherInfoProps) => {
  const { t, locale } = useI18n();
  const menuItems = getDefaultMenuItems(t);
  const { instructor, loading, error } = useInstructor(instructorId || "");
  const loc = resolveCourseLocale(locale);

  const displayInstructorName = useMemo(() => {
    if (!instructor) return "";
    return instructorDisplayNameForLocale(instructor, loc);
  }, [instructor, loc]);

  const getMultilingualContent = (
    content: { ka?: string; en?: string; ru?: string } | undefined
  ): string => pickInstructorLocalizedText(content, loc);

  const displayProfession =
    getMultilingualContent(instructor?.professionLocalized) ||
    instructor?.profession ||
    "";

  // Function to clean and format HTML content
  const cleanHtmlContent = (htmlContent: string) => {
    let headingIndex = 1;

    return (
      htmlContent
        // First, let's handle the outer container div with monospace styling
        .replace(
          /<div style="color: #7b88a1; font-size: 12px; font-family: Menlo, Monaco, 'Courier New', monospace;">/g,
          '<div class="text-gray-600">'
        )

        // Replace specific colored spans - these seem to be for syntax highlighting
        .replace(
          /<span style="color: #81a1c1;">/g,
          '<strong class="text-blue-600">'
        )
        .replace(
          /<span style="color: #7b88a1;">/g,
          '<span class="text-gray-700">'
        )

        // Clean up any remaining style attributes
        .replace(/style="[^"]*"/g, "")

        // Handle HTML tag representations (these appear to be showing HTML code)
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")

        // Add proper spacing to elements
        .replace(/<div>/g, '<div class="mb-3">')
        // Add IDs to h3 headings for table of contents navigation
        .replace(
          /<h3>/g,
          () =>
            `<h3 id="heading-${headingIndex++}" class="text-xl font-bold text-[#3D334A] mt-6 mb-3">`
        )
        .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
        .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-2">')
        .replace(/<li>/g, '<li class="text-gray-700">')

        // Handle line breaks
        .replace(/<br>/g, '<br class="mb-2" />')

        // Close any unclosed tags properly
        .replace(/<\/span>/g, "</span>")
        .replace(/<\/strong>/g, "</strong>")
    );
  };

  const localizedHtml = getMultilingualContent(instructor?.htmlContent);

  const tableOfContents = useMemo(() => {
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
    const headings: TocItem[] = [];
    let idx = 1;
    let match;
    while ((match = headingRegex.exec(localizedHtml || "")) !== null) {
      const level = Number(match[1]) as 2 | 3;
      const title = match[2]
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
      if (!title) continue;
      const anchor = `${title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "")}-${idx++}`;
      headings.push({ anchor, title, level });
    }
    return headings;
  }, [localizedHtml]);

  const renderedHtml = useMemo(() => {
    const anchorsByTitle = new Map<string, string>();
    tableOfContents.forEach((item) => {
      if (!anchorsByTitle.has(item.title)) anchorsByTitle.set(item.title, item.anchor);
    });
    return cleanHtmlContent(localizedHtml || "").replace(
      /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
      (full, level, attrs, text) => {
        const plain = text
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .trim();
        const id = anchorsByTitle.get(plain);
        if (!id || /\sid=["'][^"']+["']/.test(attrs)) return full;
        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      }
    );
  }, [localizedHtml, tableOfContents]);

  const diplomaSlides = useMemo(() => {
    const list = instructor?.diplomas ?? [];
    return list
      .filter((d) => (d.url || "").trim())
      .map((d) => ({
        src: d.url!.trim(),
      }));
  }, [instructor?.diplomas]);

  const instructorCoursesFilter = useMemo(
    () =>
      instructor ? { id: instructor.id, name: instructor.name } : undefined,
    [instructor]
  );

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (loading) return <div>{t("common.loading")}</div>;
  if (error)
    return (
      <div>
        {t("common.error")}: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9F7FE] py-6 px-2 md:px-8">
      <DesktopNavbar
        menuItems={menuItems}
        blogBg={false}
        allCourseBg={false}
      />
      <div className=" mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full md:w-[335px] flex-shrink-0">
          <Image
            src={instructor?.profileImage || "/assets/images/user1.png"}
            width={335}
            height={335}
            alt={displayInstructorName || instructor?.name || "Instructor"}
            className="rounded-[15px] w-full h-[335px] object-cover mb-4"
          />
          <ContentsSidebar items={tableOfContents} />
        </div>
        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm flex flex-col gap-4 mb-6">
            <div className="text-[#3D334A] flex flex-col gap-2.5">
              <h1 className="text-[24px] md:text-[32px] leading-[120%] font-bowler">
                {(displayInstructorName || instructor?.name || "").toUpperCase() ||
                  t("teacher.instructorName")}
              </h1>
              <p className="leading-[120%] text-[15px] md:text-base">
                {pickInstructorLocalizedText(
                  instructor?.qualificationLocalized,
                  loc
                ) ||
                  instructor?.qualification ||
                  t("teacher.professionalTitle")}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 mt-2">
              <button
                type="button"
                className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm cursor-pointer hover:shadow-md hover:border-[#D4BAFC] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4BAFC] focus-visible:ring-offset-2"
                onClick={() => scrollToSection("instructor-section-courses")}
                aria-label={`${t("teacher.instructorCourses")}${displayProfession ? ` — ${displayProfession}` : ""}`}
              >
                <CoursesIcon />
                <span className="text-[#D4BAFC] mt-2 text-[15px] font-bowler">
                  {t("teacher.instructorCourses")}
                </span>
              </button>
              <button
                type="button"
                className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm cursor-pointer hover:shadow-md hover:border-[#D4BAFC] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4BAFC] focus-visible:ring-offset-2"
                onClick={() => {
                  const hasCerts =
                    (instructor?.certificates || []).some((c) => (c.url || "").trim());
                  if (hasCerts) scrollToSection("instructor-section-certificates");
                  else if (diplomaSlides.length > 0) {
                    scrollToSection("instructor-section-diplomas");
                  } else {
                    scrollToSection("instructor-section-certificates");
                  }
                }}
                aria-label={t("teacher.instructorCertificates")}
              >
                <CertificatesIcon />
                <span className="text-[#D4BAFC] mt-2 text-[15px] font-bowler">
                  {t("teacher.instructorCertificates")}
                </span>
              </button>
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white w-full text-center md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                {instructor?.wikipedia ? (
                  <a
                    href={instructor.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center flex-col h-full w-full"
                  >
                    <WikipediaIcon />
                    <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                      {t("teacher.wikipedia")}
                    </h5>
                  </a>
                ) : (
                  <>
                    <WikipediaIcon />
                    <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                      {t("teacher.wikipedia")}
                    </h5>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-6 md:p-10 shadow-sm">
            <h2 className="text-[#3D334A] text-[22px] md:text-[28px] font-bold mb-6">
              {t("teacher.aboutInstructor")}
            </h2>

            {/* Bio Section */}
            <div className="text-[#3D334A] text-[15px] md:text-base mb-6">
              <p className="mb-4">
                {getMultilingualContent(instructor?.bio) ||
                  t("teacher.bioPlaceholder")}
              </p>
            </div>

            {/* HTML Content Section */}
            {Boolean(localizedHtml?.trim()) && (
              <div className="text-[#3D334A] text-[15px] md:text-base leading-relaxed">
                <div
                  className="instructor-content prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderedHtml,
                  }}
                />
                <style jsx global>{`
                  .instructor-content h1,
                  .instructor-content h2,
                  .instructor-content h3,
                  .instructor-content h4,
                  .instructor-content h5,
                  .instructor-content h6 {
                    font-family: "Bowler", sans-serif !important;
                    color: #3d334a !important;
                  }

                  .instructor-content p,
                  .instructor-content li,
                  .instructor-content ul,
                  .instructor-content ol {
                    font-family: "Pt", sans-serif !important;
                    color: #846fa0 !important;
                    line-height: 1.7 !important;
                  }
                `}</style>
              </div>
            )}

            {/* Rating Section */}
            {instructor?.averageRating && instructor.averageRating > 0 && (
              <div className="mt-6 p-4 bg-[#F9F7FE] rounded-[10px]">
                <h3 className="text-[#3D334A] text-[18px] font-semibold mb-2">
                  {t("teacher.rating")}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#846FA0] text-[20px] font-bold">
                    {instructor.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[#3D334A]">/ 5.0</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 w-[220px] flex-shrink-0">
          <Image
            src="/assets/images/reklamos.png"
            width={180}
            height={220}
            alt="ads"
            className="rounded-[10px] w-full object-cover"
          />
        </div>
      </div>
      <div
        id="instructor-section-courses"
        className="scroll-mt-24 md:scroll-mt-28"
      >
        <div className="md:mt-10">
          <Professional
            withBanner={false}
            title={""}
            bgColor="white"
            withProfText={false}
            showReviews={false}
            instructorCoursesFilter={instructorCoursesFilter}
          />
        </div>
      </div>
      <div
        id="instructor-section-certificates"
        className="scroll-mt-24 md:scroll-mt-28"
      >
        {instructor?.certificates && instructor?.certificates?.length > 0 ? (
          <div className="md:mt-10">
            <Certificate
              slides={(instructor?.certificates || [])
                .filter((certificate) => (certificate.url || "").trim())
                .map((certificate) => ({
                  src: certificate.url!.trim(),
                  title: certificate.name,
                  subtitle: [certificate.issuer, certificate.date]
                    .filter((x) => (x || "").trim())
                    .join(" · "),
                }))}
              titleKey="teacher.certificatesTitle"
            />
          </div>
        ) : (
          <div className="min-h-[1px]" aria-hidden />
        )}
      </div>
      {diplomaSlides.length > 0 ? (
        <div id="instructor-section-diplomas" className="scroll-mt-24 md:scroll-mt-28 md:mt-10">
          <Certificate
            slides={diplomaSlides}
            titleKey="teacher.diplomasTitle"
            orientation="horizontal"
          />
        </div>
      ) : null}
      <div className="my-10">
        <Subscribe
          backgroundImage="/assets/images/bluebg.jpg"
          titleKey="teacher.subscribeBannerTitle"
          buttonTextKey="teacher.subscribeBannerButton"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          href="/shoppingcard"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
      </div>
      <Footer />
    </div>
  );
};

export default TeacherInfo;
