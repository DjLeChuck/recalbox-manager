import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    /*ns: ['common'],
    defaultNS: 'common',*/

    nsSeparator: false,
    keySeparator: false,

    debug: 'production' !== process.env.NODE_ENV,

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    backend: {
      // path where resources get loaded from, or a function
      // returning a path:
      // function(lngs, namespaces) { return customPath; }
      // the returned path will interpolate lng, ns if provided like giving a static path
      // loadPath: '/locales/{{lng}}.json',
      loadPath: function(lngs, namespaces) { return `/locales/${lngs[0]}.json`; }
    }
  });

export default i18n;
