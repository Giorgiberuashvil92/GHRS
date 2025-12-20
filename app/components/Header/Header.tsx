"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CiBookmark } from "react-icons/ci";
import { RiShareForwardLine } from "react-icons/ri";

import Image from "next/image";
import MobileNavbar from "../Navbar/MobileNavbar";
import DesktopNavbar from "../Navbar/DesktopNavbar";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import useStatistics from "@/app/hooks/useStatistics";

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
    | "professional"
    | "complex"
    | "category"
    | "blog"
    | "categories"
    | "category-detail"
    | "section"
    | "allComplex"
    | "about";
  title?: string;
  info?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onPriceClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData?: any; // set-ის მონაცემები complex variant-ისთვის
  statistics?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  description?: string;
}

// Function to get localized menu items
export const getDefaultMenuItems = (t: (key: string) => string): MenuItem[] => [
  { id: 1, name: t("navigation.all_complexes"), route: "/allComplex" },
  { id: 2, name: t("navigation.about"), route: "/about" },
  { id: 3, name: t("navigation.blog"), route: "/blog" },
  { id: 4, name: t("navigation.contacts"), route: "/contact" },
];

// Deprecated: Use getDefaultMenuItems(t) instead
export const defaultMenuItems: MenuItem[] = [
  { id: 1, name: "Все комплексы", route: "/allComplex" },
  { id: 2, name: "О нас", route: "/about" },
  { id: 3, name: "Блог", route: "/blog" },
  { id: 4, name: "Контакты", route: "/contact" },
];

const Header: React.FC<HeaderProps> = ({
  variant = "default",
  title,
  info,
  onPriceClick,
  description,
  setData,
}) => {
  console.log(description, 'მიღებული დატა');
  console.log('🎯 Header info data:', info);

  // Use locale from i18n context instead of reading from localStorage
  const { t, locale } = useI18n();
  const [currentSlide, setCurrentSlide] = useState<0 | 1>(0);

  interface PriceObject {
    monthly: number;
    threeMonths: number;
    sixMonths: number;
    yearly: number;
  }

  const getLocalizedPrice = (
    fallbackMonthly: number,
    priceEn?: PriceObject | null,
    priceKa?: PriceObject | null,
    discountedEn?: PriceObject | null,
    discountedKa?: PriceObject | null,
    currentLocale: string = "ru"
  ): number => {
    if (currentLocale === "en") {
      if (discountedEn && typeof discountedEn.monthly === "number")
        return discountedEn.monthly;
      if (priceEn && typeof priceEn.monthly === "number")
        return priceEn.monthly;
      return fallbackMonthly;
    }
    if (currentLocale === "ka") {
      if (discountedKa && typeof discountedKa.monthly === "number")
        return discountedKa.monthly;
      if (priceKa && typeof priceKa.monthly === "number")
        return priceKa.monthly;
      return fallbackMonthly;
    }
    return fallbackMonthly;
  };

  const getLocalizedText = (
    field: { ka: string; en: string; ru: string } | undefined,
    currentLocale: string = "ru"
  ): string => {
    if (!field) return "";
    return (
      field[currentLocale as keyof typeof field] ||
      field.ru ||
      field.en ||
      field.ka ||
      ""
    );
  };
  const { statistics } = useStatistics();

  const categoryDetailItems = [
    {
      id: 1,
      text: t("header.categories_count"),
      image: "/assets/icons/pulse.svg",
    },
    {
      id: 2,
      text: t("header.online_chat"),
      image: "/assets/images/camera.svg",
    },
    {
      id: 3,
      text: t("header.lessons_count"),
      image: "/assets/icons/watch.png",
    },
  ];

  const complexItems = [
    {
      id: 1,
      text: t("header.categories_count"),
      image: "/assets/icons/card.svg",
      route: "/blogs",
    },
    {
      id: 2,
      text: t("header.complexes_count"),
      image: "/assets/icons/message.svg",
      route: "/blogs",
    },
    {
      id: 3,
      text: t("header.lessons_count"),
      image: "/assets/icons/heat.svg",
      route: "/blogs",
    },
  ];

  // ლოკალიზებული მენიუ items
  const localizedMenuItems = [
    { id: 1, name: t("navigation.all_complexes"), route: "allComplex" },
    { id: 2, name: t("navigation.about"), route: "about" },
    { id: 3, name: t("navigation.blog"), route: "blog" },
    { id: 4, name: t("navigation.contacts"), route: "/contact" },
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

  const homePageHeaderItems = [
    {
      id: 1,
      text: statistics
        ? t("header.sets_count", { count: String(statistics.total.sets) })
        : t("header.loading"),
      image: "/assets/images/book.svg",
      route: "/categories",
    },
    {
      id: 2,
      text: statistics
        ? t("header.exercises_count", {
            count: String(statistics.total.exercises),
          })
        : t("header.loading"),
      image: "/assets/icons/message.svg",
    },
    {
      id: 3,
      text: statistics
        ? t("header.hours_count", { count: String(statistics.total.hours) })
        : t("header.loading"),
      image: "/assets/icons/video.svg",
    },
  ];

  const sectionItems = [
    {
      id: 1,
      text: statistics
        ? t("header.sets_count", { count: String(statistics.total.sets) })
        : t("header.loading"),
      image: "/assets/icons/pulse.svg",
    },
    {
      id: 2,
      text: statistics
        ? t("header.exercises_count", {
            count: String(statistics.total.exercises),
          })
        : t("header.loading"),
      image: "/assets/images/camera.svg",
    },
    {
      id: 3,
      text: statistics
        ? t("header.hours_count", { count: String(statistics.total.hours) })
        : t("header.loading"),
      image: "/assets/icons/watch.png",
    },
  ];

  // const singleComplexHeaderItems = [
  //   {
  //     id: 1,
  //     text: statistics ? `${statistics.total.sets} комплексов` : "Loading...",
  //     image: "/assets/icons/pulse.svg",
  //   },
  //   {
  //     id: 2,
  //     text: statistics
  //       ? `${statistics.total.exercises} упражнений`
  //       : "Loading...",
  //     image: "/assets/images/camera.svg",
  //   },
  //   {
  //     id: 3,
  //     text: statistics ? `${statistics.total.hours} часов` : "Loading...",
  //     image: "/assets/icons/watch.png",
  //   },
  // ];

  return (
    <header
      className={`md:m-5 rounded-[20px] ${
        variant == "rehabilitation" && "h-[438px]"
      } ${variant == "rehabilitation" && "h-[438px]"} ${
        variant == "default" && "h-[838px]"
      } ${variant == "blog" && "h-[218px] md:h-[518px]"} ${
        variant == "category-detail" && "h-[338px]"
      } ${variant == "section" && "h-[838px]"} 
        } `}
    >
      <div className="relative w-full rounded-[20px]">
        {variant !== "blog" && variant !== "category-detail" && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="video-bg absolute h-full object-cover z-[-1] md:rounded-[20px]"
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
          <div className="rounded-[20px] px-5 font-pt">
            <Image
              width={1120}
              height={518}
              src={info?.image || "/assets/images/blogbg.jpg"}
              alt="blogBg"
              className="md:h-[518px] md:w-full h-[217px] w-[359px] bg-cover bg-center rounded-[20px] relative"
            />
            <div className="pt-[27px] md:pl-[32px] pl-4 pr-[20px] md:pb-[20px] pb-3 md:bg-[#3D334A4D] md:backdrop-blur-sm absolute bottom-0 md:bottom-5 md:ml-5 rounded-[20px] font-pt">
              <h2 className="hidden md:flex text-white text-[40px] leading-[120%] tracking-[-3%] md:w-[945px] w-[327px] font-bowler" style={{ wordSpacing: 'normal', hyphens: 'none' }}>
                {info?.title || t("blog.default_title")}
              </h2>
              <h2 className="flex md:hidden font-bowler text-white text-[18px] leading-[120%] tracking-[-3%] mb-2.5" style={{ wordSpacing: 'normal', hyphens: 'none' }}>
                {info?.title || t("blog.default_mobile_title")}
              </h2>
              <p className="mt-[66px] mb-[28px] hidden md:flex font-bold leading-[120%] w-[650px] font-pt">
                {info?.excerpt || t("blog.default_description")}
              </p>
              <span className="text-[#3D334A] p-2 rounded-[8px] bg-[#E9DFF6] text-[18px] leading-[90%] uppercase font-bowler">
                {info?.category || t("common.orthopedics")}
              </span>
            </div>
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

        {variant == "rehabilitation" && (
          <DesktopNavbar
            menuItems={localizedMenuItems}
            blogBg={false}
            allCourseBg={false}
          />
        )}

        {variant == "categories" && (
          <DesktopNavbar
            menuItems={localizedMenuItems}
            blogBg={false}
            allCourseBg={false}
          />
        )}

        {variant == "complex" && (
          <DesktopNavbar
            menuItems={localizedMenuItems}
            blogBg={false}
            allCourseBg={false}
          />
        )}

        {variant == "professional" && (
          <DesktopNavbar
            menuItems={localizedMenuItems}
            blogBg={false}
            allCourseBg={false}
          />
        )}

        {variant == "about" && (
          <DesktopNavbar
            menuItems={localizedMenuItems}
            blogBg={false}
            allCourseBg={false}
          />
        )}

        {variant == "category" ||
          variant == "categories" ||
          variant == "rehabilitation" ||
          variant == "category-detail" ||
          (variant == "section" && (
            <DesktopNavbar
              menuItems={localizedMenuItems}
              blogBg={false}
              allCourseBg={false}
            />
          ))}

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
              <h2 className="mx-5  hidden md:flex text-[64px] mt-20 leading-[100%]  tracking-[-3%] max-w-[994px] font-bowler">
                {t("header.ecosystem_title")}
              </h2>
            )}

            {variant == "categories" && (
              <div className="flex flex-col gap-0 px-5">
                <h2 className="mx-5 text-white hidden md:flex text-[64px] md:mt-[40px] leading-[100%] tracking-[-3%] max-w-[994px] font-bowler uppercase">
                  {title || t("header.category_title")}
                </h2>
                <motion.p
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="leading-[120%] hidden md:flex md:px-5 text-[20px] font-medium md:mt-[20px] md:max-w-[592px] font-pt text-white"
                >
                  {description || t("header.category_description")}
                </motion.p>
              </div>
            )}

            {variant == "rehabilitation" && (
              <div className="flex flex-col gap-0 px-5">
                <h2 className="mx-5 text-[#3D334A]   hidden md:flex text-[64px] md:mt-[40px] leading-[100%] tracking-[-3%] max-w-[994px] font-bowler">
                  {t("header.rehabilitation_title")}
                </h2>
                {currentSlide === 1 && (
                  <>
                    <motion.p
                      key={currentSlide}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      exit={{ opacity: 0, x: -100 }}
                      className="leading-[120%] hidden md:flex md:px-5 text-[32px] font-medium  md:mt-[92px] md:max-w-[592px] font-pt"
                    >
                      {t("header.rehabilitation_subtitle")}
                    </motion.p>
                    <div className="flex md:hidden flex-col items-end justify-end h-[680px]">
                      <p className="text-[32px] leading-[100%] tracking-[-3%] text-white font-medium font-bowler">
                        {t("header.rehabilitation_title")}
                      </p>
                      <span className="font-medium leading-[100%] font-pt">
                        {t("header.rehabilitation_subtitle")}
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
                        <section className="mt-[50px] md:mt-[30px] mx-2 md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                          {/* პირველი ბარათი */}
                          <Link
                            href={"/categories"}
                            className="z-50 hover:bg-[rgba(51,47,47,0.2)] cursor-pointer rounded-[12px]"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -100 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="flex items-center gap-2.5 bg-[rgba(61,51,74,0.3)] px-2.5 rounded-[12px] h-[64px] w-full md:w-[246px]"
                            >
                              <div className="bg-[rgba(255,255,255,0.2)]  cursor-pointer w-[46px] h-[46px] justify-center items-center flex rounded-[8px]">
                                <Image
                                  src={homePageHeaderItems[0].image}
                                  alt={homePageHeaderItems[0].text}
                                  width={30}
                                  height={30}
                                />
                              </div>

                              <h3 className="text-white text-sm font-medium font-pt">
                                {homePageHeaderItems[0].text}
                              </h3>
                            </motion.div>
                          </Link>

                          {/* მეორე და მესამე ბარათები */}
                          <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full">
                            {homePageHeaderItems.slice(1).map((item) => (
                              <Link
                                key={item.id}
                                href={"/categories"}
                                className="z-50 hover:bg-[rgba(51,47,47,0.2)] cursor-pointer rounded-[12px]"
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -100 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.6,
                                    ease: "easeOut",
                                  }}
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
                                  <h3 className="text-white text-sm font-medium font-pt">
                                    {item.text}
                                  </h3>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </section>

                        <section className="mx-2 md:mt-5 md:mx-5 max-w-[750px]">
                          <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[31px] mt-2">
                            <h2 className="text-[20px] md:text-[40px] leading-[120%] tracking-[-3%] font-bowler">
                              {t("header.rehabilitation")}
                            </h2>
                            <p className="leading-[120%] font-medium md:max-w-[719px] text-[24px] font-pt">
                              {t("header.rehabilitation_description")}
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
                    <h3 className="text-white text-sm font-medium font-pt">
                      {categoryDetailItems[0].text}
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-pt">
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
                    <h2 className="text-[20px] md:text-[40px] font-bowler leading-[120%] tracking-[-3%]">
                      {t("header.neck_spine")}
                    </h2>
                  </div>
                </section>
              </div>
            )}
            {variant == "categories" && (
              <div className="mb-5 md:mb-0 mx-auto md:pt-[100px]">
                <section className="mx-auto md:mx-5 flex flex-col md:flex-row md:items-center md:gap-2">
                  {/* პირველი ბარათი - მხოლოდ თუ subcategoriesCount > 0 */}
                  {info?.subcategoriesCount > 0 && (
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
                      <h3 className="text-white text-sm font-medium font-pt">
                        {t("header.subcategories_count", {
                          count: info?.subcategoriesCount || 0,
                        })}
                      </h3>
                    </motion.div>
                  )}

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-pt">
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
                        {t("header.sets_count", {
                          count: info?.setsCount || 0,
                        })}
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
                        {t("header.exercises_count", {
                          count: info?.exercisesCount || 0,
                        })}
                      </h3>
                    </motion.div>
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)] rounded-[20px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] leading-[120%] tracking-[-3%] font-bowler text-white">
                      {title || t("header.category_title")}
                    </h2>
                    <p className="font-pt text-white max-w-[600px]">
                      {description || t("header.category_description")}
                    </p>
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
                    <h3 className="text-white text-sm font-medium font-pt relative z-10">
                      {t("header.subcategories_count", {
                        count: info?.subcategoriesCount || 0,
                      })}
                    </h3>
                  </motion.div>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-pt">
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
                        {t("header.sets_count", {
                          count: info?.setsCount || 0,
                        })}
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
                        {t("header.exercises_count", {
                          count: info?.exercisesCount || 0,
                        })}
                      </h3>
                    </motion.div>
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[73.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-bowler leading-[120%] tracking-[-3%]">
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
                  <Link
                    href={"/categories"}
                    className="z-50 hover:bg-[rgba(51,47,47,0.2)] cursor-pointer rounded-[12px]"
                  >
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
                      <h3 className="text-white text-sm font-medium font-pt">
                        {t("header.exercises_count", {
                          count: setData?.totalExercises || 0,
                        })}
                      </h3>
                    </motion.div>
                  </Link>

                  {/* მეორე და მესამე ბარათები */}
                  <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full font-pt">
                    {complexItems.slice(1).map((item) => (
                      <Link
                        key={item.id}
                        href={"/categories"}
                        className="z-50 hover:bg-[rgba(51,47,47,0.2)] cursor-pointer rounded-[12px]"
                      >
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
                              ? t("header.duration_minutes", {
                                  duration: setData?.totalDuration || "00:00",
                                })
                              : item.text}
                          </h3>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[11.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[32px] mt-2">
                    <h2
                      className={`text-[20px] md:text-[${
                        locale === "ru" ? "32" : locale === "en" ? "38" : "36"
                      }px] leading-[120%] tracking-[-3%]`}
                    >
                      {getLocalizedText(setData?.name, locale)}
                    </h2>
                    <p className="md:mt-[10px] text-[24px] leading-[120%] font-pt break-words line-clamp-3 font-bold mt-20">
                      {t("header.rehabilitation_description")}
                    </p>
                  </div>
                </section>
              </div>
            )}

            {variant == "professional" && (
              <div className="mb-5 md:mb-0 mx-auto md:mt-[385px]">
                <section className="mx-2 md:mt-5 md:mx-5 max-w-[729px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[11.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-bowler max-w-[598px] leading-[120%] tracking-[-3%]">
                      {getLocalizedText(setData?.name, locale)}
                    </h2>
                    <p className="md:mt-[10px] text-[24px] max-w-[719px] font-medium leading-[120%] font-pt break-words line-clamp-3">
                      {getLocalizedText(setData?.description, locale)}
                    </p>
                  </div>
                </section>
              </div>
            )}

            {variant == "about" && (
              <div className="mb-5 md:mb-0 mx-auto md:mt-[375px]">
                <section className="mx-2 md:mt-5 md:mx-5 max-w-[837px]">
                  <div className="bg-[rgba(61,51,74,0.3)]  rounded-[20px] md:gap-[11.2px] gap-5 flex flex-col pl-[30px] pt-[30px] pb-[90px] mt-2">
                    <h2 className="text-[20px] md:text-[40px] font-bowler max-w-[598px] leading-[120%] tracking-[-3%]">
                      {getLocalizedText(setData?.name, locale)}
                    </h2>
                    <p className="md:mt-[10px] text-[18px] max-w-[779px] font-medium leading-[120%] font-pt ">
                      {getLocalizedText(setData?.description, locale)}
                    </p>
                  </div>
                </section>
              </div>
            )}

            {variant == "default" && (
              <div className="flex md:hidden mt-60 mx-auto items-center justify-center gap-2">
                <Link href={"/rehabilitation"}>
                  <div className="bg-[#3D334A] p-4 rounded-[20px] w-[176px] h-[166px] font-bowler">
                    {t("header.learn_more")}
                  </div>
                </Link>
                <div className="bg-[url('/assets/images/categorySliderBgs/bg4.jpg')] bg-cover bg-center p-4 rounded-[20px] w-[176px] h-[166px] font-bowler">
                  {t("header.to_catalog")}
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
                    } ${
                      currentSlide === 0 &&
                      variant == "professional" &&
                      "mt-[-260px]"
                    } `}
                  >
                    {variant !== "about" && (
                      <>
                        <div className="sub-header1"></div>
                        <div className={`sub-header2 `}>
                          <div className="purple-cutout "></div>
                          <div className={`cutout-container `}>
                            {/* <div className="purp1">purpple1</div> */}
                            <div className={`white-cutout `}>
                              {variant === "professional" && (
                                <Link href={"/professional"}>
                                  <div
                                    className={`bg-[#3D334A] p-5 -mt-8 hover:scale-105 duration-700`}
                                  >
                                    <h3 className="text-[24px] font-bowler">
                                      {t("header.learn_more")}
                                    </h3>
                                  </div>
                                </Link>
                              )}

                              {variant !== "complex" &&
                                variant !== "professional" && (
                                  <Link href={"/rehabilitation"}>
                                    <div
                                      className={`bg-[#3D334A] p-5 -mt-8 hover:scale-105 duration-700`}
                                    >
                                      <h3 className="text-[24px] font-bowler">
                                        {t("header.learn_more")}
                                      </h3>
                                    </div>
                                  </Link>
                                )}

                              {variant == "default" && (
                                <Link href={"/chapter"}>
                                  <div className="bg-[url('/assets/images/marketPlace.png')] hover:scale-105 duration-700 bg-cover bg-center p-5 -mt-8">
                                    <h3 className="text-[24px] font-bowler">В каталог</h3>
                                  </div>
                                </Link>
                              )}
                              {variant == "complex" && (
                                <div
                                  className="bg-[url('/assets/images/categoryHeader.png')] hover:scale-105 duration-700 p-5 -mt-8 cursor-pointer"
                                  onClick={onPriceClick}
                                >
                                  <h3 className="text-[42px] leading-[90%] uppercase font-bowler">
                                    {getLocalizedPrice(
                                      setData?.price?.monthly || 500,
                                      setData?.priceEn || null,
                                      setData?.priceKa || null,
                                      setData?.discountedPriceEn || null,
                                      setData?.discountedPriceKa || null,
                                      locale
                                    )}
                                    {t("header.currency")}
                                  </h3>
                                  <span className="text-[18px] md:mb-[99px] md:mt-1.5 leading-[90%] uppercase">
                                    {t("header.per_month")}
                                  </span>
                                  <h2 className="text-[26px] md:mt-[99px] leading-[90%] uppercase font-bowler">
                                    {t("header.purchase")}
                                  </h2>
                                </div>
                              )}

                              {variant == "professional" && (
                                <div className="bg-[#3D334A] bg-center bg-cover hover:scale-105 duration-700 p-5 -mt-8 cursor-pointer">
                                  <span className="text-[18px] md:mb-[99px] md:mt-1.5 leading-[90%] uppercase">
                                    {t("header.our_courses")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </header>
              )}

            {variant == "complex" && (
              <div
                className="bg-[#3D334A4D] py-4 px-5 rounded-[20px] text-white absolute max-w-[206px] text-center hidden md:flex 
              font-medium leading-[120%] font-pt right-10 top-[0px]"
              >
                <p>{t("header.subscription_discount_notice")}</p>
              </div>
            )}

            {/* Desktop Navigation Arrows */}
            {variant !== "category-detail" &&
              variant !== "about" &&
              variant !== "categories" &&
              variant !== "complex" &&
              variant !== "professional" &&
              variant !== "section" && (
                <div
                  className={`hidden absolute md:flex flex-row items-center right-10 ${
                    variant == "rehabilitation" ? "bottom-14" : "bottom-80"
                  } ${currentSlide === 0 && " bottom-0 top-[282px]"} ${
                    currentSlide === 0 &&
                    variant == "rehabilitation" &&
                    " bottom-0 top-[360px]"
                  } ${
                    currentSlide === 1 &&
                    variant == "rehabilitation" &&
                    " bottom-0 top-[360px]"
                  }  `}
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
              variant !== "professional" &&
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
