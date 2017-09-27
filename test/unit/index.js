import Vue from 'vue'

Vue.config.productionTip = false

const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
