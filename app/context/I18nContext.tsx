"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "ka" | "ru" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

// Add useLanguage hook
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

// Helper function to get nested values from object
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  return (
    (path
      .split(".")
      .reduce(
        (o: unknown, p: string) =>
          o && typeof o === "object" && p in o
            ? (o as Record<string, unknown>)[p]
            : undefined,
        obj
      ) as string) || path
  );
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("ka");
  const [translationData, setTranslationData] = useState<
    Record<string, unknown>
  >({});

  // Load translation files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [common, home, advantages, subscribe, sets, header, components] =
          await Promise.all([
            fetch(`/locales/${locale}/common.json`).then((res) => res.json()),
            fetch(`/locales/${locale}/home.json`).then((res) => res.json()),
            fetch(`/locales/${locale}/advantages.json`).then((res) =>
              res.json()
            ),
            fetch(`/locales/${locale}/subscribe.json`).then((res) =>
              res.json()
            ),
            fetch(`/locales/${locale}/sets.json`).then((res) => res.json()),
            fetch(`/locales/${locale}/header.json`).then((res) => res.json()),
            fetch(`/locales/${locale}/components.json`).then((res) =>
              res.json()
            ),
          ]);

        setTranslationData({
          ...common,
          ...home,
          ...advantages,
          ...subscribe,
          ...sets,
          ...header,
          ...components,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };

    loadTranslations();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Store in localStorage
    localStorage.setItem("locale", newLocale);
  };

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["ka", "ru", "en"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const t = (key: string, options?: Record<string, string>): string => {
    let translation = getNestedValue(translationData, key);

    // If translation not found, return the key
    if (translation === key) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // If translation is an object (e.g., {ka, ru, en, _id}), try to return the value for the current locale
    if (typeof translation === "object" && translation !== null) {
      // Remove any non-locale keys (like _id)
      const localeValue = (translation as Record<string, string>)[locale];
      if (typeof localeValue === "string") {
        translation = localeValue;
      } else {
        // fallback: return a warning string
        return `[[Translation object for key: ${key}]]`;
      }
    }

    // Simple interpolation
    if (options && typeof translation === "string") {
      Object.keys(options).forEach((optionKey) => {
        translation = translation.replace(
          `{{${optionKey}}}`,
          options[optionKey]
        );
      });
    }

    // Ensure we never return an object
    if (typeof translation !== "string") {
      return `[[Invalid translation for key: ${key}]]`;
    }

    return translation;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};
