import Vue from 'vue'
import App from './App.vue'
import '/src/assets/styles/style.css';
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
// import "@fortawesome/fontawesome-free/css/all.css";
import VueCoreVideoPlayer from 'vue-core-video-player';
import ElementUI from "element-ui";
import CountryFlag from 'vue-country-flag';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLazyload from "vue-lazyload";
import VueLazyImageLoading from "vue-lazy-image-loading";

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueAxios, axios)
Vue.use(VueLazyload);
Vue.use(VueLazyImageLoading, {
  cache: true,
});
Vue.use(VueCoreVideoPlayer)
Vue.use(ElementUI, { locale });
Vue.component('country-flag', CountryFlag)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
