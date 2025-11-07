import { track } from "@/lib/analytics";

export function AffiliateButton({ href, partner }: { href: string; partner: string }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const consent = localStorage.getItem("sf1_consent") === "accepted";

    // Beacon bevorzugen
    if (consent && "sendBeacon" in navigator) {
      const payload = JSON.stringify({ name: "affiliate_click", props: { partner } });
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return; // sofort weiterleiten
    }

    // Fallback mit fetch
    e.preventDefault();
    track("affiliate_click", { partner }).finally(() => (window.location.href = href));
  };

  return (
    <a href={href} onClick={onClick} rel="nofollow sponsored" target="_blank">
      Zum Shop
    </a>
  );
}
