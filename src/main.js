// import 'dotenv/config'

import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import '/src/assets/styles/style.css';
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
// import "@fortawesome/fontawesome-free/css/all.css";
import VueRouter from "vue-router";
// import { routes } from "./router/index";

import VueCoreVideoPlayer from 'vue-core-video-player';
import ElementUI from "element-ui";
import CountryFlag from 'vue-country-flag';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLazyload from "vue-lazyload";
import VueLazyImageLoading from "vue-lazy-image-loading";

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// require('dotenv').config();


/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueRouter);

Vue.use(VueLazyload);
Vue.use(VueLazyImageLoading, {
  cache: true,
});
Vue.use(VueCoreVideoPlayer)
Vue.use(ElementUI, { locale });
Vue.component('country-flag', CountryFlag)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
// const router = new VueRouter({
//   routes,
//   mode: "hash",
// });

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')

// Vue.component(
//   "index-component",
//   require("./App.vue").default
// );

// new Vue({
//   el: "#app",
//   router,
//   // data: {
//   //   messages: [],
//   // },
// });
