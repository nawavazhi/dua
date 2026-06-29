/**
 * dua — Service Worker (sw.js)
 * Cache-first for static assets, network-first for data files.
 * After first load, the entire Salah guide works offline (except CDN audio).
 */

const CACHE = 'dua-v1';

const STATIC = [
  '/dua/',
  '/dua/index.html',
  '/dua/salah/index.html',
  '/dua/assets/theme/theme.css',
  '/dua/assets/theme/theme.js',
  '/dua/assets/css/style.css',
  '/dua/assets/icons/icons.js',
  '/dua/assets/js/builder.js',
  '/dua/assets/data/salah.json',
  '/dua/assets/data/quran.json',
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
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).catch(err => {
      console.warn('[dua sw] Some cache installs failed:', err);
    })
  );
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
  const url = e.request.url;

  // Never intercept CDN audio requests (EveryAyah, QuranCDN)
  if (url.includes('everyayah.com') || url.includes('qurancdn.com') || url.includes('gstatic.com')) {
    return;
  }

  // Cache-first for fonts and assets
  if (url.includes('/assets/fonts/') || url.includes('/assets/icons/') ||
      url.includes('.css') || url.includes('.js')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first for JSON data (may be updated)
  if (url.includes('/assets/data/') || url.includes('/assets/translations/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for HTML pages
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
