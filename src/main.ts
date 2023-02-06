import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import "mosha-vue-toastify/dist/style.css";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  FaSearch,
  BiCaretDownFill,
  MdCreateRound,
  MdModeeditoutline,
  BiArchiveFill,
  MdUnarchive,
} from "oh-vue-icons/icons";

addIcons(
  FaSearch,
  BiCaretDownFill,
  MdCreateRound,
  MdModeeditoutline,
  BiArchiveFill,
  MdUnarchive
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.component("v-icon", OhVueIcon);

app.mount("#app");
