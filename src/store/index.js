import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    userInfo: {},
    status: {
      windowSizeWidth: 0,
      windowSizeType: 'max'
    },
    allVideoInfo: [],
    allVideoInfoSelect: []
  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data
    },
    setStatus (state, data) {
      state.status = data
    },
    setAllVideoInfo (state, data) {
      state.allVideoInfo = data
    },
    setAllVideoInfoSelect (state, data) {
      state.allVideoInfoSelect = data
    }
  }
})

export default store
