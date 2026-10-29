const loaders = { ka: () => import('./ka'), en: () => import('./en'), ru: () => import('./ru') };
const loaded = new Map<string, Promise<Record<string, unknown>>>();
export function loadTranslations(locale: keyof typeof loaders) {
  let result = loaded.get(locale);
  if (!result) {
    result = loaders[locale]().then(module => module.default).catch(error => { loaded.delete(locale); throw error; });
    loaded.set(locale, result);
  }
  return result;
}
