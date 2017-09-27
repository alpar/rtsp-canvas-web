// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import request from './utils/request'
import {
  Message
} from 'element-ui'
Vue.prototype.request = request
Vue.config.productionTip = false

// 全局组件例句
// Vue.component('my-component',
//   {
//     template: '<div>如果我用 import 该怎么写这个全局组件</div>'
//   }
// )

Vue.prototype.$message = Message

Vue.prototype.goto = (page, query) => {
  app.$router.push({
    name: page,
    query: query
  })
}

/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})

window.app = app
