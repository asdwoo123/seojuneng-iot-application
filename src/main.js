import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/ant-design-vue.js'
import VueScreenSize from 'vue-screen-size'

Vue.use(VueScreenSize)

Vue.config.productionTip = false
Vue.prototype.$mobileSize = 760

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
