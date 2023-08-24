// import 'dotenv/config'

import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import '/src/assets/styles/style.css';
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
// import "@fortawesome/fontawesome-free/css/all.css";
import VueRouter from "vue-router";
import Router from "vue-router";
// import { routes } from "./router/index";
import * as Sentry from "@sentry/vue";

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
    publishKey: 'pub-c-c78be85e-c4e2-4e03-b862-ca9674005d70',
    userId: '35467812y8u390129ui3',
    restore: true
  }
);
//Sentry integration
const router = new Router({

});

//production and development only. Please dont use this at local
var appEnv = process.env.VUE_APP_ENV; 

if ( appEnv === 'production' || appEnv === 'development') {

  var appApiUrl = process.env.VUE_APP_API_URL;
  var dsn = process.env.SENTRY_DSN;
  var tracesSampleRate = 0.6;

  Sentry.init({
    Vue: Vue,
    dsn: dsn,
    release: process.env.RELEASE,
    integrations: [new Sentry.BrowserTracing()],

    tracesSampleRate: tracesSampleRate,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [appEnv, appApiUrl + "/api"],
  });


  // Sentry.init({
  //   Vue,
  //   environment: appEnv,
  //   dsn: dsn,
  //   release: prefix + app_name + "_r-" + relTimestamp,
  //   integrations: [
  //     new Sentry.BrowserTracing({
  //       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //       tracePropagationTargets: [appEnv, appApiUrl],
  //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //     }),
  //     new Sentry.Replay(),
  //   ],
  //   // Performance Monitoring
  //   tracesSampleRate: tracesSampleRate, // Capture 100% of the transactions, reduce in production!
  //   // Session Replay
  //   replaysSessionSampleRate: replaysSessionSampleRate, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  //   replaysOnErrorSampleRate: replaysOnErrorSampleRate, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // });
} 



new Vue({
  router,
  render: h => h(App),
  store: store,
}).$mount('#app')

// Vue.component(
//   "index-component",
//   require("./App.vue").default
// );

