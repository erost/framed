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
