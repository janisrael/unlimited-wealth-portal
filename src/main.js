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



//Sentry integration
const router = new Router({

});

var appEnv = process.env.VUE_APP_ENV; //production or development. Please dont use this at local

if ( appEnv === 'production' || appEnv === 'development') {

  var appApiUrl = process.env.VUE_APP_API_URL;
  var dsn = process.env.SENTRY_DSN;
  var tracesSampleRate = 0.6;
  // var replaysSessionSampleRate = 0.1;
  // var replaysOnErrorSampleRate = 1.0;
 ///var prefix = 'stg_';
  //var app_name = "uw-portal-app";

  if (appEnv === 'production') {
    //prefix = 'prod';
  }


  //let reldate = new Date();
  //let relTimestamp = reldate / 1;

  Sentry.init({
    // Passing in `Vue` is optional, if you do not pass it `window.Vue` must be present.
    Vue: Vue,
    dsn: dsn,
  
    // This enables automatic instrumentation (highly recommended),
    // but is not necessary for purely manual usage
    // If you only want to use custom instrumentation:
    // * Remove the `BrowserTracing` integration
    // * add `Sentry.addTracingExtensions()` above your Sentry.init() call
    integrations: [new Sentry.BrowserTracing()],
  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: tracesSampleRate,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [appEnv, appApiUrl],
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

// new Vue({
//   el: "#app",
//   router,
//   // data: {
//   //   messages: [],
//   // },
// });
