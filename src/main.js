import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import less from 'less'
import './assets/css/common.css'
import VueCookie from 'vue-cookie'
import './icons' // icon
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(Viewer)
Vue.use(VueCookie)
Vue.use(less)

Vue.config.productionTip = false;

Vue.use(ElementUI);
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
