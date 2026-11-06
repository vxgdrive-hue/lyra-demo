/* Lyra demo – offline. Datoteke imaju verziju u imenu (?v=), pa nova objava uvijek dođe; stara se briše. */
const VER='lyra-5ef5393473';
const CORE=['./','demo-db.js?v=5ef5393473','demo-ui.js?v=5ef5393473','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','demo/toni.webp','demo/ema.webp','demo/malisa.webp'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{ const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){   // stranica: uvijek svježa s mreže, bez mreže iz spremljenog
    e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{ const cp=res.clone(); caches.open(VER).then(c=>c.put('./', cp)); return res; }).catch(()=>caches.match('./'))); return; }
  if(u.origin===location.origin || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.host)){
    e.respondWith(caches.match(r).then(hit=>hit || fetch(u.origin===location.origin ? new Request(r,{cache:'reload'}) : r).then(res=>{ if(res && (res.ok || res.type==='opaque')){ const cp=res.clone(); caches.open(VER).then(c=>c.put(r, cp)); } return res; }))); }
});
