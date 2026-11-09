/** Supported interface languages. Content without a translation falls back to English. */
export const languages = [
  { code: 'ka', label: 'KA', name: 'ქართული' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'he', label: 'HE', name: 'עברית' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'uk', label: 'UK', name: 'Українська' },
] as const;
export type Locale = typeof languages[number]['code'];
export type ContentLocale = 'ka' | 'ru' | 'en';
export const localeCodes = languages.map(language => language.code);
export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && localeCodes.includes(value as Locale);
export const isRtl = (locale: Locale) => locale === 'ar' || locale === 'he';
export const getContentLocale = (locale: Locale): ContentLocale =>
  locale === 'ka' || locale === 'ru' ? locale : 'en';
