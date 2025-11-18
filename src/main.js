/**
 * Application entry point
 */

import { createApp } from 'vue';
import VueKonva from 'vue-konva';
import App from './App.vue';
import './assets/styles/main.css';

const app = createApp(App);
app.use(VueKonva);
app.mount('#app');

/**
 * Register service worker for PWA support
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
