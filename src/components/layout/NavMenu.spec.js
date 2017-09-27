import Vue from 'vue'
import NavMenu from './NavMenu.vue'

describe('NavMenu.vue', () => {
  it('应渲染菜单组件', () => {
    const Constructor = Vue.extend(NavMenu)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.el-menu').classList.contains('el-menu'))
      .to.equal(true)
  })
})
