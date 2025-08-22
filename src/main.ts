// Style
import "./scss/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { TroisJSVuePlugin } from 'troisjs';

import App from "./App.vue";
import router from "./router";

import { i18n } from '@/i18n/index.ts'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(TroisJSVuePlugin);
app.use(i18n)

app.mount('#app')
