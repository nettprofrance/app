/* Service worker dedie aux notifications : Firebase exige un fichier portant
 * ce nom precis a la racine du site. Il reste separe de sw.js, qui gere le
 * cache de la coquille. */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBqkTX5OVd9VzN_Ffa_U8ym8uPBo_DL3Ck',
  authDomain: 'nettpro-e35a9.firebaseapp.com',
  projectId: 'nettpro-e35a9',
  storageBucket: 'nettpro-e35a9.firebasestorage.app',
  messagingSenderId: '530092719574',
  appId: '1:530092719574:web:88a195305452dc5750b877'
});

const messagerie = firebase.messaging();

// Notification recue alors que l'application est fermee ou en arriere-plan.
messagerie.onBackgroundMessage(function(charge) {
  const n = charge.notification || {};
  self.registration.showNotification(n.title || 'NETTPRO', {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: charge.data || {},
    tag: (charge.data && charge.data.cle) || undefined
  });
});

// Toucher la notification ouvre l'application plutot qu'un nouvel onglet.
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(liste) {
      for (const c of liste) {
        if (c.url.indexOf('/app/') !== -1 && 'focus' in c) return c.focus();
      }
      return clients.openWindow('/app/');
    })
  );
});
