import "@/i18n";                           // i18n einmal global initialisieren
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect } from "react";
import { focusMain, setMainLandmark } from "@/lib/a11y"; // aus Block 14 (Accessibility)

export default function App() {
  const { t } = useTranslation();

  useEffect(() => {
    // Landmark vorbereiten und Fokus beim Routenwechsel setzen
    setMainLandmark();
    focusMain();
  }, []);

  return (
    <>
      <header className="p-4 bg-green-600 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("app.name")}</h1>
        <LanguageSwitcher />
      </header>

      <main id="main" tabIndex={-1} className="p-4">
        {/* Hier kommen eure Routen-Komponenten rein */}
        <p>{t("nav.search")}</p>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        Ã‚Â© {new Date().getFullYear()} SeedFinder PRO
      </footer>
    </>
  );
}
