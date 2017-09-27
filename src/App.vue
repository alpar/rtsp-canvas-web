<template>
  <div id="page-app">
    <!--<img src="./assets/logo.png">-->
    <div class="block-memu sf-box-shadow" :class="{'block-memu-min': !menuMax}">
      <div class="box-body">
        <nav-menu :menu-max="menuMax"></nav-menu>
      </div>
      <div class="box-bottom">
        &copy;<font v-show="menuMax">&nbsp;snowfox</font>
      </div>
    </div>
    <div class="block-page" :class="{'block-page-max': !menuMax}">
      <div class="box-head sf-box-shadow">
        <div class="button" @click="menuMax = !menuMax"><i class="el-icon-menu"></i></div>
      </div>
      <div class="box-view">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <template v-for="(item, key) in breadcrumbPaths">
              <el-breadcrumb-item>{{item.name}}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <router-view></router-view>
      </div>
    </div>

    <el-dialog title="用户登录" :visible.sync="showLoginBox" size="320px" :close-on-click-modal="false" id="app-login-box">
      <el-row :gutter="10" style="width: 320px;overflow-x: hidden">
        <el-col :span="24" class="input-box">
          <el-input placeholder="用户名" v-model="login.name" @change="login.showAlert = false"></el-input>
        </el-col>
        <el-col :span="24" class="input-box">
          <div @keyup.enter="getToken(undefined)">
            <el-input placeholder="密码" v-model="login.passwd" @change="login.showAlert = false"
                      type="password" @keydown.enter="getToken(undefined)"></el-input>
          </div>
        </el-col>

        <el-col :span="24" class="input-box" style="text-align: center" v-show="login.showAlert">
          <font color="#FF4A35" v-text="login.alert"></font>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getToken(undefined)">登录</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import $ from 'webpack-zepto'
  import {Button, Row, Col, Breadcrumb, BreadcrumbItem, Dialog, Input} from 'element-ui'
  import menuData from './utils/menu'
  import NavMenu from './components/layout/NavMenu.vue'
  import store from './store/index'
  import request from './utils/request'

  export default {
    name: 'app',
    components: {
      ElButton: Button,
      ElRow: Row,
      ElCol: Col,
      ElBreadcrumb: Breadcrumb,
      ElBreadcrumbItem: BreadcrumbItem,
      ElDialog: Dialog,
      ElInput: Input,
      NavMenu
    },
    data () {
      return {
        menuMax: true,
        breadcrumbPaths: [],
        showLoginBox: false,
        login: {
          name: '',
          passwd: '',
          showAlert: false,
          alert: ''
        }
      }
    },
    computed: {
      userInfo () {
        // 从vuex获取用户信息
        return store.state.userInfo
      }
    },
    created () {
      let self = this
      // 移除登录状态信息
      // localStorage.removeItem('token')
      // 暂停所有请求发出
      this.request.stop()
      // 判断需要登录还是直接取帐号信息
      if (localStorage.token === undefined) {
        this.showLoginBox = true
      } else {
        this.getAccount()
      }
      // 检测窗口大小改变，当窗口大小改变后记录到store
      $(window).resize(() => {
        setSizeStatus()
      })
      let setSizeStatus = () => {
        let width = window.innerWidth
        let type
        if (width < 768) {
          self.menuMax = false
          type = 'min'
        } else {
          type = 'max'
        }
        let status = {...store.state.userInfo}
        status.windowSizeWidth = width
        status.windowSizeType = type
        store.commit('setStatus', status)
      }
      setSizeStatus()
      // 拿所有摄像头信息
      request.push({
        path: 'permission/api/getAllVideoInfo',
        type: 'get',
        success: (data, headers, request) => {
          let selectList = []
          for (let i in data) {
            for (let n in data[i].node) {
              for (let m in data[i].node[n].node) {
                selectList.push({
                  ...data[i].node[n].node[m],
                  showName: `${data[i].node[n].name}--${data[i].node[n].node[m].name}`
                })
              }
            }
          }
          store.state.allVideoInfoSelect = selectList
          store.state.allVideoInfo = data
        }
      })
    },
    methods: {
      setMenuSize () {
      },
      /**
       * 获取token
       * @param refreshToken
       */
      getToken (refreshToken) {
        let self = this
        if (this.login.name.length < 1 && refreshToken === undefined) {
          this.login.alert = '请输入用户名'
          this.login.showAlert = true
          return
        }
        if (this.login.passwd.length < 1 && refreshToken === undefined) {
          this.login.alert = '请输入用户名'
          this.login.showAlert = true
          return
        }
        let data = refreshToken ? {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        } : {
          grant_type: 'password',
          username: self.login.name,
          password: self.login.passwd
        }
        this.request.send({
          path: window.background === 'node' ? 'permission/api/token' : 'uaa/oauth/token',
          type: 'post',
          headers: {
            'Authorization': 'Basic d2ViX2FwcDo='
          },
          props: {
            contentType: 'application/x-www-form-urlencoded',
            data: data
          },
          success (data) {
            data.time = new Date().getTime()
            localStorage.token = JSON.stringify(data)
            self.getAccount()
          },
          error (XMLHttpRequest, textStatus, errorThrown) {
            localStorage.removeItem('token')
            if (errorThrown === 'Bad Request') {
              self.login.alert = '帐号或密码错误'
            } else if (errorThrown === 'Unauthorized') {
              self.login.alert = '登录状态过期'
            } else {
              self.login.alert = errorThrown
            }
            self.login.showAlert = true
            self.showLoginBox = true
          },
          errorAlert: false
        })
      },
      /**
       * 获取帐号信息
       */
      getAccount () {
        let self = this
        let token = JSON.parse(localStorage.token)
        let accessToken = token.access_token
        // 判断token是否过期须刷新(提前16秒为过期, 其中三秒为自动更新程序的容错期, 避免剩下15s然后执行定时器时只剩下14s)
        if (new Date() - new Date(token.time) > (token.expires_in - 15 - 3) * 1000) {
          self.getToken(token.refresh_token)
          return
        } else {
          // token到期后自动更新token
          setTimeout(() => {
            self.getToken(token.refresh_token)
          }, (token.expires_in - 15) * 1000 - (new Date() - new Date(token.time)))
        }
        this.request.send({
          path: window.background === 'node' ? 'permission/api/account' : 'uaa/api/account',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          success (data) {
            self.showLoginBox = false
            // 把用户信息放进vuex
            store.commit('setUserInfo', data)
            // console.log(store.state.userInfo)
            // 恢复请求正常发出
            self.request.start()
          },
          error (XMLHttpRequest, textStatus, errorThrown) {
            if (errorThrown === 'Unauthorized') {
              self.login.alert = '授权失败，请重新登录'
            } else {
              self.login.alert = errorThrown
            }
            self.login.showAlert = true
            self.showLoginBox = true
          },
          errorAlert: false
        })
      }
    },
    watch: {
      '$route' (route) {
        let sefl = this
        sefl.breadcrumbPaths = [{name: '无法路由页面'}]
        let myPaths = []
        // 当路由改变并且web状态处于移动端时关闭导航菜单
        if (store.state.status.windowSizeType === 'min') {
          this.menuMax = false
        }
        // 迭代器，把现在的路径迭代导航菜单配置文件，找到目前所在的路径对应的中文名称
        function recursion (data, paths) {
          paths = paths || []
          // 遍历当前节点所有children
          for (let i = 0; i < data.length; i++) {
            // 判断当前节点的名称是不是等于当前路由名称
            if (data[i].index && data[i].index === route.name) {
              // 判断路由的query和当前节点的query是否相等
              let equal = true
              // 如果当前节点的query为空则不需要进行判断
              if (data[i].query) {
                let keys = Object.keys(data[i].query)
                for (let n = 0; n < keys.length; n++) {
                  let d = data[i].query[keys[n]]
                  // 判断当前query值是否相等
                  if (d !== route.query[keys[n]]) {
                    if (d !== undefined && d.toString() === route.query[keys[n]]) {
                      continue
                    }
                    equal = false
                    break
                  }
                }
              }
              // 如果query值不相等则当前路由并不是当前节点
              if (!equal) continue
              // 当前路由等于当前节点时，把路径插入到面包稍，结束迭代
              paths.push({name: data[i].name})
              myPaths = paths
              // sefl.breadcrumbPaths = paths
              return true
            } else if (data[i].children) { // 如果当前节点不等于当前路由名称则判断当前节点是不是还有字节点，是则迭代下去
              if (recursion(data[i].children, [...paths, {name: data[i].name}])) return true
            }
          }
          return false
        }

        recursion(menuData)
        if (myPaths.length < 1) {
          if (route.matched !== undefined) {
            let title = route.matched[0].components.default.title
            if (title) {
              sefl.breadcrumbPaths = [{name: title}]
            }
          }
        } else {
          sefl.breadcrumbPaths = myPaths
        }
      },
      menuMax (val) {
        if (val) {
          $('.block-memu .el-submenu__icon-arrow', this.$el).css('display', 'block')
        } else {
          $('.block-memu .el-submenu__icon-arrow', this.$el).css('display', 'none')
        }
      },
      showLoginBox (val) {
        if (val) {
          this.$nextTick(() => {
            $('#app-login-box input').eq(0).focus()
          })
        }
      }
    }
  }
</script>

<style scoped>

  @media screen and (min-width: 767px) {
    .block-memu {
      width: 200px;
      height: 100%;
    }

    .block-page {
      width: calc(100% - 200px);
      position: relative;
    }

    .block-memu-min {
      width: 50px;
      display: none;
    }

    .block-page-max {
      /*width: calc(100% - 50px);*/
      width: 100%;
    }
  }

  @media screen and (max-width: 768px) {
    .block-memu {
      width: 100%;
      height: calc(100% - 50px);
      position: absolute;
      top: 50px;
      z-index: 12;
    }

    .block-page {
      width: 100%;
      position: absolute;
      top: 0px;
      /*z-index: 10;*/
    }

    .block-page-max {
      width: 100%;
    }

    .block-memu-min {
      width: 100%;
      display: none;
    }
  }

  .block-memu {
    float: left;
    background-color: #3e3e3e;
    position: relative;
  }

  .block-page {
    height: 100%;
    float: left;
  }

  .box-head {
    width: 100%;
    height: 45px;
    background-color: #fff;
    float: left;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
  }

  .box-view {
    width: 100%;
    height: calc(100% - 45px);
    margin-top: 45px;
    float: left;
    /*background-color: #FAFAFA;*/
    background-color: #F9F9F9;
    overflow-x: hidden;
  }

  .box-view .breadcrumb {
    width: calc(100% - 20px);
    height: 13px;
    padding-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .block-memu .box-body {
    width: 100%;
    height: calc(100% - 38px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .block-memu .box-bottom {
    width: 100%;
    height: 38px;
    line-height: 38px;
    background-color: #494949;
    color: #999;
    text-align: center;
  }

  .block-page .box-head .button {
    background-color: transparent;
    border: 0px;
    color: #999;
    line-height: 45px;
    width: 45px;
    text-align: center;
    font-size: 20px;
  }

  .block-page .box-head .button:hover {
    background-color: #E8E8E8;
  }

  .input-box {
    margin-top: 10px;
  }
</style>

<style>
  html, body {
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
  }

  #page-app {
    width: 100%;
    height: 100%;
  }

  #page-app .block-memu .el-menu {
    background-color: transparent;
  }

  #page-app .el-menu-item, .el-submenu__title {
    color: #809BBF;
  }

  #page-app .el-submenu.is-active .el-submenu__title,
  #page-app .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
  #page-app .el-menu-item.is-active {
    color: #108ee9;
  }

  #page-app.el-submenu .el-menu-item:hover,
  #page-app .el-submenu__title:hover {
    background-color: #494949;
  }

  #page-app .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item:hover,
  #page-app .el-menu--horizontal.el-menu--dark .el-submenu .el-submenu-title:hover,
  #page-app .el-menu-item:hover {
    background-color: #494949;
  }

  .com-page {
    width: calc(100% - 40px);
    margin: 10px;
    padding: 10px;
    background-color: #fff;
  }

  .sf-box-up {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .sf-box-cen {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .sf-box-down {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: flex-end;
    align-items: flex-end;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .sf-box-left {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
  }

  .sf-box-right {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
  }

  .sf-box-shadow {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  }

  .max-w {
    width: 100%;
  }

  .max {
    width: 100%;
    height: 100%;
  }
</style>
