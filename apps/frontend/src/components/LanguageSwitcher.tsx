import { useTranslation } from "react-i18next";


export default function LanguageSwitcher() {
const { i18n, t } = useTranslation();
const setLang = (lng: "de" | "en") => {
i18n.changeLanguage(lng);
try { localStorage.setItem("sf1_lang", lng); } catch {}
document.documentElement.lang = lng;
};
return (
<div role="group" aria-label={t("lang.switch")}>
<button onClick={() => setLang("de")} aria-pressed={i18n.language.startsWith("de")}>DE</button>
<button onClick={() => setLang("en")} aria-pressed={i18n.language.startsWith("en")}>EN</button>
</div>
);
}