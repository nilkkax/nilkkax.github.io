// Valinnainen offline-välimuisti: verkko ensin, välimuisti varalla.
// Nosta versionumeroa aina, kun index.html päivittyy.
var C = 'lentopallo-v6';
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function(c){ return c.addAll(['./', './index.html']); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k.indexOf('lentopallo-') === 0 && k !== C; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function(r){
    if (r && r.ok){ var copy = r.clone(); caches.open(C).then(function(c){ c.put(e.request, copy); }); }
    return r;
  }).catch(function(){
    return caches.match(e.request, {ignoreSearch:true}).then(function(r){ return r || caches.match('./index.html'); });
  }));
});
