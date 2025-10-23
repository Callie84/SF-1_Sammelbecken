import React from 'react';

const req = [
  'NEXT_PUBLIC_IMPRESSUM_NAME',
  'NEXT_PUBLIC_IMPRESSUM_STREET',
  'NEXT_PUBLIC_IMPRESSUM_CITY',
  'NEXT_PUBLIC_IMPRESSUM_EMAIL'
] as const;

function must(val?: string) {
  if (!val) throw new Error('Impressum fehlende Pflichtangaben. Setze die env Variablen.');
  return val;
}

export default function ImpressumPage() {
  const vars = Object.fromEntries(req.map(k => [k, process.env[k]]));
  // Build bricht, wenn Pflichtangaben fehlen
  req.forEach(k => must(process.env[k]));

  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Impressum</h1>
      <p><strong>Verantwortlich:</strong><br/>{process.env.NEXT_PUBLIC_IMPRESSUM_NAME}</p>
      <p><strong>Anschrift:</strong><br/>{process.env.NEXT_PUBLIC_IMPRESSUM_STREET}<br/>{process.env.NEXT_PUBLIC_IMPRESSUM_CITY}</p>
      <p><strong>EÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œMail:</strong> <a href={`mailto:${process.env.NEXT_PUBLIC_IMPRESSUM_EMAIL}`}>{process.env.NEXT_PUBLIC_IMPRESSUM_EMAIL}</a></p>
      {process.env.NEXT_PUBLIC_IMPRESSUM_PHONE && (<p><strong>Telefon:</strong> {process.env.NEXT_PUBLIC_IMPRESSUM_PHONE}</p>)}
      {process.env.NEXT_PUBLIC_IMPRESSUM_VAT && (<p><strong>UStÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œIdNr.:</strong> {process.env.NEXT_PUBLIC_IMPRESSUM_VAT}</p>)}
      <h2>Haftung fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r Inhalte</h2>
      <p>Alle Angaben ohne GewÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤hr. Keine Aufforderung zum Anbau in RechtsrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤umen, in denen dies verboten ist.</p>
      <h2>Externe Links</h2>
      <p>Externe Inhalte werden mit <code>rel="nofollow noopener noreferrer"</code> verlinkt.</p>
    </section>
  );
}