export type ContentLocale = "ka" | "en" | "ru";

/**
 * მრავალენოვანი ველის არჩევა არჩეული ენის მიხედვით + ლოგიკური fallback
 * (ka: ka → en → ru; en: en → ru → ka; ru: ru → en → ka)
 */
export function pickLocalized(
  obj: { en?: string; ru?: string; ka?: string } | undefined | null,
  loc: ContentLocale
): string {
  if (!obj) return "";
  const order: ContentLocale[] =
    loc === "en"
      ? ["en", "ru", "ka"]
      : loc === "ru"
        ? ["ru", "en", "ka"]
        : ["ka", "en", "ru"];
  for (const k of order) {
    const v = obj[k];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}
