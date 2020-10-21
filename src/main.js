import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/ant-design-vue.js'
import VueScreenSize from 'vue-screen-size'
import './styles/index.less'
import 'vue2-toast/lib/toast.css'
import Toast from "vue2-toast/src";
import './registerServiceWorker'

Vue.use(VueScreenSize)
Vue.use(Toast)

Vue.config.productionTip = false
Vue.prototype.$mobileSize = 760

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
