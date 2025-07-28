import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const nextI18NextConfig = {
  i18n: {
    defaultLocale: 'ka',
    locales: ['ka', 'ru', 'en'],
    localeDetection: false,
  },
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export { serverSideTranslations, nextI18NextConfig };
export default appWithTranslation; 