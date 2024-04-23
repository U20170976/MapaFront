/*
 =========================================================
 * Vue Black Dashboard - v1.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import VueConfirmDialog from "vue-confirm-dialog";
import VuejsDialog from "vuejs-dialog";

import RouterPrefetch from 'vue-router-prefetch'
import App from "./App";
// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router/index";
import store from './store/index';

import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n";
import './registerServiceWorker';
import BootstrapVue from 'bootstrap-vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import VueUploadComponent from 'vue-upload-component';

//
Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(Vuex);
Vue.use(VueConfirmDialog);
Vue.use(VuejsDialog);
Vue.use(VueAxios, axios);
Vue.use(VueMapbox, { mapboxgl: Mapbox });
Vue.use(VueUploadComponent);

// Install BootstrapVue
Vue.use(BootstrapVue)


/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  store: store,
  render: h => h(App)
}).$mount("#app");
