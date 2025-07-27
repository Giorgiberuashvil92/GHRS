"use client";

import React, { useRef } from "react";
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

const TeacherSlider: React.FC<TeacherSliderProps> = ({
  teachers = []
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fallback data if no teachers provided
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
        ka: "არონ იაკობი არის ფონდატორი და დირექტორი 'მედიკალური მასაჯის კოლეჯი'.",
      },
      htmlContent: {
        en: "<p>Aaron Jacoby is the founder and director of the 'College of Medical Massage'.</p>",
        ru: "<p>Аарон Якоби является основателем и директором 'Колледжа медицинского массажа'.</p>",
        ka: "<p>არონ იაკობი არის ფონდატორი და დირექტორი 'მედიკალური მასაჯის კოლეჯი'.</p>",
      }
    }
  ];

  const allTeachers = teachers.length > 0 ? teachers : fallbackTeachers;

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full px-6 py-12 md:mx-5 md:rounded-[30px] bg-[#F9F7FE] md:px-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[40px] text-[#3D334A] font-bold">НАШИ ПРЕПОДАВАТЕЛИ</h2>
        <SliderArrows
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
        />
      </div>
      
      <Link href="/teachers" className="text-[#D4BAFC] text-lg block mb-8">
        СМОТРЕТЬ ВСЕ →
      </Link>

      <div className="relative">
        <div 
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide"
        >
          {allTeachers.map((teacher) => (
            <div 
              key={teacher.id}
              className="flex-none w-full md:w-[1340px] bg-white rounded-[20px] overflow-hidden"
            >
              <div className="flex gap-12 p-8">
                <div className="w-[400px] h-[400px] relative">
                  <Image
                    src={teacher.imageUrl}
                    fill
                    alt={teacher.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col pt-4">
                  <h3 className="text-[40px] text-[#3D334A] font-bold mb-2">{teacher.name}</h3>
                  <div className="mb-6">
                    <p className="text-[20px] text-[#3D334A]">{teacher.position}</p>
                    <p className="text-[20px] text-[#3D334A]">{teacher.institution}</p>
                  </div>
                  <p className="text-[16px] text-[#3D334A] mb-6">{teacher.credentials}</p>
                  <div 
                    className="space-y-4 text-[16px] text-[#846FA0] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: teacher.htmlContent.ru || teacher.htmlContent.en || "" }}
                  />
                  <Link 
                    href={`/teachers/${teacher.id}`}
                    className="text-[#D4BAFC] text-lg mt-auto self-start"
                  >
                    ПОДРОБНЕЕ
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherSlider; 