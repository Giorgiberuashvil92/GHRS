"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { getDefaultMenuItems } from "../components/Header/Header";
import { useInstructors } from "../hooks/useInstructor";
import { useI18n } from "../context/I18nContext";
import { Footer } from "../components/Footer";
import {
  instructorDisplayNameForLocale,
  resolveCourseLocale,
} from "../utils/instructorDisplay";
import type { Instructor } from "../../types/instructor";

const clampText = (text: string, max: number): string => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed;
};

interface BigTeacherCardProps {
  instructor?: Instructor;
}

/** ბლოგის `BigBlogCard`-ის იგივე ლეიაუთი — ყველა ინსტრუქტორი ერთნაირი „დიდი“ ბარათით */
const BigTeacherCard = ({ instructor }: BigTeacherCardProps) => {
  const { t, locale } = useI18n();
  const loc = resolveCourseLocale(locale);

  if (!instructor) {
    return (
      <div className="rounded-[20px] h-full min-h-[420px] md:min-h-[500px] md:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden bg-white shadow-sm animate-pulse">
        <div className="absolute top-0 left-0 w-full h-[45%] overflow-hidden bg-gray-200" />
        <div className="flex flex-col gap-4 mt-auto relative z-10">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
    );
  }

  const cardName =
    instructorDisplayNameForLocale(instructor, loc) || instructor.name;
  const professionLabel =
    (
      instructor.professionLocalized?.[
        loc as keyof NonNullable<typeof instructor.professionLocalized>
      ] ?? ""
    ).trim() ||
    instructor.profession ||
    "";
  const bioText =
    instructor.bio?.[locale as keyof typeof instructor.bio] ||
    instructor.bio?.en ||
    instructor.bio?.ru ||
    "";

  const metaParts: string[] = [];
  if (instructor.coursesCount !== undefined) {
    metaParts.push(`${instructor.coursesCount} ${t("teachers.courses")}`);
  }
  const metaLine = metaParts.join(" · ");

  return (
    <Link href={`/teachers/${instructor.id}`}>
      <div className="rounded-[20px] h-full min-h-[420px] md:min-h-[500px] md:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="absolute top-0 left-0 w-full h-[45%] overflow-hidden">
          <Image
            src={
              instructor.profileImage ||
              "/assets/images/default-instructor.png"
            }
            alt={cardName}
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div
          className="absolute top-8 right-8 flex flex-col gap-4 z-10"
          aria-hidden
        >
          <span className="p-2 rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.593 3.322C18.693 3.45 19.5 4.399 19.5 5.507V21L12 17.25L4.5 21V5.507C4.5 4.399 5.306 3.45 6.407 3.322C10.123 2.89 13.877 2.89 17.593 3.322Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="p-2 rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-4 mt-auto relative z-10">
          {professionLabel ? (
            <span className="px-3 py-2 bg-[#E9DFF6] inline-block rounded-[6px] text-[#3D334A] text-[12px] font-bold leading-[90%] uppercase font-bowler self-start">
              {professionLabel}
            </span>
          ) : null}
          <h2 className="font-bowler text-[#1A1A1A] text-lg md:text-xl font-semibold leading-tight line-clamp-2">
            {clampText(cardName, 110)}
          </h2>
          <p className="font-pt text-[#1A1A1A]/80 text-sm line-clamp-3">
            {clampText(bioText, 280)}
          </p>
          {metaLine ? (
            <p className="font-pt text-[#1A1A1A]/55 text-xs mt-1">{metaLine}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

const Teachers = () => {
  const { instructors, loading, error } = useInstructors();
  const { t } = useI18n();
  const menuItems = getDefaultMenuItems(t);

  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar
        menuItems={menuItems}
        blogBg={true}
        allCourseBg={false}
      />
      <MobileNavbar />

      <div className="bg-[#F9F7FE] md:mx-5 md:px-10 px-4 pb-6">
        <h1 className="font-bowler text-[32px] md:text-[64px] pt-10 text-[#3D334A] leading-[100%] tracking-[-1%] uppercase">
          {t("teachers.our_teachers")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12 px-4 md:px-10">
        {loading ? (
          <>
            <BigTeacherCard />
            <BigTeacherCard />
            <BigTeacherCard />
            <BigTeacherCard />
          </>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-500 mb-2">{t("teachers.load_error")}</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500">{t("teachers.not_found")}</p>
          </div>
        ) : (
          instructors.map((instructor) => (
            <BigTeacherCard key={instructor.id} instructor={instructor} />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Teachers;
