import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/iconfont/iconfont.css';
import './assets/styles/common.less';
import axiosApi from "@/common/axiosApi"

import cookie from "vue-cookies"
import "./permission"
import codeMap from"@/libs/message"

Vue.config.productionTip = false
Vue.use(axiosApi)
Vue.use(cookie)
Vue.use(ElementUI,{ size: 'small', zIndex: 3000 })
Vue.prototype.$codeMap= codeMap;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
