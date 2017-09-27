/**
 * Created by snowfox on 16-9-6.
 */
import $ from 'webpack-zepto'

/**
 * 请求池，负责请求的发出和各种细节处理
 */
export default {
  data: {
    // 请求池
    requests: [],
    // 请求当前是否遇到同步请求，是则 sync=false
    sync: true,
    sending: [],
    // 本地开发环境的代理关键路径，只在开发环境起效
    proxyPath: window.webpack_config.proxyPath,
    // 抛弃即将到来的请求，只限于push
    discardPush: false,
    // 暂停发出请求
    stop: false
  },
  /**
   * 关闭push方法，所有新插入的请求都会抛弃掉
   */
  discardPush () {
    this.data.discardPush = true
  },
  /**
   * 启用push方法
   */
  usingPush () {
    this.data.discardPush = false
  },
  /**
   * 插入一个新的请求
   * @param req
   */
  push (req) {
    if (this.data.discardPush) return
    if (this.data.sync && !this.data.stop) {
      this.send(req)
    } else {
      this.data.requests.push(req)
    }
  },
  /**
   * 停止发出缓存的请求，只是停止不会删除和抛弃
   */
  stop () {
    this.data.stop = true
  },
  /**
   * 恢复发出缓存请求
   */
  start () {
    this.data.stop = false
    this.resetSync()
  },
  /**
   * 直接发出一个请求
   * @param req
   */
  send (req) {
    let self = this
    let token = localStorage.token ? JSON.parse(localStorage.token) : {}
    this.data.sending.push(req)
    if (req.sync === false) {
      this.data.sync = false
    }
    req.type = req.type || 'get'
    $.ajax({
      type: req.type,
      // 'application/x-www-form-urlencoded'
      contentType: 'application/json;charset=UTF-8',
      url: this.data.proxyPath + req.path,
      dataType: 'json',
      data: req.type && req.type !== 'get' ? JSON.stringify(req.data) : req.data || {},
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + token.access_token,
        ...req.headers
      },
      success (data, name, request) {
        removeReq()
        // 解析头部文本为对象
        let headersText = request.getAllResponseHeaders()
        let headersList = headersText.split('\r\n')
        let headers = []
        for (let i = 0; i < headersList.length; i++) {
          if (headersList[i] === '') continue
          let index = headersList[i].indexOf(': ')
          let name = headersList[i].slice(0, index)
          if (name && name !== '') headers[headersList[i].slice(0, index)] = headersList[i].slice(index + 2)
        }
        // 创建分页对象
        // let pager = {
        //   count: parseInt(headers['x-total-count'])
        // }
        // 执行外部传入的成功处理方法
        if (typeof req.success === 'function') req.success(data, headers, request)
        if (req.sync === false && !self.data.stop) {
          self.resetSync()
        }
      },
      error (XMLHttpRequest, textStatus, errorThrown) {
        removeReq()
        let alert = true
        if (typeof req.error === 'function') {
          try {
            alert = req.error(XMLHttpRequest, textStatus, errorThrown)
          } catch (err) {
            console.error(err)
          }
        }
        if (req.errorAlert !== false && window.app && alert !== false) {
          let error = JSON.parse(XMLHttpRequest.response)
          let msg
          try {
            msg = error.msg || error.message || error.error || errorThrown
          } catch (e) {
            msg = errorThrown
          }
          window.app.$message({
            message: msg,
            type: 'error',
            duration: 5000
          })
        }
        if (req.sync === false && !self.data.stop) {
          self.resetSync()
        }
      },
      ...req.props
    })

    function removeReq () {
      for (let i = 0; i < self.data.sending.length; i++) {
        if (self.data.sending[i] === req) {
          self.data.sending.splice(i, 1)
          break
        }
      }
    }
  },
  /**
   * 重置异步请求模式，发出所有缓存请求
   */
  resetSync () {
    this.data.sync = true
    for (let i = 0; i < this.data.requests.length; i++) {
      if (this.data.sync) {
        this.send(this.data.requests.shift())
        --i
      } else {
        break
      }
    }
  },
  /**
   * 移除缓存里的所有请求
   */
  removeAll () {
    this.data.requests = []
  }
}
//
