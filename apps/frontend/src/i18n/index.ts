import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ICU from "i18next-icu";
import LanguageDetector from "i18next-browser-languagedetector";
import de from "./locales/de/common.json";
import en from "./locales/en/common.json";


const resources = { de: { common: de }, en: { common: en } } as const;


const stored = typeof window !== "undefined" ? localStorage.getItem("sf1_lang") : null;


i18n
.use(ICU)
.use(LanguageDetector)
.use(initReactI18next)
.init({
resources,
fallbackLng: "de",
lng: stored || undefined,
ns: ["common"],
defaultNS: "common",
detection: { order: ["querystring", "localStorage", "navigator"], lookupQuerystring: "lang" },
interpolation: { escapeValue: false },
returnEmptyString: false,
});


export default i18n;