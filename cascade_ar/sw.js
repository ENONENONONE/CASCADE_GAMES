// THE FOLD — the app shell kept for offline play; one cache a version, the old one dropped. Bump CACHE on every change of a file here, or a browser that has the game keeps the old one. The install reads past the HTTP cache (cache: 'reload'), so a bump never stores a stale copy.
const CACHE = 'fold-v22';
const SHELL = ['./', './index.html', './data.js', './field.js', './ar.js', './game.js', './vendor/three.min.js', './parts/story/story.js', './parts/sound/sound.js', './parts/levels/levels.js', './parts/shaders/fx.js', './parts/relief/relief.js', './parts/corpus/material.js', './parts/well/well.js', './parts/void/void.js', './parts/rays/rays.js', './parts/trace/trace.js', './parts/glow/glow.js', './parts/heat/heat.js', './parts/vr/vr.js', './parts/ledger/ledger.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || /\/ledger(\/|$)/.test(new URL(e.request.url).pathname)) return;   // the ledger is live: never from this cache
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(f => { if (f.ok && new URL(e.request.url).origin === location.origin) { const cp = f.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return f; }).catch(() => r || new Response('', { status: 504, statusText: 'offline' }))));
});
