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
import PubNubVue from 'pubnub-vue';
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


Vue.use(PubNubVue, { 
    subscribeKey: 'sub-c-c02c8970-4729-4e8c-ae32-8e66935e2014',
    publishKey: 'pub-c-c78be85e-c4e2-4e03-b862-ca9674005d70' 
  }
);


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
