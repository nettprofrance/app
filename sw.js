/*
 * Service worker de la coquille NETTPRO.
 * Il ne met en cache que la coquille elle-meme (page, manifeste, icones) pour
 * que l'application demarre meme sur un reseau lent. L'application Apps Script
 * affichee a l'interieur n'est jamais mise en cache : les donnees doivent
 * toujours etre fraiches.
 * Changer VERSION a chaque modification de la coquille force la mise a jour.
 */
const VERSION = 'nettpro-coquille-v4';
const FICHIERS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './01-goutte-bleue.png',
  './02-courbe-verte.png',
  './03-feuille-gauche.png',
  './04-feuille-droite.png',
  './05-etoiles.png',
  './06-texte-nettpro-france.png',
  './07-slogan-proprete-multiservices.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FICHIERS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(c => c !== VERSION).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Tout ce qui ne vient pas de la coquille (Apps Script, Google) passe
  // directement au reseau, sans cache.
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;
  // Reseau d'abord pour avoir la derniere version, cache en secours.
  event.respondWith(
    fetch(event.request)
      .then(reponse => {
        const copie = reponse.clone();
        caches.open(VERSION).then(cache => cache.put(event.request, copie));
        return reponse;
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
  );
});
