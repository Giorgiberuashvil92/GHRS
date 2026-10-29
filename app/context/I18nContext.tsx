"use client";
import { loadTranslations } from "../../lib/translations";
import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "ka" | "ru" | "en";

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
  return { language: context.locale };
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
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale;

      if (savedLocale && ["ka", "ru", "en"].includes(savedLocale)) {

        return savedLocale;
      }
      // თუ არ არის შენახული, დავაყენოთ default და შევინახოთ

      localStorage.setItem("locale", "ka");
    }
    return "ka";
  });

  const [translationData, setTranslationData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadTranslations(locale)
      .then(messages => { if (!cancelled) setTranslationData(messages); })
      .catch(error => console.error('Failed to load translations:', error))
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [locale]);

  const setLocale = (newLocale: Locale) => {

    if (newLocale !== locale) {

      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);

    } else {

    }
  };

  const t = (key: string, options?: Record<string, string>): string => {
    let translation = getNestedValue(translationData, key);


    if (translation === key) return key;

    if (typeof translation === "object" && translation !== null) {
      const localeValue = (translation as Record<string, string>)[locale];
      if (typeof localeValue === "string") {
        translation = localeValue;
      } else {
        return `[[Missing translation for ${key}]]`;
      }
    }

    if (options && typeof translation === "string") {
      Object.keys(options).forEach((optionKey) => {
        translation = translation.replace(
          `{{${optionKey}}}`,
          options[optionKey]
        );
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
