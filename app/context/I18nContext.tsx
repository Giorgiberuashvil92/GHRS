"use client";
import { consultationMessages } from "../../lib/translations/consultation";
import { mergeMessages } from "../../lib/translations/merge";
import { loadTranslations } from "../../lib/translations";
import React, { createContext, useContext, useState, useEffect } from "react";

import { type Locale, isLocale, isRtl, getContentLocale } from "../../lib/locales";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, string>) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLanguage must be used within an I18nProvider");
  }
  // API content currently has three language fields; keep it visible in new UI languages.
  return { language: getContentLocale(context.locale) };
};

interface I18nProviderProps {
  children: React.ReactNode;
}

// Helper function for nested keys
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const value = path.split(".").reduce(
    (o: unknown, p: string) =>
      o && typeof o === "object" && p in o
        ? (o as Record<string, unknown>)[p]
        : undefined,
    obj
  );
  return value === undefined ? path : (value as string);
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("ka");
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale");
      if (isLocale(saved)) setLocaleState(saved);
    } catch { /* Language selection still works when browser storage is disabled. */ }
    setRestored(true);
  }, []);

  const [translations, setTranslations] = useState<{
    locale: Locale;
    english: Record<string, unknown>;
    localized: Record<string, unknown>;
  }>();
  const translationData = translations?.locale === locale ? translations.localized : translations?.english ?? {};
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!restored) return;
    let cancelled = false;
    setIsLoading(true);
    loadTranslations("en").then(async fallback => [
      fallback, await loadTranslations(locale).catch(() => fallback),
    ])
      .then(([fallback, messages]) => {
        if (cancelled) return;
        const english = mergeMessages(fallback, { consultation: consultationMessages.en });
        setTranslations({
          locale,
          english,
          localized: mergeMessages(mergeMessages(english, messages), { consultation: consultationMessages[locale] }),
        });
      })
      .catch(error => console.error('Failed to load translations:', error))
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [locale, restored]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (!isLocale(newLocale)) return;
    setLocaleState(newLocale);
    try { localStorage.setItem("locale", newLocale); } catch { /* Optional persistence. */ }
  };

  const t = (key: string, options?: Record<string, string>): string => {
    let translation = getNestedValue(translationData, key);


    if (translation === key) return key;

    if (typeof translation === "object" && translation !== null) {
      const localeValue = (translation as Record<string, string>)[locale] || (translation as Record<string, string>).en;
      if (typeof localeValue === "string") {
        translation = localeValue;
      } else {
        return `[[Missing translation for ${key}]]`;
      }
    }

    if (options && typeof translation === "string") {
      Object.keys(options).forEach((optionKey) => {
        translation = translation.split(`{{${optionKey}}}`).join(options[optionKey]);
      });
    }

    return typeof translation === "string"
      ? translation
      : `[[Invalid translation for ${key}]]`;
  };

  if (isLoading && Object.keys(translationData).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Loading translations...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};
