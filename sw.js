/* Lyra demo – offline: aplikacija, slike, ikone i fontovi spremaju se u uređaj */
const VER='lyra-ad5ec56694';
const CORE=['./','index.html','demo-db.js','demo-ui.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','demo/toni.webp','demo/ema.webp','demo/malisa.webp'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{ const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){   // stranica: prvo mreža (nova verzija), bez mreže iz spremljenog
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(VER).then(c=>c.put('index.html', cp)); return res; }).catch(()=>caches.match('index.html'))); return; }
  if(u.origin===location.origin || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.host)){
    e.respondWith(caches.match(r).then(hit=>hit || fetch(r).then(res=>{ if(res && (res.ok || res.type==='opaque')){ const cp=res.clone(); caches.open(VER).then(c=>c.put(r, cp)); } return res; }))); }
});
