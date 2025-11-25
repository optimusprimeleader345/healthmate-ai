import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

// Register PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('PWA: Service Worker registered successfully:', registration.scope);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available, notify user
                  const event = new CustomEvent('pwaUpdateAvailable');
                  window.dispatchEvent(event);
                } else {
                  // Content is cached for the first time
                  console.log('PWA: Content cached for offline use');
                }
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SYNC_COMPLETED') {
            console.log('PWA: Background sync completed');
            // Dispatch event to notify app about completed sync
            const syncEvent = new CustomEvent('backgroundSyncComplete');
            window.dispatchEvent(syncEvent);
          }
        });
      })
      .catch((error) => {
        console.error('PWA: Service Worker registration failed:', error);
      });
  });
}

// PWA Installation Handler
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Dispatch custom event to show install button
  const installEvent = new CustomEvent('pwaInstallAvailable', { detail: { prompt: deferredPrompt } });
  window.dispatchEvent(installEvent);
});

// Handle online/offline status for PWA
window.addEventListener('online', () => {
  console.log('PWA: Back online');
  const onlineEvent = new CustomEvent('pwaOnline');
  window.dispatchEvent(onlineEvent);
});

window.addEventListener('offline', () => {
  console.log('PWA: Gone offline');
  const offlineEvent = new CustomEvent('pwaOffline');
  window.dispatchEvent(offlineEvent);
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
