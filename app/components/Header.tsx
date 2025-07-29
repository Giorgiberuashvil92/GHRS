"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CiBookmark } from "react-icons/ci";
import { RiShareForwardLine } from "react-icons/ri";

import Image from "next/image";
import MobileNavbar from "./Navbar/MobileNavbar";
import DesktopNavbar from "./Navbar/DesktopNavbar";
import Link from "next/link";
import { useI18n } from "../context/I18nContext";

export interface MenuItem {
  id: number;
  name: string;
  route: string;
}

interface HeaderProps {
  menuItems?: MenuItem[];
  variant?:
    | "default"
    | "rehabilitation"
    | "complex"
    | "category"
    | "blog"
    | "categories"
    | "category-detail"
    | "section";
  title?: string;
  info?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onPriceClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData?: any; // set-ის მონაცემები complex variant-ისთვის
}

export const defaultMenuItems: MenuItem[] = [
  { id: 1, name: "Все комплексы", route: "complex" },
  { id: 2, name: "О нас", route: "about" },
  { id: 3, name: "Блог", route: "blog" },
  { id: 4, name: "Контакты", route: "contact" },
];

const categories = [
  { id: 1, text: "15 категорий", image: "/assets/images/book.svg" },
  { id: 2, text: "Онлайн-чат", image: "/assets/icons/message.svg" },
  { id: 3, text: "1000+ уроков", image: "/assets/images/camera.svg" },
];

const categoryDetailItems = [
  { id: 1, text: "15 категорий", image: "/assets/icons/pulse.svg" },
  { id: 2, text: "Онлайн-чат", image: "/assets/images/camera.svg" },
  { id: 3, text: "1000+ уроков", image: "/assets/icons/watch.png" },
];

const complexItems = [
  { id: 1, text: "15 категорий", image: "/assets/icons/card.svg" },
  { id: 2, text: "36 комплексов", image: "/assets/icons/message.svg" },
  { id: 3, text: "1000+ уроков", image: "/assets/icons/heat.svg" },
];

const sectionItems = [
  { id: 1, text: "36 комплексов", image: "/assets/icons/pulse.svg" },
  { id: 2, text: "125 упражнений", image: "/assets/images/camera.svg" },
  { id: 3, text: "126 часов", image: "/assets/icons/watch.png" },
];

const Header: React.FC<HeaderProps> = ({
  variant = "default",
  title,
  info,
  onPriceClick,
  setData,
}) => {
  const [currentSlide, setCurrentSlide] = useState<0 | 1>(0);
  const { t } = useI18n();

  // ლოკალიზებული მენიუ items
  const localizedMenuItems = [
    { id: 1, name: t("navigation.all_complexes"), route: "complex" },
    { id: 2, name: t("navigation.about"), route: "about" },
    { id: 3, name: t("navigation.blog"), route: "blog" },
    { id: 4, name: t("navigation.contacts"), route: "contact" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentSlide(1);
      } else {
        setCurrentSlide(0);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRightArrowClick = () => {
    setCurrentSlide(1);
  };

  const handleLeftArrowClick = () => {
    setCurrentSlide(0);
  };

  return (
    <header
      className={`md:m-5 rounded-[20px] ${
        variant == "rehabilitation" && "h-[438px]"
      } ${variant == "default" && "h-[838px]"} ${
        variant == "blog" && "h-[218px] md:h-[518px]"
      } ${variant == "category-detail" && "h-[338px]"} ${
        variant == "section" && "h-[838px]"
      }`}
    >
      <div className="relative w-full rounded-[20px]">
        {variant !== "blog" && variant !== "category-detail" && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="video-bg absolute h-[838px] object-cover z-[-1] md:rounded-[20px]"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {variant === "category-detail" && (
          <div className="bg-[#F9F7FE] h-[338px] rounded-[20px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-[20px]"></div>
            <div className="relative z-10 p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold text-[#3D334A] mb-6">
                {title}
              </h1>
              <div className="flex gap-8">
                {categoryDetailItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      width={24}
                      height={24}
                      alt={item.text}
                      className="w-6 h-6"
                    />
                    {/* <span className="text-[#3D334A] text-lg">{item.text}</span> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {variant == "blog" && (
          <div className="rounded-[20px] px-5 font-[Pt]">
            <Image
              width={1120}
              height={518}
              src={"/assets/images/blogbg.jpg"}
              alt="blogBg"
              className="md:h-[518px] md:w-full h-[217px] w-[359px] bg-cover bg-center rounded-[20px] relative"
            />
            <div className="pt-[27px] md:pl-[32px] pl-4 pr-[20px] md:pb-[20px] pb-3 md:bg-[#3D334A4D] md:backdrop-blur-sm absolute bottom-0 md:bottom-5 md:ml-5 rounded-[20px]">
              <h2 className="hidden md:flex text-white text-[40px] leading-[120%] tracking-[-3%] md:w-[945px] w-[327px]">
                Курсы и мастер-классы для опытных терапевтов. Практикум по
                лечению ортопедических проблем
              </h2>
              <h2 className="flex md:hidden font-[Bowler] text-white text-[18px] leading-[120%] tracking-[-3%] mb-2.5">
                БОЛЬ В СПИНЕ И ШЕЕ:КАК УЛУЧШИТЬ ОСАНКУ ЕСТЕСТВЕННО.
              </h2>
              <p className="mt-[66px] mb-[28px] hidden md:flex font-bold leading-[120%] w-[650px]">
                С советами по безопасности, которым нужно следовать до и после
                перелома Кристен Гасник
              </p>
              <span className="text-[#3D334A] p-2 rounded-[8px] bg-[#E9DFF6] text-[18px] leading-[90%] uppercase font-[Bowler]">
                Ортопедия
              </span>
            </div>
            {/*  */}
            <div className="absolute md:top-5 top-2 md:right-5 right-2 mr-5 flex flex-col gap-2">
              <CiBookmark
                size={40}
                color="#3D334A"
                className="w-10 h-10 bg-white/30 rounded-[6px] p-2.5 cursor-pointer"
              />
              <RiShareForwardLine
                size={40}
                color="#3D334A"
                className="w-10 h-10 bg-white/30 rounded-[6px] p-2.5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {
          variant == "rehabilitation" && (
            <DesktopNavbar
                menuItems={localizedMenuItems}
                blogBg={false}
                allCourseBg={false}
              />
          )
        }

{
          variant == "categories" && (
            <DesktopNavbar
                menuItems={localizedMenuItems}
                blogBg={false}
                allCourseBg={false}
              />
          )
        }


{
          variant == "complex" && (
            <DesktopNavbar
                menuItems={localizedMenuItems}
                blogBg={false}
                allCourseBg={false}
              />
          )
        }

        

{variant == "category" || variant == "categories" || variant == "rehabilitation" || variant == "category-detail" || variant == "section" && (
              <DesktopNavbar
                menuItems={localizedMenuItems}
                blogBg={false}
                allCourseBg={false}
              />
            )}

            {variant == "default" && (
               <DesktopNavbar
               menuItems={localizedMenuItems}
               blogBg={false}
               allCourseBg={false}
             />
            )}

        {variant !== "blog" && (
          <div className="relative z-10 ">
            <MobileNavbar />
           
            {/* HeroTitle */}
            {variant == "default" && (
              <h2 className="mx-5  hidden md:flex text-[64px] mt-20 leading-[100%]  tracking-[-3%] max-w-[994px]">
                экосистема продуктов направленная на формирование вашего
                здоровья
              </h2>
            )}

            {variant == "rehabilitation" && (
              <div className="flex flex-col gap-0 px-5">
                <h2 className="mx-5  hidden md:flex text-[64px] md:mt-[40px] leading-[100%] tracking-[-3%] max-w-[994px]">
                  СОВРЕМЕННЫЕ ИЗРАИЛЬСКИЕ МЕТОДИКИ РЕАБИЛИТАЦИИ
                </h2>
                {currentSlide === 1 && (
                  <>
                    <motion.p
                      key={currentSlide}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      exit={{ opacity: 0, x: -100 }}
                      className="leading-[120%] hidden md:flex md:px-5 text-[32px] font-medium md:max-w-[592px] md:mt-[92px] font-[Pt] "
                    >
                      Для восстановления и поддержания подвижности и
                      трудоспособности
                    </motion.p>
                    <div className="flex md:hidden flex-col items-end justify-end h-[680px]">
                      <p className="text-[32px] leading-[100%] tracking-[-3%] text-white font-medium">
                        СОВРЕМЕННЫЕ ИЗРАИЛЬСКИЕ МЕТОДИКИ РЕАБИЛИТАЦИИ
                      </p>
                      <span className="font-[Pt] font-medium leading-[100%]">
                        Для восстановления и поддержания подвижности и
                        трудоспособности
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Section */}
            {variant == "default" && (
              <div className={`${currentSlide === 0 ? "mt-[300px]" : ""}`}>
                <AnimatePresence mode="wait">
                  {currentSlide === 1 && (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <>
                        <section className="mt-[50px] md:mt-[29px] mx-2 md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                          {/* პირველი ბარათი */}
                          <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                          >
                            <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                              <Image
                                src={sectionItems[0].image}
                                alt={sectionItems[0].text}
                                width={30}
                                height={30}
                              />
                            </div>
                            <h3 className="text-white text-sm font-medium font-[Pt]">
                              {sectionItems[0].text}
                            </h3>
                          </motion.div>

                          {/* მეორე და მესამე ბარათები */}
                          <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-[Pt]">
                            {sectionItems.slice(1).map((item) => (
                              <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                key={item.id}
                                className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                              >
                                <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                                  <Image
                                    src={item.image}
                                    alt={item.text}
                                    width={30}
                                    height={30}
                                  />
                                </div>
                                <h3 className="text-white text-sm font-medium">
                                  {item.text}
                                </h3>
                              </motion.div>
                            ))}
                          </div>
                        </section>

                        <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                          <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[31px] mt-2">
                            <h2 className="text-[20px] md:text-[40px] leading-[120%] tracking-[-3%]">
                              Реабилитация
                            </h2>
                            <p className="leading-[120%] font-[Pt] font-medium md:max-w-[719px] text-[24px] ">
                              Современные израильские методики реабилитации по
                              направлениям ортопедия, неврология,
                              посттравматическая реабилитация походки и др.
                            </p>
                          </div>
                        </section>
                      </>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {variant == "category-detail" && (
              <div className="mb-5 md:mb-0 mx-auto">
                <section className="mt-[122px] md:mt-[450px] mx-auto md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* პირველი ბარათი */}
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                  >
                    <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                      <Image
                        src={categoryDetailItems[0].image}
                        alt={categoryDetailItems[0].text}
                        width={30}
                        height={30}
                      />
                    </div>
                    <h3 className="text-white text-sm font-medium font-[Pt]">
                      {categoryDetailItems[0].text}
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-[Pt]">
                    {categoryDetailItems.slice(1).map((item) => (
                      <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        key={item.id}
                        className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                      >
                        <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                          <Image
                            src={item.image}
                            alt={item.text}
                            width={30}
                            height={30}
                          />
                        </div>
                        <h3 className="text-white text-sm font-medium">
                          {item.text}
                        </h3>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-[Pt] leading-[120%] tracking-[-3%]">
                      Шейный отдел позвоночника
                    </h2>
                  </div>
                </section>
              </div>
            )}
            {variant == "categories" && (
              <div className="mb-5 md:mb-0 mx-auto md:pt-[400px]">
                <section className="mx-auto md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* პირველი ბარათი */}
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                  >
                    <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                      <Image
                        src={categoryDetailItems[0].image}
                        alt={categoryDetailItems[0].text}
                        width={30}
                        height={30}
                      />
                    </div>
                    <h3 className="text-white text-sm font-medium font-[Pt]">
                      {info?.subcategoriesCount || 0} საბკატეგორია
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-[Pt]">
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                    >
                      <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                        <Image
                          src={categoryDetailItems[1].image}
                          alt={categoryDetailItems[1].text}
                          width={30}
                          height={30}
                        />
                      </div>
                      <h3 className="text-white text-sm font-medium">
                        {info?.setsCount || 0} კომპლექსი
                      </h3>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                    >
                      <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                        <Image
                          src={categoryDetailItems[2].image}
                          alt={categoryDetailItems[2].text}
                          width={30}
                          height={30}
                        />
                      </div>
                      <h3 className="text-white text-sm font-medium">
                        {info?.exercisesCount || 0} სავარჯიშო
                      </h3>
                    </motion.div>
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-[Pt] leading-[120%] tracking-[-3%]">
                      {title}
                    </h2>
                  </div>
                </section>
              </div>
            )}

            {variant == "section" && (
              <div className="mb-5 md:mb-0 mx-auto ">
                <section className="mt-[122px] md:mt-[450px] mx-auto md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* პირველი ბარათი */}
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                  >
                    <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                      <Image
                        src={sectionItems[0].image}
                        alt={sectionItems[0].text}
                        width={30}
                        height={30}
                      />
                    </div>
                    <h3 className="text-white text-sm font-medium font-[Pt] relative z-10">
                      {info?.subcategoriesCount || 0} საბკატეგორია
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-[Pt]">
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                    >
                      <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                        <Image
                          src={sectionItems[1].image}
                          alt={sectionItems[1].text}
                          width={30}
                          height={30}
                        />
                      </div>
                      <h3 className="text-white text-sm font-medium relative z-10">
                        {info?.setsCount || 0} კომპლექსი
                      </h3>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                    >
                      <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                        <Image
                          src={sectionItems[2].image}
                          alt={sectionItems[2].text}
                          width={30}
                          height={30}
                        />
                      </div>
                      <h3 className="text-white text-sm font-medium relative z-10">
                        {info?.exercisesCount || 0} სავარჯიშო
                      </h3>
                    </motion.div>
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-[Pt] leading-[120%] tracking-[-3%]">
                      {title}
                    </h2>
                  </div>
                </section>
              </div>
            )}

            {variant == "complex" && (
              <div className="mb-5 md:mb-0 mx-auto">
                <section className="mt-[122px] md:mt-[250px] mx-auto md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* პირველი ბარათი */}
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                  >
                    <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                      <Image
                        src={complexItems[0].image}
                        alt={complexItems[0].text}
                        width={30}
                        height={30}
                      />
                    </div>
                    <h3 className="text-white text-sm font-medium font-[Pt]">
                      {setData?.totalExercises || 0} упражнений
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-[Pt]">
                    {complexItems.slice(1).map((item) => (
                      <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        key={item.id}
                        className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                      >
                        <div className="bg-[rgba(255,255,255,0.2)] w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                          <Image
                            src={item.image}
                            alt={item.text}
                            width={30}
                            height={30}
                          />
                        </div>
                        <h3 className="text-white text-sm font-medium">
                          {item.id === 2
                            ? `${setData?.totalDuration || "00:00"} мин`
                            : item.text}
                        </h3>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-[Pt] leading-[120%] tracking-[-3%]">
                      {setData?.name?.ru ||
                        setData?.name?.en ||
                        setData?.name?.ka ||
                        "Обще-восстановительный, поддерживающий комплекс"}
                    </h2>
                    <p className="md:mt-[100px] text-[24px] font-medium leading-[120%] font-[Pt]">
                      {setData?.description?.ru ||
                        setData?.description?.en ||
                        setData?.description?.ka ||
                        "Современные израильские методики реабилитации по направлениям ортопедия, неврология, посттравматическая реабилитация походки и др."}
                    </p>
                  </div>
                </section>
              </div>
            )}

            {variant == "default" && (
              <div className="flex md:hidden mt-60 mx-auto items-center justify-center gap-2">
                <Link href={"/about"}>
                  <div className="bg-[#3D334A] p-4 rounded-[20px] w-[176px] h-[166px]">
                    Изучить подробнее
                  </div>
                </Link>
                <div className="bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] bg-cover bg-center p-4 rounded-[20px] w-[176px] h-[166px] ">
                  В каталог
                </div>
              </div>
            )}

            {variant !== "category" &&
              variant !== "category-detail" &&
              variant !== "categories" &&
              variant !== "section" && (
                <header className="header">
                  <div
                    className={`absolute w-full ${
                      variant === "default" ? "mt-[11.7px]" : "top-[286.7px]"
                    } hidden lg:flex ${
                      currentSlide === 0 &&
                      variant == "default" &&
                      " top-[80.9px]"
                    } ${
                      currentSlide === 0 &&
                      variant == "rehabilitation" &&
                      "top-[480px]"
                    } ${
                      currentSlide === 1 &&
                      variant == "rehabilitation" &&
                      " bottom-0 top-[311px]"
                    } ${
                      currentSlide === 0 &&
                      variant == "complex" &&
                      "-mt-[260px]"
                    }`}
                  >
                    <div className="sub-header1"></div>
                    <div className={`sub-header2 `}>
                      <div className="purple-cutout "></div>
                      <div className={`cutout-container `}>
                        <div className="purp1">purpple1</div>
                        <div className={`white-cutout `}>
                          {variant !== "complex" && (
                            <Link href={"/about"}>
                              <div
                                className={`bg-[#3D334A] p-5 -mt-8 hover:scale-105 duration-700`}
                              >
                                <h3 className="text-[24px] ">
                                  Изучить подробнее
                                </h3>
                              </div>
                            </Link>
                          )}
                          {variant == "default" && (
                            <Link href={"/chapter"}>
                              <div className="bg-[url('/assets/images/marketPlace.png')] hover:scale-105 duration-700 bg-cover p-5 -mt-8">
                                <h3 className="text-[24px]">В каталог</h3>
                              </div>
                            </Link>
                          )}
                          {variant == "complex" && (
                            <div
                              className="bg-[url('/assets/images/categoryHeader.png')] hover:scale-105 duration-700 p-5 -mt-8 cursor-pointer"
                              onClick={onPriceClick}
                            >
                              <h3 className="text-[42px] leading-[90%] uppercase">
                                {setData?.price?.monthly || 500} ₽
                              </h3>
                              <span className="text-[18px] md:mb-[99px] md:mt-1.5 leading-[90%] uppercase">
                                В месяц
                              </span>
                              <h2 className="text-[26px] md:mt-[99px] leading-[90%] uppercase">
                                Приобрести
                              </h2>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
              )}

            {variant == "complex" && (
              <div
                className="bg-[#3D334A4D] py-4 px-5 rounded-[20px] text-white absolute max-w-[206px] text-center hidden md:flex 
              font-medium leading-[120%] font-[Pt] right-10 top-[30px]"
              >
                <p>
                  Внимание! На подписки сроком от 3-х месяцев действуют скидки
                </p>
              </div>
            )}

            {/* Desktop Navigation Arrows */}
            {variant !== "category-detail" &&
              variant !== "categories" &&
              variant !== "complex" &&
              variant !== "section" && (
                <div
                  className={`hidden absolute md:flex flex-row items-center right-10 ${
                    variant == "rehabilitation" ? "bottom-14" : "bottom-84"
                  } ${currentSlide === 0 && " bottom-0 top-[157px]"} ${
                    currentSlide === 0 && 
                    variant == "rehabilitation" &&
                    " bottom-0 top-[460px]"
                  } ${
                    currentSlide === 1 &&
                    variant == "rehabilitation" &&
                    " bottom-0 top-[450px]"
                  }  ${
                    currentSlide === 1 &&
                    variant == "rehabilitation" &&
                    " bottom-0 top-[450px]"
                  }   ` }
                >
                  <div
                    onClick={handleLeftArrowClick}
                    className={`w-[70px] h-[70px] hidden ${
                      currentSlide === 0 ? "bg-[#857b9299]" : "bg-[#3D334A99]"
                    } rounded-[20px] md:flex items-center justify-center mr-2.5 cursor-pointer transition-all duration-200 hover:bg-[#3D334Acc] group`}
                  >
                    <Image
                      src={"/assets/images/rightIcon.svg"}
                      alt="rightIcon"
                      width={11}
                      height={9}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                  </div>
                  <div
                    onClick={handleRightArrowClick}
                    className={`w-[70px] h-[70px] hidden group  hover:bg-[#2c243699] ${
                      currentSlide === 0 ? "bg-[#3D334A99]" : "bg-[#857b9299]"
                    } rounded-[20px] md:flex items-center justify-center cursor-pointer`}
                  >
                    {" "}
                    <Image
                      src={"/assets/images/leftIcon.svg"}
                      alt="leftIcon"
                      width={11}
                      height={9}
                      className="transition-transform duration-200 group-hover:scale-110 "
                    />
                  </div>
                </div>
              )}

            {/* Mobile Navigation Arrows */}
            {variant !== "category-detail" &&
              variant !== "categories" &&
              variant !== "complex" &&
              variant !== "section" && (
                <div
                  className={`hidden absolute flex-row items-center right-5 bottom-5 ${
                    variant == "rehabilitation" ? "bottom-14" : "bottom-5"
                  }`}
                >
                  <div
                    onClick={handleLeftArrowClick}
                    className={`w-[50px] h-[50px]  ${
                      currentSlide === 0 ? "bg-[#857b9299]" : "bg-[#3D334A99]"
                    } rounded-[15px] flex items-center justify-center mr-2 cursor-pointer`}
                  >
                    <Image
                      src={"/assets/images/rightIcon.svg"}
                      alt="rightIcon"
                      width={8}
                      height={6}
                    />
                  </div>
                  <div
                    onClick={handleRightArrowClick}
                    className={`w-[50px] h-[50px]  ${
                      currentSlide === 0 ? "bg-[#3D334A99]" : "bg-[#857b9299]"
                    } rounded-[15px] flex items-center justify-center cursor-pointer`}
                  >
                    <Image
                      src={"/assets/images/leftIcon.svg"}
                      alt="leftIcon"
                      width={8}
                      height={6}
                    />
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
