import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import esTranslation from "../locales/es/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
   .use(LanguageDetector)
  .use(initReactI18next) // Ties i18next to React
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    fallbackLng: "en",

    detection: {
      order: ["querystring", "navigator", "localStorage"], // Check URL query first
      lookupQuerystring: "lng", // The parameter name (?lng=es)
      caches: [], 
    },

    react: {
      useSuspense: false, // Prevents React from halting your app layout while waiting
    },

    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
  });

export default i18n;