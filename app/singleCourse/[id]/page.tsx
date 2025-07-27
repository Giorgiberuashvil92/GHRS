"use client";
import Image from "next/image";
import { FaBullhorn, FaBookOpen } from "react-icons/fa";
import DesktopNavbar from "../../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCourse } from '../../config/api';

interface Course {
  _id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  price: number;
  thumbnail: string;
  instructor: {
    name: string;
  };
  announcements?: Array<{
    title: {
      en: string;
      ru: string;
    };
    content: {
      en: string;
      ru: string;
    };
    isActive: boolean;
  }>;
  syllabus?: Array<{
    title: {
      en: string;
      ru: string;
    };
    description: {
      en: string;
      ru: string;
    };
    duration: number;
  }>;
}

export default function SingleCourse() {
  const params = useParams();
  const courseId = params.id as string;
  
  console.log('Course ID from params:', courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rightCardImage = "/assets/images/reklamos.png";
  const tabs = ["Описание", "Учебный план", "Объявление", "Отзывы"];
  const [activeTab, setActiveTab] = useState("Описание");

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        console.log('No courseId found in params');
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading course with ID:', courseId);
        const data = await fetchCourse(courseId);
        console.log('Loaded course data:', data);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            მონაცემები იტვირთება...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600 mb-4">
            შეცდომა კურსის ჩატვირთვაში
          </h2>
          <p className="text-gray-600">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DesktopNavbar 
        menuItems={defaultMenuItems} 
        blogBg={false}
        allCourseBg={false}
      />

      <div className="bg-[#FAF7FF] flex flex-col items-center py-6 px-2 w-full text-[#302A3A]">
        <div className="w-full md:px-10">
          <img
            src={course.thumbnail}
            alt={course.title.ru}
            className="w-full h-[517px] object-cover mb-10 rounded-[40px]"
          />
        </div>
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* მარცხენა ქარდი */}
          <div className="w-full md:w-[335px] flex-shrink-0 flex flex-col h-auto md:h-[262px] bg-white p-4 rounded-[20px] order-1 md:order-1 mb-4 md:mb-0">
            <div className="flex items-center gap-4 pb-[18px]">
              <Image
                src="/assets/images/someone.png"
                alt="avatar"
                width={50}
                height={50}
                className="w-[50px] h-[50px] rounded-[12px] object-cover mb-[10px]"
              />
              <span className="font-bold text-[18px] leading-7 tracking-[0.01em] text-[rgba(61,51,74,1)]">
                {course.instructor.name}
              </span>
            </div>
            <div className="border-t border-[#EEEAFB]" />
            <div className="flex gap-[10px] py-[18px] items-center">
              <span className="w-[48px] h-[48px] flex items-center justify-center bg-[#E1D7FA] rounded-[12px]">
                <FaBullhorn className="text-[#A993F8] text-[26px]" />
              </span>
              <span className="font-semibold text-[18px] text-[rgba(132,111,160,1)]">
                12 слушателей
              </span>
            </div>
            <div className="border-t border-[#EEEAFB]" />
            <div className="flex gap-[10px] py-[18px] items-center">
              <span className="w-[48px] h-[48px] flex items-center justify-center bg-[#E1D7FA] rounded-[12px]">
                <FaBookOpen className="text-[#A993F8] text-[26px]" />
              </span>
              <span className="font-semibold text-[18px] text-[rgba(132,111,160,1)]">
                5 курсов
              </span>
            </div>
          </div>

          {/* მარჯვენა ნაწილი: ფასი, ღილაკი, რეკლამები */}
          <aside className="w-full md:w-[270px] flex flex-col gap-4 order-2 md:order-3 mb-4 md:mb-0">
            <div className="bg-white rounded-2xl shadow-[0_7px_32px_0_rgba(141,126,243,0.13)] p-4 flex flex-col gap-2 mb-2 md:mb-0">
              <div className="flex items-center text-[rgba(212,186,252,1)] font-bold text-[32px] leading-none">
                {course.price}
                <span className="text-[rgba(212,186,252,1)] text-xl font-normal ml-1">
                  $
                </span>
              </div>
              <div className="text-[#A9A6B4] text-sm">Стоимость курса</div>
            </div>
            <div className="bg-[#F1EEFF] rounded-2xl flex items-center justify-center px-5 py-3 font-bold text-[#8D7EF3] mb-1 text-lg cursor-pointer hover:bg-[#e2dbff] transition-colors">
              ПРИОБРЕСТИ КУРС
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <Image
                src={rightCardImage}
                alt="ad"
                className="w-full rounded-xl"
                width={300}
                height={600}
              />
              <Image
                src={rightCardImage}
                alt="ad"
                className="w-full rounded-xl"
                width={300}
                height={600}
              />
            </div>
          </aside>

          {/* მთავარი ნაწილი */}
          <main className="flex-1 flex flex-col gap-6 order-3 md:order-2">
            <div className="bg-[rgba(233,223,246,1)] w-full p-4 py-5 rounded-[20px] flex flex-wrap md:gap-[30px] gap-2 items-center justify-between relative mb-4">
              {tabs.map((tab, idx) => (
                <div className="relative group flex-1 min-w-[90px]" key={idx}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`block w-full text-[rgba(132,111,160,1)] md:text-[16px] text-[14px] leading-[90%] md:leading-[120%] tracking-[0%] uppercase text-center transition group-hover:text-[rgba(61,51,74,1)] ${
                      activeTab === tab ? "text-[rgba(61,51,74,1)]" : ""
                    }`}
                  >
                    {tab}
                  </button>
                  <div
                    className={`absolute left-0 -bottom-[8px] h-[2px] w-full bg-[rgba(61,51,74,1)] transition-transform ${
                      activeTab === tab
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 order-4 md:order-2">
              {activeTab === "Описание" && (
                <article className="bg-white rounded-2xl shadow-[0_7px_32px_0_rgba(141,126,243,0.13)] px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
                  <h1 className="text-2xl font-bold uppercase text-[#302A3A]">
                    {course.title.ru}
                  </h1>
                  <div 
                    className="text-[#A9A6B4]"
                    dangerouslySetInnerHTML={{ __html: course.description.ru }}
                  />
                </article>
              )}
              {activeTab === "Учебный план" && course.syllabus && (
                <div className="flex flex-col gap-2">
                  {course.syllabus.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl px-6 py-4 font-bold text-[#302A3A] text-[15px] mb-2"
                    >
                      {index + 1}.
                      <div dangerouslySetInnerHTML={{ __html: item.title.ru }} />
                      {item.description && (
                        <div 
                          className="font-normal mt-2 text-[#A9A6B4]"
                          dangerouslySetInnerHTML={{ __html: item.description.ru }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "Объявление" && course.announcements && (
                <div className="flex flex-col gap-2">
                  {course.announcements
                    .filter(announcement => announcement.isActive)
                    .map((announcement, index) => (
                    <div
                      key={index}
                      className="bg-[#F1EEFF] rounded-2xl px-6 py-4 text-[#8D7EF3] text-[15px] mb-2"
                    >
                      <h3 
                        className="font-bold mb-2"
                        dangerouslySetInnerHTML={{ __html: announcement.title.ru }}
                      />
                      <div dangerouslySetInnerHTML={{ __html: announcement.content.ru }} />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "Отзывы" && (
                <div className="bg-white rounded-2xl px-6 py-4 flex flex-col gap-2">
                  <div className="font-bold text-[#302A3A] text-[15px] mb-4">
                    ОТЗЫВЫ УЧЕНИКОВ
                  </div>
                  <div className="text-[#A9A6B4]">
                    Пока нет отзывов
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
} 