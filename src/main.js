import { createApp } from "vue";
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import App from "./App.vue";
import router from "./router";
import VueSSE from "vue-sse";
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

const app = createApp(App);
app.use(VueSSE);

app.use(createPinia());
app.use(router);

app.mount("#app");
