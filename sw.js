const CACHE = 'almazovqwiz-3.8.0';
const CORE = ['./', './index.html', './styles.css', './ui.css', './data/bank.js?v=3.8.0', './library.js?v=3.8.0', './ui.js?v=3.8.0', './accessibility.js?v=3.8.0', "./assets/embedded/342e10704ea6fafe.svg", "./assets/embedded/eba3f0de936c45fd.svg", "./assets/embedded/947a193dded4e358.svg", "./assets/embedded/e469184bc57447d9.svg", "./assets/embedded/8a5a2ca15415ad1a.svg", "./assets/embedded/ed90735eb1af1ae2.svg", "./assets/embedded/90b18917becb7243.svg", "./assets/embedded/af899e7512b5d18e.svg", "./assets/embedded/c07c813758f7b0a5.svg", "./assets/embedded/e583dadef8763fff.svg", "./assets/embedded/c79511455d7c10d2.svg", "./assets/embedded/f74fb3c67fb211f6.svg", "./assets/embedded/b88173556515473b.svg", "./assets/embedded/67ed24fb35a6ab7a.svg", "./assets/embedded/8dddd85d09fcf6d8.svg", "./assets/embedded/1b4b31acd393c9cb.svg", "./assets/embedded/3514bcede06f886b.svg", "./assets/embedded/44ce6f1bb546ae26.svg", "./assets/embedded/b1ff15af928757be.svg", "./assets/embedded/8c4ebd4ab9706975.svg", "./assets/embedded/0cdd00852abe3d83.svg", "./assets/embedded/9fd0bd02242fd9af.svg", "./assets/embedded/980f16988b186fb0.svg", "./assets/embedded/ae7444aaec2b2418.svg", "./assets/embedded/ac572c11f3046335.svg", "./assets/embedded/89ecdde7f2cf444b.svg", "./assets/embedded/8660273258c0a63f.svg", "./assets/embedded/a92b36d98ab0f6ba.svg", "./assets/embedded/63ed7099c0d61c8e.svg", "./assets/embedded/092cfcbc3eb7bda4.svg", "./assets/embedded/0aa9a69320cd636f.svg", "./assets/embedded/42bfd76e612a4b0c.svg", "./assets/embedded/44636b6d847e4b92.svg", "./assets/embedded/5cf01bd28a300f06.svg", "./assets/embedded/2f1b6b225548e80c.svg", "./assets/embedded/8fb4e86eb6c56314.svg", "./assets/embedded/df100dd54bec789a.svg", "./assets/embedded/9f9ac39fb4eea5e0.svg", "./assets/embedded/d3602e5f7c1108eb.svg", "./assets/embedded/1261ea6c5f72b25b.svg", "./assets/embedded/cff0664ac16c6c94.svg", "./assets/embedded/11415e4f1c97d694.svg", "./assets/embedded/c5c03b2b2e789aab.svg", "./assets/embedded/9ffbf8e1861a5f18.svg", "./assets/embedded/336b2d82831f3752.svg", "./assets/embedded/b84cdc5308cdd116.svg", "./assets/embedded/299f227904ee3506.svg", "./assets/embedded/67e008d0a2d39b80.svg", "./assets/embedded/37e319b134d97102.svg", "./assets/embedded/dbc6eb9dc5446661.svg", "./assets/embedded/6048c9e025804e19.svg", "./assets/embedded/37631b34a08ffcc3.svg", "./assets/embedded/65ef390d0f845e1b.svg", "./assets/embedded/5bcc905b6546ee56.svg", "./assets/embedded/2b32e6cdef9248f6.jpg", "./assets/embedded/af3d51f19597c032.jpg", "./assets/embedded/952af47ec46f95d4.jpg", "./assets/embedded/3642a7a2ae71d556.jpg", "./assets/embedded/4689b53f6479b825.jpg", "./assets/embedded/268ade5366531907.jpg", "./assets/embedded/6922c91b6f5e963d.jpg", "./assets/embedded/f9b7f076866c758e.jpg", "./assets/embedded/fa594f8347d51239.jpg", './app.js?v=3.8.0', './icon.svg', './manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('almazovqwiz-') && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      if (event.request.mode === 'navigate') return await cache.match('./index.html') || Response.error();
      return Response.error();
    }
  })());
});
