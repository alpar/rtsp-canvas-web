import request from './request'

let baseApi = {
  get (param) {
    let path
    let data
    // 判断当前是获取唯一数据还是查询数据页
    let getUniqueness = param.id !== undefined && param.id !== null && param.id !== ''
    if (getUniqueness) {
      path = `${param.url}/${param.id}`
      data = {
        full: param.full,
        ...param.data
      }
    } else {
      path = param.url
      data = {
        page: param.page,
        size: param.size,
        full: param.full,
        ...param.data
      }
    }
    request.push({
      path: path,
      type: 'get',
      data: data,
      success: (data, headers, request) => {
        if (!getUniqueness) {
          data.rows = []
          if (data._embedded) {
            let keys = Object.keys(data._embedded)
            if (keys.length > 0) {
              data.rows = data._embedded[keys[0]]
            }
          }
        }
        // 执行外部传入的成功处理方法
        if (typeof param.success === 'function') param.success(data, headers, request)
      },
      error: param.error
    })
  },
  post (param) {
    if (param.id !== undefined && param.id !== null && param.id !== '') {
      console.error('禁止对存在ID的数据进行post操作')
      return
    }
    request.push({
      path: param.url,
      type: 'post',
      data: param.data,
      success: (data, headers, request) => {
        // 执行外部传入的成功处理方法
        if (typeof param.success === 'function') param.success(data, headers, request)
      },
      error: param.error
    })
  },
  put (param) {
    if (param.id === undefined || param.id === null || param.id === '') {
      console.error('禁止对不存在ID的数据进行put操作')
      return
    }
    request.push({
      path: `${param.url}/${param.id}`,
      type: 'put',
      data: param.data,
      success: (data, headers, request) => {
        // 执行外部传入的成功处理方法
        if (typeof param.success === 'function') param.success(data, headers, request)
      },
      error: param.error
    })
  },
  postOrPut (param) {
    if (param.id !== undefined && param.id !== null && param.id !== '') {
      this.put(param)
    } else {
      this.post(param)
    }
  },
  search (param) {
    let data = {
      page: param.page,
      size: param.size,
      query: param.query,
      full: param.full,
      ...param.data
    }
    data.page = data.page || 0
    data.size = data.size || 10
    request.push({
      path: `${param.url}/_search`,
      type: 'get',
      data: data,
      success: (data, headers, request) => {
        data.rows = []
        if (data._embedded) {
          let keys = Object.keys(data._embedded)
          if (keys.length > 0) {
            data.rows = data._embedded[keys[0]]
          }
        }
        // 执行外部传入的成功处理方法
        if (typeof param.success === 'function') param.success(data, headers, request)
      },
      error: param.error
    })
  },
  delete (param) {
  }
}
// 避免编译后的源码造成过多的代码冗余
let base = {
  get (param) {
    baseApi.get({
      url: this.url,
      ...param
    })
  },
  post (param) {
    baseApi.post({
      url: this.url,
      ...param
    })
  },
  put (param) {
    baseApi.put({
      url: this.url,
      ...param
    })
  },
  postOrPut (param) {
    baseApi.postOrPut({
      url: this.url,
      ...param
    })
  },
  search (param) {
    baseApi.search({
      url: this.url,
      ...param
    })
  },
  delete (param) {
    baseApi.delete({
      url: this.url,
      ...param
    })
  }
}

let node = {
  commodity: {
    commodityBaseInfoes: {url: 'commodity/auto/commodity', ...base},
    commodityBrands: {url: 'commodity/auto/commodityBrand', ...base},
    commodityCategories: {url: 'commodity/auto/commodityCategory', ...base}
  },
  supplier: {
    supplierBaseInfoes: {url: 'supplier/auto/supplierBaseInfo', ...base}
  }
}

export default node
