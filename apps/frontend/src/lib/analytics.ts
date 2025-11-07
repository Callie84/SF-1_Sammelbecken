declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, any> }) => void;
  }
}

/**
 * PrÃƒÂ¼ft, ob der Nutzer Tracking erlaubt hat.
 */
function hasConsent(): boolean {
  return localStorage.getItem("sf1_consent") === "accepted";
}

/**
 * Sendet ein anonymisiertes Event an Plausible oder, falls nÃƒÂ¶tig, ÃƒÂ¼ber das Backend.
 * Wird nur ausgefÃƒÂ¼hrt, wenn Consent vorliegt.
 */
export async function track(event: string, props?: Record<string, any>) {
  if (!hasConsent()) return;

  try {
    // 1. Direkter Plausible-Aufruf (Client SDK eingebunden)
    if (typeof window.plausible === "function") {
      window.plausible(event, props ? { props } : undefined);
      return;
    }

    // 2. Fallback: Relay ÃƒÂ¼ber Backend-API
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: event, props }),
      keepalive: true,
    });
  } catch {
    // Fehler stillschweigend ignorieren (kein Logging nÃƒÂ¶tig)
  }
}
