/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;
const STATIC = "sf1-static-v1";

sw.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC).then((c) => c.addAll(["/", "/index.html", "/manifest.webmanifest"]))
  );
  sw.skipWaiting();
});

sw.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC).map((k) => caches.delete(k)))
    )
  );
  sw.clients.claim();
});

// HTML: network-first, Assets: cache-first
sw.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.startsWith("/icons/")) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  } else if (req.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(req).then((r) => {
        const copy = r.clone();
        caches.open(STATIC).then((c) => c.put(req, copy)).catch(() => {});
        return r;
      }).catch(() => caches.match(req))
    );
  }
});
