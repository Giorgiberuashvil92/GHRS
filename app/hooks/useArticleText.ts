"use client";

import { useEffect, useState } from "react";
import { getPublicJson } from "../../lib/public-request";
import type { Locale } from "../../lib/locales";
import { useI18n } from "../context/I18nContext";

type ArticleField = "title" | "excerpt" | "content";
type LocalizedField = Partial<Record<Locale, string>> | string;
type ArticleFields = { _id?: string } & Partial<Record<ArticleField, LocalizedField>>;
type StaticTranslations = Record<string, Partial<Record<ArticleField, string>>>;

export function useArticleText() {
  const { locale } = useI18n();
  const translationUrl = locale === "en" || locale === "ru"
    ? null
    : `/article-translations/${locale}.json`;
  const [loaded, setLoaded] = useState<{ url: string; translations: StaticTranslations }>();
  const data = loaded?.url === translationUrl ? loaded.translations : undefined;

  useEffect(() => {
    if (!translationUrl) return;
    let cancelled = false;
    getPublicJson<StaticTranslations>(translationUrl, { maxAgeMs: Infinity })
      .then(translations => {
        if (!cancelled) setLoaded({ url: translationUrl, translations });
      })
      .catch(() => { /* English remains available if the static file cannot be loaded. */ });
    return () => { cancelled = true; };
  }, [translationUrl]);

  return (article: ArticleFields, field: ArticleField): string => {
    const original = article[field];
    if (typeof original === "string") return original;
    const existing = original?.[locale];
    if (existing?.trim()) return existing;
    return (article._id && data?.[article._id]?.[field]) || original?.en || "";
  };
}
