import Vue from 'vue'
import Router from 'vue-router'
import Hello from './../page/Hello.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: (r) => {
        require(['./../page/demo/Demo'], r)
      }
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/demo/demo',
      name: 'Demo',
      component: (r) => {
        require(['./../page/demo/Demo'], r)
      }
    },
    {
      path: '/view-management/view-video',
      name: 'ViewVideo',
      component: (r) => {
        require(['./../page/view-management/ViewVideo'], r)
      }
    }
  ]
})
