"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

import { SimpleLogo } from "../Logo";
import NavbarIconButton from "./NavbarIconButton";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { MenuItem } from "../Header/Header";
import BackgroundImage from "./BackgroundImage";
import { useI18n, useLanguage } from "../../context/I18nContext"; // 👈 დაამატე ეს

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
  const { language } = useLanguage(); // 👈 მოვიტანეთ ენა კონტექსტიდან
  const router = useRouter();
  const pathname = usePathname();

  const getBackgroundStyle = () => {
    if (pathname.startsWith("/singleCourse/")) {
      return "bg-[url('/assets/images/header44.png')] bg-cover bg-center h-[70px]";
    }

    // Article pages should have static background
    if (pathname.startsWith("/article/")) {
      return "bg-[url('/assets/images/header22.png')] bg-cover bg-center h-[70px]";
    }

    if (
      pathname === "/shoppingcard" ||
      pathname === "/contact" ||
      pathname.startsWith("/player") ||
      pathname === "/personalAccount" ||
      pathname.startsWith("/personalAccount/")
    ) {
      return "bg-[url('/assets/images/header55.png')] bg-cover bg-center h-[70px]";
    }

    switch (pathname) {
      case "/allCourse":
        return "bg-[url('/assets/images/header44.png')] bg-cover bg-center h-[70px]";
      case "/blog":
        return "bg-[url('/assets/images/header22.png')] bg-cover bg-center h-[70px]";
      case "/allComplex":
        return "bg-[url('/assets/images/header33.png')] bg-cover bg-center h-[70px]";
      default:
        return "bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] h-[70px]";
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

  // console.log("Current Language:", language);

  return (
    <header className="fixed font-bowler top-0 left-0 right-0 z-50 my-4 w-full md:flex hidden justify-between px-10 py-5">
      <div
        className={`w-[780px] flex p-3.5 items-center rounded-[24px] ${getBackgroundStyle()} border border-white/10 relative`}
      >
        {!pathname.startsWith("/article/") && <BackgroundImage imageUrl={data?.featuredImages?.[0]} />}
        <Link href="/" className="hover:brightness-0 duration-700">
          <SimpleLogo />
        </Link>
        <ul className="flex ml-[89px] mr-[73px] justify-between w-full">
          {menuItems.map(({ id, name, route }) => (
            <Link key={id} href={route}>
              <li className="text-white font-bold text-[18px] hover:text-gray-950 duration-700 leading-[100%] tracking-[-1%]">
                {name}
              </li>
            </Link>
          ))}
        </ul>
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
