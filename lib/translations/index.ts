const loaders = { ka: () => import('./ka'), en: () => import('./en'), ru: () => import('./ru'), he: () => import('./he'), ar: () => import('./ar'), de: () => import('./de'), fr: () => import('./fr'), it: () => import('./it'), uk: () => import('./uk') };
const loaded = new Map<string, Promise<Record<string, unknown>>>();
export function loadTranslations(locale: keyof typeof loaders) {
  let result = loaded.get(locale);
  if (!result) {
    result = loaders[locale]().then(module => module.default).catch(error => { loaded.delete(locale); throw error; });
    loaded.set(locale, result);
  }
  return result;
}
