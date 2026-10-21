// 복기노트 서비스워커
// - 화면(index.html)은 항상 네트워크 먼저 → 새 버전이 올라가면 바로 반영
// - 오프라인일 때만 저장해둔 화면으로 열림
// - 기록 데이터(IndexedDB)는 여기서 절대 건드리지 않음
const CACHE = 'bokgi-note-v10';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 파일 하나가 없어도 설치가 실패하지 않게 하나씩 담는다
    await Promise.all(CORE.map((url) =>
      fetch(url, { cache: 'no-store' })
        .then((res) => (res.ok ? cache.put(url, res) : null))
        .catch(() => null)
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // OKX 등 외부 요청은 손대지 않음

  // 업데이트 확인용 요청과 앱 설치 파일(APK)은 캐시 없이 그대로 통과
  if (url.searchParams.has('__vc')) return;
  if (url.pathname.endsWith('.apk')) return;

  const isPage = req.mode === 'navigate' ||
    url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

  if (isPage) {
    // 네트워크 먼저, 실패하면(오프라인) 저장본
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put('./index.html', fresh.clone());
        }
        return fresh;
      } catch (e) {
        const cached = await caches.match('./index.html') || await caches.match('./');
        return cached || Response.error();
      }
    })());
    return;
  }

  // 아이콘·manifest 등: 저장본 먼저 보여주고 뒤에서 갱신
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
