"use client";
import React from "react";
import Image from "next/image";
import DesktopNavbar from "@/app/components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "@/app/components/Header";

const staticCourse = {
  title: "Ортопедия",
  description:
    "Улучшение динамики и подвижности грудного отдела. Современные методები реабилитации и профилактики.",
  price: 920,
  currency: "₽/мес",
  imageUrl: "/assets/images/workMan.png",
  level: "beginner",
  category: { name: "Ортопедия" },
  instructor: { name: "Др. Иван Иванов" },
  duration: "12 საათი",
  comments: [
    {
      user: "АЛЕКСЕЙ АНАТОЛЬЕВ",
      date: "12.03.2023 15:16",
      text: "Статья просто нечто! Для меня оказалась очень полезной, т.к я работаю программистом и постоянно сижу дома. Спасибо!",
      avatar: "/assets/images/user1.png",
    },
    {
      user: "ЕКАТЕРИНА ПЕТРОВА",
      date: "13.03.2023 10:22",
      text: "Очень интересный и полезный материал!",
      avatar: "/assets/images/user1.png",
    },
  ],
  rating: 4.7,
  ratingCount: 26,
};

const sidebarBanners = [
  {
    image: "/assets/images/blog1.png",
    text: "Как физиотерапия остеопороза снижает риск переломов",
    category: "Ортопедия",
  },
  {
    image: "/assets/images/blog1desktop.png",
    text: "Профилактика и лечение болей в спине",
    category: "Ортопедия",
  },
];

const SingleCourse = () => {
  const course = staticCourse;

  return (
    <>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} />
      <main className="flex justify-between gap-[30px] text-[#3D334A]">
        {/* Sidebar - სექციები და ბანერები */}
        <div className="p-5 bg-[rgba(255,255,255,1)] min-h-[700px] rounded-[20px] max-w-[335px] hidden md:block flex-col">
          <h2 className="text-lg font-semibold mb-4 text-[rgba(61,51,74,1)]">
            Содержание
          </h2>
          <div className="space-y-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <div className="flex items-start gap-3" key={i}>
                <span className="text-[rgba(61,51,74,1)]">{i + 1}.</span>
                <span className="text-[rgba(61,51,74,1)] underline tracking-[-2%]">
                  Что считается хорошим образом жизни?
                </span>
              </div>
            ))}
          </div>
          {sidebarBanners.map((banner, i) => (
            <div
              key={i}
              className="w-[335px] bg-[rgba(255,255,255,1)] p-5 flex flex-col justify-between rounded-[20px] h-[249px] mb-5"
            >
              <p>{banner.text}</p>
              <div className="flex justify-between items-center ">
                <button className="bg-[rgba(233,223,246,1)] rounded-[6px] p-[8px] text-[18px] uppercase leading-[90%]">
                  {banner.category}
                </button>
                <div className="flex justify-between items-center gap-[6px]">
                  <div className="w-[40px] h-[40px] rounded-[6px] bg-[rgba(233,223,246,1)] flex items-center justify-center">
                    <Image
                      className="w-[14px] h-[18px]"
                      src="/assets/images/bookmark.png"
                      alt=""
                      width={14}
                      height={18}
                    />
                  </div>
                  <div className="w-[40px] h-[40px] rounded-[6px] bg-[rgba(233,223,246,1)] flex items-center justify-center">
                    <Image
                      className="w-[14px] h-[18px]"
                      src="/assets/images/share.png"
                      alt=""
                      width={14}
                      height={18}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* მთავარი კონტენტი */}
        <div className="md:max-w-[690px] w-[690px] mt-0 ">
          <section className="bg-[rgba(255,255,255,1)] rounded-[20px] p-4">
            {/* Header image და სტატისტიკა */}
            <div className="w-full h-[300px] rounded-[20px] overflow-hidden mb-6 flex items-center justify-center bg-gray-100">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={600}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <header className="flex flex-col gap-[30px]">
              <div className="flex justify-between items-center ">
                <button className="bg-[rgba(233,223,246,1)] rounded-[6px] p-[8px] text-[18px] uppercase leading-[90%]">
                  {course.category?.name || "კატეგორია"}
                </button>
                <div className="flex justify-between items-center gap-[6px]">
                  {/* აქ შეიძლება იყოს action ღილაკები */}
                </div>
              </div>
              <section>
                <h2 className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[32px] ">
                  {course.title}
                </h2>
                <p className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] pt-6">
                  {course.description}
                </p>
                <div className="flex items-center gap-[30px] pt-[30px]">
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium">
                    ფასი: {course.price} {course.currency}
                  </span>
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium">
                    დონე: {course.level}
                  </span>
                  <span className="text-[rgba(61,51,74,1)] leading-[120%] tracking-[0%] text-[16px] font-medium">
                    ხანგრძლივობა: {course.duration}
                  </span>
                </div>
              </section>
            </header>
            {/* მთავარი ტექსტი/სექციები */}
            <section className="md:mt-[40px] mt-[20px]">
              <h2 className="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
                Что считается сидячим образом жизни?
              </h2>
              <p className="text-lg mb-[30px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
                Хотя не существует строгого определения того, что представляет
                собой малоподвижный образ жизни, у исследователей есть несколько
                различных показателей для измерения того, что такое сидячий
                образ жизни. Одним из показателей является время, которое
                человек проводит сидя или полулежа в часы бодрствования.
                Казалось бы, разумно предположить, что те, кто соответствует
                требованиям к физической активности, не будут считаться
                малоподвижными. Однако исследования показывают, что даже те, кто
                соблюдает объем физической активности, рекомендованный Всемирной
                организацией здравоохранения, все равно могут считаться ведущими
                малоподвижный образ жизни, если они проводят четыре-шесть часов
                сидения или лежания в день.
              </p>
              <div className="p-4 bg-[rgba(212,186,252,1)] rounded-[10px] items-center mb-6">
                <p className="text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
                  Проведение четырех-шести часов бодрствования сидя или лежа
                  считается сидячим образом жизни.
                </p>
              </div>
            </section>
            {/* შეფასება (rating) */}
            <section className="md:max-w-[690px] px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5 ">
              <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5">
                Оценить курс
              </h2>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-[4.16px] md:gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="max-w-[55.5px] max-h-[50.7px] rounded-[10px] overflow-hidden"
                    >
                      <Image
                        src="/assets/images/star-icon.png"
                        alt="rating star"
                        className="w-full h-full object-cover"
                        width={55.55}
                        height={50.7}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:justify-center items-center gap-[4.16px]">
                  <h4 className="md:text-[32px] text-lg text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
                    {course.rating}
                  </h4>
                  <span className="md:text-[16px] text-[10px] text-[rgba(213,209,219,1)] leading-[100%] tracking-[-1%]">
                    ({course.ratingCount} оценок)
                  </span>
                </div>
              </div>
            </section>
            {/* კომენტარები */}
            <section className="md:max-w-[690px] px-5 pt-5 md:pb-[40px] pb-6 bg-[rgba(255,255,255,1)] rounded-[20px] mt-5 ">
              <h2 className="md:text-2xl text-[18px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%] md:mb-[40px] mb-5">
                Комментарии
              </h2>
              <form className="max-w-[650px] mx-auto relative mb-6">
                <input
                  type="text"
                  placeholder="Введите ваш комментарий"
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
                {course.comments.map((comment, i) => (
                  <div
                    key={i}
                    className="flex gap-5 items-start max-w-[650px] bg-[rgba(249,247,254,1)] rounded-[20px] p-4"
                  >
                    <div className="w-[50px] h-[50px] rounded-[10px] bg-gray-300 flex-shrink-0 overflow-hidden">
                      <Image
                        src={comment.avatar}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-[rgba(61,51,74,1)] text-sm md:[18px]">
                          {comment.user}
                        </h3>
                        <p className="text-gray-500 text-xs">{comment.date}</p>
                      </div>
                      <p className="md:text-[18px] text-[16px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="block m-auto py-[17.5px] w-[319px] mt-[40px] max-w-[343px] md:w-[343px] bg-[rgba(212,186,252,1)] rounded-[10px] items-center text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
                Показать ещё
              </button>
            </section>
          </section>
        </div>
      </main>
    </>
  );
};

export default SingleCourse;
