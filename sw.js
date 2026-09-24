/**
 * dua — Service Worker (sw.js)
 * Cache-first for versioned assets, network-first for content and pages.
 * After first load, the entire Salah guide works offline (except CDN audio).
 */

const CACHE = 'dua-v3';

const STATIC = [
  '/dua/',
  '/dua/index.html',
  '/dua/sujood/index.html',
  '/dua/miqat/index.html',
  '/dua/assets/theme/theme.css',
  '/dua/assets/theme/theme.js',
  '/dua/assets/icons/icons.js',
  '/dua/assets/css/base.css',
  '/dua/sujood/builder.js',
  '/dua/sujood/style.css',
  '/dua/sujood/salah.json',
  '/dua/sujood/quran.json',
  '/dua/miqat/builder.js',
  '/dua/miqat/style.css',
  '/dua/miqat/reminder.json',
  '/dua/assets/fonts/ScheherazadeNew-Regular.woff2',
  '/dua/assets/fonts/ScheherazadeNew-Bold.woff2',
  '/dua/assets/fonts/AmiriQuran-Regular.woff2',
  '/dua/assets/fonts/InterVariable.woff2',
  '/dua/assets/fonts/Manjari-Regular.woff2',
  '/dua/assets/fonts/NotoSansMalayalam-Regular.woff2'
];

// Install — cache all static files
self.addEventListener('install', e => {
  self.skipWaiting();
  // If a required resource fails, keep the previous worker active.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, skip for CDN audio
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never intercept CDN audio requests (EveryAyah, QuranCDN)
  // Content can change independently of the application code.
  if (url.pathname.endsWith('.json') && !url.pathname.endsWith('/manifest.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, res.clone())));
        return res;
      }).catch(async () => (await caches.match(e.request)) || Response.error())
    );
    return;
  }

  // Cache-first for files managed by the cache version.
  if (url.pathname.includes('/assets/fonts/') || url.pathname.includes('/assets/icons/') ||
      url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        if (res.ok) e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, res.clone())));
        return res;
      }))
    );
    return;
  }

  // Check for updated pages, with cached pages available offline.
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, res.clone())));
      return res;
    }).catch(async () => (await caches.match(e.request)) || Response.error())
  );
});
