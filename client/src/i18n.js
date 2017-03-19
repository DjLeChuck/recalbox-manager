import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'fr', 'de', 'es', 'pt-BR', 'ko', 'lv'],

    fallbackLng: 'en',

    nsSeparator: false,
    keySeparator: false,

    // too much verbose!
    // debug: 'production' !== process.env.NODE_ENV,
    debug: false,

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    backend: {
      loadPath: function (lngs) {
        return `/locales/${lngs[0]}.json`;
      }
    }
  });

export default i18n;
