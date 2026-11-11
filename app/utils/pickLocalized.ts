import { type Locale } from "../../lib/locales";
export type ContentLocale = Locale;

/**
 * მრავალენოვანი ველის არჩევა არჩეული ენის მიხედვით + ლოგიკური fallback
 * (არჩეული ენა → ინგლისური)
 */
export function pickLocalized(
  obj: Partial<Record<Locale, string>> | undefined | null,
  loc: ContentLocale
): string {
  if (!obj) return "";
  const selected = obj[loc];
  return selected?.trim() ? selected : obj.en?.trim() ? obj.en : "";
}
