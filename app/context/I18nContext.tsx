"use client";
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

// Helper function to get nested values from object
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const value = path
    .split(".")
    .reduce(
      (o: unknown, p: string) => {
        return o && typeof o === "object" && p in o
          ? (o as Record<string, unknown>)[p]
          : undefined;
      },
      obj
    );

  if (value === undefined) {
    return path;
  }

  return value as string;
};

// Deep merge helper to preserve nested keys when combining translation files
const deepMerge = (
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> => {
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      key in target &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      typeof source[key] === "object" &&
      source[key] !== null
    ) {
      output[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      output[key] = source[key];
    }
  });
  return output;
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Try to get locale from localStorage first
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedLocale && ["ka", "ru", "en"].includes(savedLocale)) {
        return savedLocale;
      }
    }
    return "ka";
  });
  const [translationData, setTranslationData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translation files
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const [common, home, advantages, subscribe, sets, header, components, personalAccount] =
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
            fetch(`/locales/${locale}/components.json`).then((res) => res.json()),
            fetch(`/locales/${locale}/personalAccount.json`).then((res) => res.json()),
          ]);

        const translationsArray = [
          common,
          home,
          advantages,
          subscribe,
          sets,
          header,
          components,
          personalAccount,
        ];

        const mergedTranslations = translationsArray.reduce<Record<string, unknown>>(
          (acc, curr) => deepMerge(acc, curr as Record<string, unknown>),
          {} as Record<string, unknown>
        );

        setTranslationData(mergedTranslations);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);
      window.location.reload(); // Force reload to ensure all components get new translations
    }
  };

  const t = (key: string, options?: Record<string, string>): string => {
    let translation = getNestedValue(translationData, key);

    // If translation not found, return the key
    if (translation === key) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Loading translations...</h2>
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
