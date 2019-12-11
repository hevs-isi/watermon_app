import Vue from 'vue'
import App from './App'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'
import addWorldMap from './js/worldmap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';
import VueResource from 'vue-resource';
library.add(faUserSecret)

stockInit(Highcharts)
mapInit(Highcharts)
addWorldMap(Highcharts)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(HighchartsVue)
Vue.use(BootstrapVue)
Vue.config.productionTip = true
Vue.use(NProgress);
Vue.use(VueResource);
export const serverBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
