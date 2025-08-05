"use client";
import React from "react";
import Header from "../components/Header";
import Category from "../components/Category";
import Rehabilitation from "../components/Rehabilitation";
import Works from "../components/Works";
import { Footer } from "../components/Footer";

import { useInstructors } from "../hooks/useInstructor";
import Image from "next/image";
import Banner from "../components/Banner";

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

interface Certificate {
  name: string;
}

const About = () => {
  const { instructors, loading } = useInstructors();
  
  // Debug ინფორმაცია
  console.log('About page - instructors:', instructors);
  console.log('About page - loading:', loading);
  console.log('About page - Array.isArray(instructors):', Array.isArray(instructors));

  // instructors მონაცემების კონვერტაცია Teacher format-ში
  const teacherData: Teacher[] = (Array.isArray(instructors) ? instructors : []).map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    position: instructor.profession,
    institution: '', // ეს ველი არ არის instructor API-ში
    credentials: instructor.certificates?.map((cert: Certificate) => cert.name).join(', ') || '',
    education: [], // ეს ველი არ არის instructor API-ში
    imageUrl: instructor.profileImage,
    bio: {
      ru: instructor.bio?.ru || '',
      en: instructor.bio?.en || '',
      ka: instructor.bio?.ka || ''
    },
    htmlContent: instructor.htmlContent || {
      ru: instructor.bio?.ru || '',
      en: instructor.bio?.en || '',
      ka: instructor.bio?.ka || ''
    }
  }));

  return (
    <div>
      <Header variant="about" />
      <div className="mt-40">
        <Rehabilitation />
        <Category bgColor="#F9F7FE" customRounded="30px" customMx="20px" />
        <Works
          title={"test"} 
          items={[]} 
          customMargin="20px"
          customBorderRadius="15px"
          seeAll={false}
          scrollable={true}
        />
        <div className="py-10">
          <h1 className="text-[#3D334A] text-[32px] md:text-[64px] leading-[100%] tracking-[-3%] font-light text-center">
            Наша цель
          </h1>
          <div className="md:m-10 m-5">
            <div className="bg-[#F9F7FE]  md:py-[34px] md:pl-10 mb-5 p-4 rounded-[15px]">
              <p className="text-[#846FA0] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-light">
                Мы нацелены на постоянное расширение списка направлений
                реабилитации и персонализацию программ реабилитации, и будем
                рады обратной связи с нашими пользователями, чтобы определиться
                какие разделы реабилитации нам нужно добавить и какие
                дополнительные возможности следует развить.
              </p>
            </div>
            <div className="flex md:flex-row flex-col items-center gap-5">
              <div className="bg-[#F9F7FE] md:p-10 p-4 rounded-[15px]">
                <p className="text-[#846FA0] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-light">
                  Мы обеспечим вам возможность бесплатных консультаций с
                  квалифицированными кураторами нашей платформы, а также
                  возможность консультаций с ведущими специалистами в клиниках
                  Израиля.
                </p>
              </div>
              <div className="bg-[#F9F7FE] md:p-10 p-4 rounded-[15px]">
                <p className="text-[#846FA0] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-light">
                  Мы обеспечим вам возможность бесплатных консультаций с
                  квалифицированными кураторами нашей платформы, а также
                  возможность консультаций с ведущими специалистами в клиниках
                  Израиля.
                </p>
              </div>
            </div>
          </div>
        </div>

         <Banner
          backgroundUrl="/assets/images/bluebg.jpg"
          logoUrl="/assets/images/simpleLogo.svg"
          icon="/assets/images/profIcon.png"
          iconHeight={50}
          iconWidth={170}
        />
        {/* ინსტრუქტორების სექცია */}
        <div className="w-full px-4 md:px-6 md:mx-5 py-12 bg-[#F9F7FE] rounded-[30px] overflow-hidden">
          <h2 className="text-[32px] md:text-[40px] text-[#3D334A] font-light mb-6">
            НАШИ ПРЕПОДАВАТЕЛИ
          </h2>
          
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Преподаватели загружаются...</p>
              </div>
            ) : teacherData.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-red-500">Нет данных о преподавателях</p>
                <p className="text-sm text-gray-500">Loading: {loading ? 'true' : 'false'}</p>
                <p className="text-sm text-gray-500">Instructors: {Array.isArray(instructors) ? instructors.length : 'not array'}</p>
              </div>
            ) : teacherData.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-[20px] shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 p-4">
                  <div className="w-full md:w-[400px] h-[400px] relative rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={teacher.imageUrl}
                      width={400}
                      height={400}
                      alt={teacher.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-2 md:pt-4">
                    <h3 className="text-[28px] md:text-[40px] text-[#3D334A] font-light mb-2 leading-snug">
                      {teacher.name}
                    </h3>

                    <div className="mb-4 md:mb-6 space-y-1">
                      <div className="text-[18px] md:text-[20px] text-[#3D334A] font-light">
                        {teacher.position}
                      </div>
                      {teacher.institution && (
                        <div className="text-[18px] md:text-[20px] text-[#3D334A]">
                          {teacher.institution}
                        </div>
                      )}
                    </div>

                    {teacher.credentials && (
                      <div className="text-[16px] text-[#3D334A] mb-4 md:mb-6">
                        {teacher.credentials}
                      </div>
                    )}

                    <div className="space-y-3 text-[16px] text-[#846FA0] leading-relaxed max-w-[750px]">
                      <p>{teacher.bio.ru || teacher.bio.en}</p>
                    </div>

                    <div className="mt-4 pt-4">
                      <span className="text-[#D4BAFC] text-lg font-medium">
                        Подробная информация о преподавателе
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-20">
      <Footer />
      </div>
    </div>
  );
};

export default About;
