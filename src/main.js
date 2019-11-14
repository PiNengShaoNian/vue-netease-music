import Vue from 'vue'
import Meta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'

import global from './utils/global'
import '@/utils/rem'
import './style/index.scss'

Vue.config.productionTip = false
Vue.use(global)
Vue.use(Meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
