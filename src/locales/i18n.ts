import * as VueI18n from "vue-i18n";
import en from "./en/translation.json";
import es from "./es/translation.json";

type MessageSchema = typeof en | typeof es;

const i18n = VueI18n.createI18n<[MessageSchema], "en" | "es">({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    es,
  },
});

export const createI18nInstance = (language: "en" | "es") =>
  VueI18n.createI18n<[MessageSchema], "en" | "es">({
    legacy: false,
    locale: language,
    fallbackLocale: "en",
    messages: {
      en,
      es,
    },
  });

export default i18n;
