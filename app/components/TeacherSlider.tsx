"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SliderArrows from "./SliderArrows";

interface Teacher {
  id: string;
  name: string;
  position: string;
  institution: string;
  credentials: string;
  education: string[];
  imageUrl: string;
  bio: {
    en: string;
    ru: string;
    ka?: string;
  };
  htmlContent: {
    en: string;
    ru: string;
    ka?: string;
  };
}

interface TeacherSliderProps {
  teachers?: Teacher[];
}

const TeacherSlider: React.FC<TeacherSliderProps> = ({ teachers = [] }) => {
  
  // Function to clean and format HTML content
  const cleanHtmlContent = (htmlContent: string) => {
    let headingIndex = 1;
    
    return htmlContent
      // First, let's handle the outer container div with monospace styling
      .replace(/<div style="color: #7b88a1; font-size: 12px; font-family: Menlo, Monaco, 'Courier New', monospace;">/g, '<div class="text-gray-600">')
      
      // Replace specific colored spans - these seem to be for syntax highlighting
      .replace(/<span style="color: #81a1c1;">/g, '<strong class="text-blue-600">')
      .replace(/<span style="color: #7b88a1;">/g, '<span class="text-gray-700">')
      
      // Clean up any remaining style attributes
      .replace(/style="[^"]*"/g, '')
      
      // Handle HTML tag representations (these appear to be showing HTML code)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      
      // Add proper spacing to elements
      .replace(/<div>/g, '<div class="mb-3">')
      // Add IDs to h3 headings for table of contents navigation
      .replace(/<h3>/g, () => `<h3 id="heading-${headingIndex++}" class="text-xl font-bold text-[#3D334A] mt-6 mb-3">`)
      .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
      .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="text-gray-700">')
      
      // Handle line breaks
      .replace(/<br>/g, '<br class="mb-2" />')
      
      // Close any unclosed tags properly
      .replace(/<\/span>/g, '</span>')
      .replace(/<\/strong>/g, '</strong>');
  };

  // Function to truncate HTML content for preview
  const truncateHtmlContent = (htmlContent: string, maxLength: number = 200) => {
    // First clean the HTML
    const cleanedContent = cleanHtmlContent(htmlContent);
    
    // Remove HTML tags to get plain text for length calculation
    const textContent = cleanedContent.replace(/<[^>]*>/g, '');
    
    // If content is short enough, return cleaned HTML
    if (textContent.length <= maxLength) {
      return cleanedContent;
    }
    
    // Truncate plain text and add ellipsis
    const truncatedText = textContent.substring(0, maxLength).trim() + '...';
    
    // Return as simple paragraph for preview
    return `<p class="mb-4 leading-relaxed">${truncatedText}</p>`;
  };

  const allTeachers = teachers.length > 0 ? teachers : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : allTeachers.length - 1
    );
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < allTeachers.length - 1 ? prevIndex + 1 : 0
    );
  };

  const teacher = allTeachers[currentIndex];

  return (
    <div className="w-full px-4 md:px-6 md:mx-5 py-12 bg-[#F9F7FE] rounded-[30px] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[32px] md:text-[40px] text-[#3D334A] font-bold">
          НАШИ ПРЕПОДАВАТЕЛИ
        </h2>
        <div className="md:mx-5">
          <SliderArrows onScrollLeft={scrollLeft} onScrollRight={scrollRight} />
        </div>
      </div>

      <Link
        href="/teachers"
        className="text-[#D4BAFC] text-lg block mb-10 font-semibold hover:underline"
      >
        СМОТРЕТЬ ВСЕ →
      </Link>

      <div className="bg-white rounded-[20px] shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 p-4">
          <div className="w-full md:w-[400px] h-[400px] relative rounded-lg overflow-hidden shrink-0">
            <Image
              src={teacher.imageUrl}
              width={511}
              height={496}
              alt={teacher.name}
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col pt-2 md:pt-4">
            <h3 className="text-[28px] md:text-[40px] text-[#3D334A] font-bold mb-2 leading-snug">
              {teacher.name}
            </h3>

            <div className="mb-4 md:mb-6 space-y-1">
              <div className="text-[18px] md:text-[20px] text-[#3D334A] font-medium">
                {teacher.position}
              </div>
              <div className="text-[18px] md:text-[20px] text-[#3D334A]">
                {teacher.institution}
              </div>
            </div>

            <div className="text-[16px] text-[#3D334A] mb-4 md:mb-6">
              {teacher.credentials}
            </div>

            <div
              className="space-y-3 text-[16px] text-[#846FA0] leading-relaxed max-w-[750px] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: truncateHtmlContent(
                  teacher.htmlContent.ru || teacher.htmlContent.en || ""
                ),
              }}
            />

            <Link
              href={`/teachers/${teacher.id}`}
              className="text-[#D4BAFC] text-lg pl-10 mt-auto text-end items-end w-full mr-10 font-medium hover:underline pt-4"
            >
              ПОДРОБНЕЕ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSlider;
