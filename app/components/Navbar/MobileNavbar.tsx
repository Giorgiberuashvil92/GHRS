"use client";
import React, { useState } from "react";
import { MobileLogo } from "../Logo";
import NavbarIconButton from "./NavbarIconButton";
import { defaultMenuItems } from "../Header";
import Link from "next/link";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="py-2 md:hidden z-[9999999999] max-w-[700px]">
      <div className=" top-0 left-0 right-0 z-[9999999999] px-6 py-6 md:hidden w-full mx-auto">
        <div className="px-4 py-3  flex justify-between items-center rounded-2xl bg-gradient-to-br from-[rgba(94,43,143,0.5)] to-[rgba(61,51,74,0.4)] backdrop-blur-lg shadow-xl border border-white/10">
          <div onClick={toggleMenu}>
            <NavbarIconButton src={"/assets/images/burger.svg"} alt="Burger" />
          </div>
          <Link href={"/"}>
            <MobileLogo />
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
          {defaultMenuItems.map((item, index) => (
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
