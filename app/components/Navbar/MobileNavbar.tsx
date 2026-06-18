"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileLogo, ProfessionalTabLogo, RehabilitationTabLogo, BlogTabLogo } from "../Logo";
import NavbarIconButton from "./NavbarIconButton";
import { getDefaultMenuItems } from "../Header/Header";
import Link from "next/link";
import { useI18n } from "../../context/I18nContext";
import { getProfDevNavContext } from "../../utils/professionalDevNav";
import { getNavbarLogoVariant } from "../../utils/navLogo";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  const profNav = getProfDevNavContext(pathname);
  const logoVariant = getNavbarLogoVariant(pathname);
  const menuItems = getDefaultMenuItems(t);

  const isProfLandingActive =
    pathname === "/professional" || pathname.startsWith("/professional/");
  const isAllCoursesActive =
    pathname === "/allCourse" || pathname.startsWith("/allCourse/");
  const isAllInstructorsActive =
    pathname === "/teachers" || pathname.startsWith("/teachers/");
  const isParentActive =
    Boolean(profNav.parent?.href && pathname === profNav.parent.href);

  const getBackgroundStyle = () => {
    if (pathname.startsWith('/singleCourse/')) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center";
    }

    if (pathname.startsWith('/teachers/')) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center";
    }

    if (pathname.startsWith('/allCourse/')) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center";
    }

    if (pathname.startsWith('/article/')) {
      return "bg-[url('/assets/images/header22.png')] bg-cover bg-center";
    }

    if (pathname === '/shoppingcard' ||
        pathname === '/contact' ||
        pathname.startsWith('/player') ||
        pathname === '/personalAccount' ||
        pathname.startsWith('/personalAccount/')) {
      return "bg-[url('/assets/images/header55.png')] bg-cover bg-center";
    }

    switch (pathname) {
      case '/allCourse':
        return "bg-[url('/assets/images/header44.png')] bg-cover bg-center";
      case '/professional':
      case '/teachers':
        return "bg-[url('/assets/images/header44.png')] bg-cover bg-center";
      case '/blog':
        return "bg-[url('/assets/images/header22.png')] bg-cover bg-center";
      default:
        return "bg-gradient-to-br from-[rgba(94,43,143,0.5)] to-[rgba(61,51,74,0.4)]";
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="py-2 md:hidden z-[9999999999] max-w-[700px]">
      <div className=" top-0 left-0 right-0 z-[9999999999] px-6 py-6 md:hidden w-full mx-auto">
        <div className={`px-4 py-3 flex justify-between items-center rounded-2xl ${getBackgroundStyle()} backdrop-blur-lg shadow-xl border border-white/10`}>
          <div onClick={toggleMenu}>
            <NavbarIconButton src={"/assets/images/burger.svg"} alt="Burger" />
          </div>
          <Link href={"/"}>
            {logoVariant === "professional" ? (
              <ProfessionalTabLogo mobile />
            ) : logoVariant === "rehabilitation" ? (
              <RehabilitationTabLogo mobile />
            ) : logoVariant === "blog" ? (
              <BlogTabLogo mobile />
            ) : (
              <MobileLogo />
            )}
          </Link>
          <NavbarIconButton src="/assets/images/store.svg" alt="Store" />
        </div>
      </div>

      <div className="max-w-[313px] flex mt-2 md:hidden gap-2 mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-200 h-[4px] w-[72.25px] rounded-full ${
              i === 0
                ? "bg-white"
                : "bg-white/30 hover:bg-white/60 cursor-pointer"
            }`}
          />
        ))}
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed top-30 left-2 w-[90%] mx-auto flex flex-col gap-2 px-4 py-4 bg-gradient-to-br from-[rgba(94,43,143,0.6)] to-[rgba(61,51,74,0.5)] rounded-2xl shadow-lg backdrop-blur-lg border border-white/10">
          {profNav.show ? (
            <div className="rounded-xl bg-black/20 border border-white/10 p-2 mb-1 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex flex-col gap-1">
                <Link href={profNav.profLandingHref} onClick={() => setIsMenuOpen(false)}>
                  <span
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-bowler uppercase tracking-wide transition-colors ${
                      isProfLandingActive
                        ? "bg-white/20 text-white border border-white/25"
                        : "text-white/90 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {t("navigation.prof_dev_tab_landing")}
                  </span>
                </Link>
                <Link href={profNav.allCoursesHref} onClick={() => setIsMenuOpen(false)}>
                  <span
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-bowler uppercase tracking-wide transition-colors ${
                      isAllCoursesActive
                        ? "bg-white/20 text-white border border-white/25"
                        : "text-white/90 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {t("navigation.prof_dev_tab_courses")}
                  </span>
                </Link>
                <Link href={profNav.allInstructorsHref} onClick={() => setIsMenuOpen(false)}>
                  <span
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-bowler uppercase tracking-wide transition-colors ${
                      isAllInstructorsActive
                        ? "bg-white/20 text-white border border-white/25"
                        : "text-white/90 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {t("navigation.prof_dev_tab_instructors")}
                  </span>
                </Link>
                {profNav.parent ? (
                  <Link href={profNav.parent.href} onClick={() => setIsMenuOpen(false)}>
                    <span
                      className={`block w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-bowler uppercase tracking-wide transition-colors ${
                        isParentActive
                          ? "bg-white/20 text-white border border-white/25"
                          : "text-white/90 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      {t(profNav.parent.labelKey)}
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
          {menuItems.map((item, index) => (
            <Link href={item.route} key={index}>
              <button
                className="text-white text-[17px] text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-150"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {item.name}
              </button>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default MobileNavbar;
