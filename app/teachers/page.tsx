"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header/Header";
import { useInstructors } from "../hooks/useInstructor";
import { useI18n } from "../context/I18nContext";
import { Footer } from "../components/Footer";
import {
  instructorDisplayNameForLocale,
  resolveCourseLocale,
} from "../utils/instructorDisplay";

const Teachers = () => {
  const { instructors, loading, error } = useInstructors();
  const { t, locale } = useI18n();
  const loc = resolveCourseLocale(locale);

  return (
    <div>
      <div className="bg-[#F9F7FE]">
        <DesktopNavbar
          menuItems={defaultMenuItems}
          blogBg={false}
          allCourseBg={false}
        />
        <MobileNavbar />
        
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-[32px] md:text-[64px] font-bowler uppercase tracking-[-1%] text-[#3D334A] leading-[100%] mb-8">
            {t("teachers.our_teachers") || "НАШИ ПРЕПОДАВАТЕЛИ"}
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-2">Error loading instructors</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No instructors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => {
                const cardName = instructorDisplayNameForLocale(instructor, loc);
                return (
                <Link
                  key={instructor.id}
                  href={`/teachers/${instructor.id}`}
                  className="bg-white rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={instructor.profileImage || "/assets/images/default-instructor.png"}
                      fill
                      alt={cardName || instructor.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[24px] font-bowler uppercase text-[#3D334A] mb-2">
                      {cardName || instructor.name}
                    </h3>
                    <p className="text-[16px] text-[#846FA0] font-medium mb-3">
                      {instructor.profession}
                    </p>
                    <p className="text-[14px] text-[#846FA0] line-clamp-3">
                      {instructor.bio?.[locale as keyof typeof instructor.bio] || 
                       instructor.bio?.en || 
                       instructor.bio?.ru || 
                       ""}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-[#846FA0]">
                      {instructor.coursesCount !== undefined && (
                        <span>{instructor.coursesCount} {t("teachers.courses") || "courses"}</span>
                      )}
                      {instructor.studentsCount !== undefined && (
                        <span>{instructor.studentsCount} {t("teachers.students") || "students"}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teachers;
