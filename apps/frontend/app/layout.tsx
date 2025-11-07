import "@/i18n";
import "./globals.css";
import type { Metadata } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { setMainLandmark } from "@/lib/a11y";

export const metadata: Metadata = {
  title: "SeedFinder PRO",
  description: "Preisvergleich, Grow-Tools und mehr",
  manifest: "/manifest.json",
  themeColor: "#10b981"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (typeof document !== "undefined") setMainLandmark();

  return (
    <html lang="de">
      <body className="bg-neutral-950 text-neutral-100">
        <div className="min-h-dvh grid grid-rows-[auto,1fr]">
          <header className="border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="font-semibold">SeedFinder PRO</a>
              <nav className="flex gap-4 text-sm opacity-90 items-center">
                <a href="/seedfinder">SeedFinder</a>
                <a href="/growmanager">Grow-Manager</a>
                <a href="/downloads">Downloads</a>
                <a href="/settings">Settings</a>
                <LanguageSwitcher />
              </nav>
            </div>
          </header>

          <main id="main" tabIndex={-1} className="max-w-6xl mx-auto w-full px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
