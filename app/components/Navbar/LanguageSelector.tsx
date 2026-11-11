"use client";
import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "../../context/I18nContext";
import { languages } from "../../../lib/locales";

const sortedLanguages = [...languages].sort((a, b) => a.label.localeCompare(b.label, "en"));

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        container.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [isOpen]);
  return (
    <div ref={container} className="relative font-pt">
      <button type="button" aria-label="Language" aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className="w-[70px] h-[70px] flex items-center gap-1 justify-center rounded-[20px] cursor-pointer bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] text-white">
        {languages.find(language => language.code === locale)?.label}
        <span aria-hidden="true" className="text-xs">⌄</span>
      </button>
      {isOpen && (
        <div className="absolute top-[75px] end-0 rounded-2xl z-50 w-max max-h-[60vh] overflow-y-auto py-2 bg-[#3D334A] shadow-xl border border-white/10">
          {sortedLanguages.map(language => (
            <button type="button" key={language.code} lang={language.code} dir="auto"
              aria-current={language.code === locale ? 'true' : undefined}
              className="block w-full px-4 py-2 text-start text-white hover:bg-white/10 focus-visible:bg-white/10 rounded-md"
              onClick={() => { setLocale(language.code); setIsOpen(false); }}>
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default LanguageSelector;
