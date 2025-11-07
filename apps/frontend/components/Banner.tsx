'use client';
import { useEffect, useState } from 'react';

type Props = {
  slot: 'top' | 'side' | 'inline';
  context?: 'home' | 'search' | 'seed';
  partner: 'zamnesia' | 'rqs';
  slug?: string;                 // z. B. Strain-Name
  imgSrc: string;
  alt: string;
};

export default function Banner({ slot, context, partner, slug = '', imgSrc, alt }: Props) {
  const [seen, setSeen] = useState(0);
  useEffect(() => {
    const k = `banner_seen_${slot}_${partner}`;
    const n = Number(localStorage.getItem(k) || '0');
    localStorage.setItem(k, String(n + 1));
    setSeen(n + 1);
  }, [slot, partner]);

  const href = `/go/${partner}/${encodeURIComponent(slug)}`;
  return (
    <a href={href} className="block group border border-neutral-800 rounded overflow-hidden">
      <img src={imgSrc} alt={alt} className="w-full h-auto group-hover:opacity-90" />
      <div className="p-2 text-xs opacity-70 flex justify-between">
        <span>{partner.toUpperCase()}</span>
        <span>{context || 'ad'} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· view {seen}</span>
      </div>
    </a>
  );
}