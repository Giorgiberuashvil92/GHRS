"use client";
import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

import { SimpleLogo, ProfessionalTabLogo, RehabilitationTabLogo, BlogTabLogo } from "../Logo";
import { getProfDevNavContext } from "../../utils/professionalDevNav";
import { getNavbarLogoVariant } from "../../utils/navLogo";
import NavbarIconButton from "./NavbarIconButton";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { MenuItem, getDefaultMenuItems } from "../Header/Header";
import BackgroundImage from "./BackgroundImage";
import { useI18n } from "../../context/I18nContext";

const LEGACY_STATIC_MENU_FIRST = "Все комплексы";

interface DesktopNavbarProps {
  menuItems: MenuItem[];
  blogBg: boolean;
  allCourseBg: boolean;
  data?: {
    featuredImages?: string[];
  };
  complexData?: any;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  menuItems,
  blogBg,
  allCourseBg,
  data,
  complexData,
}) => {
  const { isAuthenticated } = useAuth();
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const localizedMenu = useMemo(() => getDefaultMenuItems(t), [t, locale]);
  const profNav = useMemo(() => getProfDevNavContext(pathname), [pathname]);
  const logoVariant = useMemo(() => getNavbarLogoVariant(pathname), [pathname]);
  const effectiveMenuItems = useMemo(() => {
    const legacy =
      menuItems?.length === 4 && menuItems[0]?.name === LEGACY_STATIC_MENU_FIRST;
    return legacy ? localizedMenu : menuItems;
  }, [menuItems, localizedMenu]);

  const getBackgroundStyle = () => {
    if (pathname.startsWith("/singleCourse/")) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center min-h-[70px]";
    }

    if (pathname.startsWith("/teachers/")) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center min-h-[70px]";
    }

    if (pathname.startsWith("/allCourse/")) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center min-h-[70px]";
    }

    if (pathname.startsWith("/article/")) {
      return "bg-[url('/assets/images/header22.png')] bg-cover bg-center min-h-[70px]";
    }

    if (
      pathname === "/shoppingcard" ||
      pathname === "/contact" ||
      pathname.startsWith("/player") ||
      pathname === "/personalAccount" ||
      pathname.startsWith("/personalAccount/")
    ) {
      return "bg-[url('/assets/images/header55.png')] bg-cover bg-center min-h-[70px]";
    }

    switch (pathname) {
      case "/allCourse":
        return "bg-[url('/assets/images/header44.png')] bg-cover bg-center min-h-[70px]";
      case "/professional":
      case "/teachers":
        return "bg-[url('/assets/images/header44.png')] bg-cover bg-center min-h-[70px]";
      case "/blog":
        return "bg-[url('/assets/images/header22.png')] bg-cover bg-center min-h-[70px]";
      default:
        return "bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] min-h-[70px]";
    }
  };

  const handleProtectedRouteClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(route);
    }
  };

  const profSubBase =
    "inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 rounded-full text-[13px] sm:text-[14px] font-bowler uppercase tracking-[0.06em] leading-none transition-all duration-200 border";
  const profSubIdle =
    "text-white/88 border-white/15 bg-white/[0.07] hover:text-gray-950 duration-700";
  const profSubActive =
    "text-white border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]";

  const isProfLandingActive =
    pathname === "/professional" || pathname.startsWith("/professional/");
  const isAllCoursesActive =
    pathname === "/allCourse" || pathname.startsWith("/allCourse/");
  const isAllInstructorsActive =
    pathname === "/teachers" || pathname.startsWith("/teachers/");
  const isParentActive =
    Boolean(profNav.parent?.href && pathname === profNav.parent.href);

  return (
    <header className="sticky font-bowler top-0 left-0 right-0 z-50 w-full md:flex hidden justify-between px-10 py-5 transition-all duration-300">
      <div
        className={`w-[780px] flex flex-col rounded-[24px] border border-white/10 relative overflow-hidden ${getBackgroundStyle()}`}
      >
        <div className="flex p-3.5 items-center w-full min-h-0">
        {!pathname.startsWith("/article/") && <BackgroundImage imageUrl={data?.featuredImages?.[0]} />}
        <Link href="/" className="hover:brightness-0 duration-700 shrink-0 relative z-10" aria-label="Navigate to homepage">
          {logoVariant === "professional" ? (
            <ProfessionalTabLogo />
          ) : logoVariant === "rehabilitation" ? (
            <RehabilitationTabLogo />
          ) : logoVariant === "blog" ? (
            <BlogTabLogo />
          ) : (
            <SimpleLogo />
          )}
        </Link>
        <ul
          className={`flex ${
            logoVariant === "professional"
              ? "ml-6"
              : logoVariant === "rehabilitation" || logoVariant === "blog"
                ? "ml-10"
                : "ml-[89px]"
          } mr-[73px] justify-between w-full min-w-0`}
        >
          {effectiveMenuItems.map(({ id, name, route }) => (
            <Link key={id} href={route}>
              <li className="text-white font-bold text-[18px] hover:text-gray-950 duration-700 leading-[100%] tracking-[-1%]">
                {name}
              </li>
            </Link>
          ))}
        </ul>
        </div>
        {profNav.show ? (
          <nav
            className="flex flex-wrap items-center justify-center gap-2 px-3.5 pb-3 pt-1.5 mx-3 mb-1.5 rounded-[18px] bg-black/[0.18] backdrop-blur-[6px] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            aria-label={t("navigation.prof_dev_tab_landing")}
          >
            <Link
              href={profNav.profLandingHref}
              className={`${profSubBase} ${isProfLandingActive ? profSubActive : profSubIdle}`}
            >
              {t("navigation.prof_dev_tab_landing")}
            </Link>
            <span
              className="hidden sm:block h-3 w-px shrink-0 bg-gradient-to-b from-transparent via-white/35 to-transparent"
              aria-hidden
            />
            <Link
              href={profNav.allCoursesHref}
              className={`${profSubBase} ${isAllCoursesActive ? profSubActive : profSubIdle}`}
            >
              {t("navigation.prof_dev_tab_courses")}
            </Link>
            <span
              className="hidden sm:block h-3 w-px shrink-0 bg-gradient-to-b from-transparent via-white/35 to-transparent"
              aria-hidden
            />
            <Link
              href={profNav.allInstructorsHref}
              className={`${profSubBase} ${isAllInstructorsActive ? profSubActive : profSubIdle}`}
            >
              {t("navigation.prof_dev_tab_instructors")}
            </Link>
            {profNav.parent ? (
              <>
                <span
                  className="hidden sm:block h-3 w-px shrink-0 bg-gradient-to-b from-transparent via-white/35 to-transparent"
                  aria-hidden
                />
                <Link
                  href={profNav.parent.href}
                  className={`${profSubBase} ${isParentActive ? profSubActive : profSubIdle}`}
                >
                  {t(profNav.parent.labelKey)}
                </Link>
              </>
            ) : null}
          </nav>
        ) : null}
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="hover:scale-105 duration-300">
          <LanguageSelector />
        </div>
        <div onClick={(e) => handleProtectedRouteClick(e, "/shoppingcard")}>
          <NavbarIconButton
            className="hover:scale-105 duration-300 cursor-pointer"
            src="/assets/images/store.svg"
            alt="Store"
          />
        </div>
        <div onClick={(e) => handleProtectedRouteClick(e, "/personalAccount")}>
          <NavbarIconButton
            className="hover:scale-105 duration-300 cursor-pointer"
            src={"/assets/images/person.svg"}
            alt="Person"
          />
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
