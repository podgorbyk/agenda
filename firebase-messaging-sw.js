/* Service worker de « Notre Agenda » — à garder à côté de index.html
   1) notifications (Firebase Cloud Messaging)
   2) ouverture instantanée : l'appli et les bibliothèques Firebase sont gardées sur le téléphone */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBxwA5rcBIQeSdlRTNPM92xTrGEdRxuA8c",
  authDomain: "agenda-famille-d6eaf.firebaseapp.com",
  projectId: "agenda-famille-d6eaf",
  storageBucket: "agenda-famille-d6eaf.firebasestorage.app",
  messagingSenderId: "851152496646",
  appId: "1:851152496646:web:9cac6e4dd25a80be7e3b87"
});
// Les notifications avec titre/texte sont affichées automatiquement par Firebase,
// et un appui ouvre l'agenda (lien envoyé par le serveur).
firebase.messaging();

/* ---------- cache (v1) ---------- */
const SHELL = "na-shell-v1", LIBS = "na-libs-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (![SHELL, LIBS].includes(k)) await caches.delete(k);
  await self.clients.claim();
})()));

const pageKey = url => url.origin + url.pathname;   // ignore ?v=…
async function fetchAndKeep(href, key) {
  const res = await fetch(href, { cache: "no-cache", credentials: "same-origin" });
  if (res && res.ok && res.status === 200 && !res.redirected) { const c = await caches.open(SHELL); await c.put(key, res.clone()); }
  return res;
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // bibliothèques versionnées (Firebase, pdf.js) : jamais modifiées → cache d'abord
  if ((url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) || url.hostname === "cdnjs.cloudflare.com") {
    e.respondWith(caches.open(LIBS).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  const isPage = req.mode === "navigate";
  const isAsset = /\.(png|jpg|jpeg|webmanifest)$/.test(url.pathname);
  if (!isPage && !isAsset) return;   // vérif de mise à jour, etc. : réseau normal
  const key = pageKey(url);
  // copie « propre » depuis le réseau (sans en-têtes conditionnels, pour pouvoir la garder) ; redirection → navigation normale
  const fresh = async () => {
    const res = await fetchAndKeep(url.href, key);
    return res.redirected ? fetch(req) : res;
  };
  // « Recharger » (lien avec ?v=) : on prend la dernière version sur le réseau
  if (isPage && url.searchParams.has("v")) {
    e.respondWith(fresh().catch(() => caches.match(key)));
    return;
  }
  // sinon : on affiche tout de suite la copie gardée, et on la rafraîchit en arrière-plan
  e.respondWith((async () => {
    const hit = await caches.match(key);
    if (hit) { e.waitUntil(fetchAndKeep(url.href, key).catch(() => {})); return hit; }
    return fresh();
  })());
});
