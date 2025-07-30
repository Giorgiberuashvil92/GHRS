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
  const fallbackTeachers: Teacher[] = [
    {
      id: "1",
      name: "ААРОН ЯКОБИ",
      position: "Основатель и руководитель",
      institution: "«Колледжа медицинского массажа»",
      credentials: "Dr.Аарон Якоби, Ph.D, C.A., P.T.",
      education: [
        "выпускник Института Уингейта, Национального института передового опыта в спорте Государства Израиль",
        "В 1982 году окончил курс Мануальной-терапии в Парамедицинском институте в Карлсруэ, Германия",
        "В 1996 году он окончил факультет китайской медицины Колледжа комплиментарной медицины в Тель-Авиве"
      ],
      imageUrl: "/assets/images/teachers/aaron.jpg",
      bio: {
        en: "Aaron Jacoby is the founder and director of the 'College of Medical Massage'.",
        ru: "Аарон Якоби является основателем и директором 'Колледжа медицинского массажа'.",
        ka: "არონ იაკობი არის ფონდატორი და დირექტორი 'მედიკალური მასაჟის კოლეჯი'."
      },
      htmlContent: {
        en: "<p>Aaron Jacoby is the founder and director of the 'College of Medical Massage'.</p>",
        ru: "<p>Аарон Якоби является основателем и директором 'Колледжа медицинского массажа'.</p>",
        ka: "<p>არონ იაკობი არის ფონდატორი და დირექტორი 'მედიკალური მასაჟის კოლეჯი'.</p>"
      }
    },
  ];

  const allTeachers = teachers.length > 0 ? teachers : fallbackTeachers;
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
              className="space-y-3 text-[16px] text-[#846FA0] leading-relaxed max-w-[750px]"
              dangerouslySetInnerHTML={{
                __html:
                  teacher.htmlContent.ru || teacher.htmlContent.en || "",
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
