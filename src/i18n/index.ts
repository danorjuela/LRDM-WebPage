import { createI18n } from "vue-i18n";
import en from "./en.json";
import es from "./es.json";

function getBrowserLocale() {
  const locale = navigator.language || (navigator as any).userLanguage;
  return locale.split("-")[0];
}

const supportedLocales = ["en", "es"];

const lcLang = localStorage.getItem("lcLang") || "";
let locale = "";
if (supportedLocales.includes(lcLang)) {
  locale = lcLang;
} else {
  locale = supportedLocales.includes(getBrowserLocale())
    ? getBrowserLocale()
    : "es";
}

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "es",
  globalInjection: true,
  messages: {
    en,
    es,
  },
});
