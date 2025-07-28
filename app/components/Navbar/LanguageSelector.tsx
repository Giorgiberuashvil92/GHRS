"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useI18n } from "../../context/I18nContext";

interface LanguageSelectorProps {
  currentLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { locale, setLocale } = useI18n();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const languages = [
    { code: "ka", label: "KA" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  const handleLanguageChange = (langCode: "ka" | "ru" | "en") => {
    setLocale(langCode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative font-[Pt]">
      <div
        className="w-[70px] h-[70px] flex items-center gap-1 justify-center rounded-[20px] cursor-pointer bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)]"
        onClick={toggleDropdown}
      >
        <h4 className="text-white">
          {languages.find((lang) => lang.code === locale)?.label ||
            locale.toUpperCase()}
        </h4>
        <Image
          src={"/assets/images/dropDown.svg"}
          alt="dropDown"
          width={9}
          height={5}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute top-[75px] right-0 rounded-2xl z-50 w-32 py-2 bg-gradient-to-br from-[rgba(94,43,143,0.7)] to-[rgba(61,51,74,0.6)] backdrop-blur-md shadow-xl border border-white/10">
          {languages
            .filter((lang) => lang.code !== locale)
            .map((lang) => (
              <button
                key={lang.code}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors duration-150 rounded-md"
                onClick={() =>
                  handleLanguageChange(lang.code as "ka" | "ru" | "en")
                }
              >
                {lang.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
