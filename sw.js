/* Follow-Up Machine — tiny offline service worker.
   Strategy: network-first (so you always get the latest version when online),
   falling back to the cached copy when you're offline. */
const CACHE = "fum-cache-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Stay out of the way of anything that isn't this site's own files: Supabase
  // sign-in/data calls and the CDN library must always hit the real network,
  // never a cached or substituted response.
  if (url.origin !== self.location.origin) return;

  // /api/config carries the Supabase settings, which change on any redeploy —
  // never serve an old copy of it.
  if (url.pathname.startsWith("/api/")) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) => {
          if (r) return r;
          // Only hand back the app shell for page loads — never in place of a
          // file the page asked for, which would just break in a confusing way.
          if (req.mode === "navigate") return caches.match("./index.html");
          throw new Error("offline");
        })
      )
  );
});
