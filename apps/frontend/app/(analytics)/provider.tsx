'use client';
import { useEffect } from 'react';

export default function AnalyticsProvider() {
  useEffect(() => {
    // Plausible Script einbinden (self-hosted Pfad anpassen, falls nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶tig)
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', 'seedfinderpro.de');
    s.src = '/js/script.js'; // bei self-hosted plausbile reverse-proxy unter /js/script.js einrichten
    document.body.appendChild(s);
  }, []);
  return null;
}