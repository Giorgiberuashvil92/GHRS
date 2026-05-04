import type { Instructor } from "../../types/instructor";

export type CourseLocale = "en" | "ru" | "ka";

type LocalizedNameParts = {
  en?: string;
  ru?: string;
  ka?: string;
};

/** სახელის ჩვენებისთვის საკმარისი ველები (არა მთელი Instructor) */
export type InstructorLocalizedNameFields = {
  name?: string;
  firstNameLocalized?: LocalizedNameParts;
  lastNameLocalized?: LocalizedNameParts;
};

export function resolveCourseLocale(locale: string | undefined | null): CourseLocale {
  if (locale === "en" || locale === "ru" || locale === "ka") return locale;
  return "ka";
}

/** API/Mongo-დან: მხოლოდ en, ru, ka */
export function sanitizeLocalizedNameParts(raw: unknown): LocalizedNameParts | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const en = typeof o.en === "string" ? o.en : undefined;
  const ru = typeof o.ru === "string" ? o.ru : undefined;
  const ka = typeof o.ka === "string" ? o.ka : undefined;
  if (en === undefined && ru === undefined && ka === undefined) return undefined;
  return { en, ru, ka };
}

function isDigitsOnlyPlaceholder(s: string): boolean {
  const t = s.trim();
  return t.length > 0 && /^\d+$/.test(t);
}

/**
 * ერთი გასაღების მნიშვნელობა (en / ru / ka) — გაწმენდა:
 * წინა `|` (მაგ. "| Аарон Якови"), ციფრული პლეისჰოლდერი, ერთ ველში `|` გამყოფი იმავე უჯრაში
 */
function normalizeFieldForStorageKey(
  raw: string | undefined,
  storageKey: CourseLocale
): string {
  if (raw == null) return "";
  let t = String(raw).trim();
  if (!t) return "";
  t = t.replace(/^\s*\|\s*/, "").trim();
  if (!t || isDigitsOnlyPlaceholder(t)) return "";
  if (t.includes("|")) {
    const parts = t
      .split("|")
      .map((x) => x.trim())
      .filter((x) => x && !isDigitsOnlyPlaceholder(x));
    if (parts.length === 0) return "";
    if (storageKey === "en") return parts[0] ?? "";
    if (storageKey === "ru") return parts[1] ?? parts[0] ?? "";
    if (storageKey === "ka") return parts[2] ?? parts[0] ?? "";
  }
  return t;
}

/** UI ენა = იმავე გასაღებზე first + last (მხოლოდ ამ ენის უჯრები) */
function fullNameForUiLocale(
  first: LocalizedNameParts | undefined,
  last: LocalizedNameParts | undefined,
  uiLocale: CourseLocale
): string {
  const f = normalizeFieldForStorageKey(first?.[uiLocale], uiLocale);
  const l = normalizeFieldForStorageKey(last?.[uiLocale], uiLocale);
  return [f, l].filter(Boolean).join(" ").trim();
}

/**
 * სრული სახელი ენის მიხედვით — იგივე ფოლბექი რაც კურსის `pickLocalized`-ს აქვს:
 * `მიმდინარე ენა → en → ru → ka`, ბოლოს `name`.
 */
export function instructorDisplayNameForLocale(
  inst: InstructorLocalizedNameFields,
  locale: CourseLocale
): string {
  const first = sanitizeLocalizedNameParts(inst.firstNameLocalized);
  const last = sanitizeLocalizedNameParts(inst.lastNameLocalized);

  const en = fullNameForUiLocale(first, last, "en");
  const ru = fullNameForUiLocale(first, last, "ru");
  const ka = fullNameForUiLocale(first, last, "ka");

  const primary =
    (locale === "en" ? en : locale === "ru" ? ru : ka) || en || ru || ka;
  if (primary) return primary;
  const fallbackName = (inst.name || "").trim();
  if (!fallbackName) return "";
  if (fallbackName.includes("|")) {
    return displayLegacyCourseInstructorField(fallbackName, locale);
  }
  return fallbackName;
}

/**
 * კურსის ლეგაციის ერთი სტრიქონი: მაგ. "Aharon | Аарон Якови | Yakobi"
 * (ინგლისური სახელი | სრული რუსული | ლათინური გვარი) → en/ru/ka ცალკე სრული სახელი+გვარი საჩვენებლად.
 */
export function legacyCourseInstructorStringsPerLocale(raw: string): {
  en: string;
  ru: string;
  ka: string;
} {
  const t = (raw || "").trim();
  if (!t) return { en: "", ru: "", ka: "" };
  if (!t.includes("|")) {
    const single = t.replace(/\s+/g, " ").trim();
    return { en: single, ru: single, ka: single };
  }
  const parts = t
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !isDigitsOnlyPlaceholder(s));
  if (parts.length === 0) return { en: "", ru: "", ka: "" };
  if (parts.length === 1) {
    const single = parts[0].replace(/\s+/g, " ").trim();
    return { en: single, ru: single, ka: single };
  }
  const p0 = parts[0] || "";
  const p1 = parts[1] || "";
  const p2 = parts.length >= 3 ? parts[2] || "" : "";
  const ru = (p1 || p0).replace(/\s+/g, " ").trim();
  const p0Words = p0.split(/\s+/).filter(Boolean);
  const p2Words = p2.split(/\s+/).filter(Boolean);
  const cyrillicInP2 = p2 ? /[\u0400-\u04FF]/.test(p2) : false;
  const latinSurname =
    p2 &&
    p0Words.length === 1 &&
    p2Words.length === 1 &&
    !cyrillicInP2;
  const en = (
    latinSurname ? `${p0} ${p2}`.trim() : p0 || p2 || p1
  ).replace(/\s+/g, " ").trim();
  const hasKaScript = p2 && /[\u10A0-\u10FF]/.test(p2);
  const ka = (
    hasKaScript
      ? p0Words.length === 1 && p2Words.length === 1
        ? `${p0} ${p2}`.trim()
        : p2 || p1
      : en
  ).replace(/\s+/g, " ").trim();
  return { en, ru, ka: ka || en };
}

/** ლეგაციის სტრიქონის ჩვენება UI ენაზე (იგივე ფოლბექი: მიმდინარე → en → ru → ka) */
export function displayLegacyCourseInstructorField(
  raw: string,
  locale: CourseLocale
): string {
  const { en, ru, ka } = legacyCourseInstructorStringsPerLocale(raw);
  const primary =
    (locale === "en" ? en : locale === "ru" ? ru : ka) || en || ru || ka;
  return primary.trim();
}

/** ინსტრუქტორის ძებნისთვის — უპირატესობა EN კომპოზიტს (ხშირად DB `name` ემთხვევა) */
export function primaryKeyForLegacyCourseInstructorLookup(raw: string): string {
  const { en, ru, ka } = legacyCourseInstructorStringsPerLocale(raw);
  return (en || ru || ka || raw.trim()).trim();
}

export function normalizeInstructorNameKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function withSanitizedInstructorNames<T extends Partial<Instructor>>(inst: T): T {
  return {
    ...inst,
    firstNameLocalized: sanitizeLocalizedNameParts(inst.firstNameLocalized) ?? inst.firstNameLocalized,
    lastNameLocalized: sanitizeLocalizedNameParts(inst.lastNameLocalized) ?? inst.lastNameLocalized,
  };
}

export function instructorAliasKeys(inst: Instructor): Set<string> {
  const set = new Set<string>();
  const name = (inst.name || "").trim();
  if (name) set.add(normalizeInstructorNameKey(name));

  const first = sanitizeLocalizedNameParts(inst.firstNameLocalized);
  const last = sanitizeLocalizedNameParts(inst.lastNameLocalized);
  for (const loc of ["en", "ru", "ka"] as CourseLocale[]) {
    const j = fullNameForUiLocale(first, last, loc);
    if (j) set.add(normalizeInstructorNameKey(j));
  }
  return set;
}

export function instructorMatchesEmbeddedCourseName(
  inst: Instructor,
  embeddedName: string
): boolean {
  if (!embeddedName?.trim()) return false;
  const key = normalizeInstructorNameKey(embeddedName);
  return instructorAliasKeys(inst).has(key);
}
