import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,//使用store
  template: '<App/>',
  components: { App }
})
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
