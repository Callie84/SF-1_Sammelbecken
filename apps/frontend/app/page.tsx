"use client";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">
        {t("app.name")}
      </h1>

      <p className="opacity-80">
        {t("nav.search")}
      </p>

      <div className="mt-4">
        <a className="bg-emerald-600 text-white px-4 py-2 rounded" href="/seedfinder">
          {t("button.buy")}
        </a>
      </div>
    </section>
  );
}
