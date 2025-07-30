"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

import { SimpleLogo } from "../Logo";
import NavbarIconButton from "./NavbarIconButton";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { MenuItem } from "../Header";

interface DesktopNavbarProps {
  menuItems: MenuItem[];
  blogBg: boolean;
  allCourseBg: boolean;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  menuItems,
  blogBg,
  allCourseBg,
}) => {
  const [language, setLanguage] = useState("RU");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleProtectedRouteClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(route);
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed font-[Bowler] top-0 left-0 right-0 z-50 my-4 w-full md:flex hidden justify-between px-10 py-5">
        <div
          className={`min-w-[800px] flex p-3.5 items-center rounded-[20px] ${
            blogBg
              ? "bg-[url('/assets/images/blogHeader.jpg')] bg-cover w-[780px] bg-no-repeat bg-fixed bg-center h-[70px]"
              : " bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] shadow-xl"
          } 
          ${
            allCourseBg
              ? "bg-[url('/assets/images/blueBg.jpg')] bg-cover bg-center h-[70px]"
              : " bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] shadow-xl"
          } 
            border border-white/10`}
        >
          <Link href={"/"}>
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
            <LanguageSelector
              currentLanguage={language}
              onSelectLanguage={setLanguage}
            />
          </div>
          <div onClick={(e) => handleProtectedRouteClick(e, "/shoppingcard")}>
            <NavbarIconButton className="hover:scale-105 duration-300" src="/assets/images/store.svg" alt="Store" />
          </div>
          <div onClick={(e) => handleProtectedRouteClick(e, "/personalAccount")}>
            <NavbarIconButton className="hover:scale-105 duration-300" src={"/assets/images/person.svg"} alt="Person" />
          </div>
        </div>
      </header>
    </>
  );
};

export default DesktopNavbar;
