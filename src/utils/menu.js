export default [
  // 第一条为结构说明，勿删
  {
    // 节点名
    name: 'demo-test',
    // 节点图标对应的类名
    icon: 'el-icon-message',
    // 点击后需要打开的页面名
    index: 'DemoTest',
    // 是否显示当前节点
    show: false,
    // 字节点，结构和当前结构一样
    children: {},
    // 明确声明当前节点不是父节点
    parent: false,
    // 跳转页面时路径上附带的参数
    query: {
      a: 1
    }
  },
  {
    name: '首页',
    index: '/',
    show: false
  },
  {
    name: '监控管理',
    icon: 'el-icon-message',
    index: '0',
    children: [
      {
        name: '查看监控',
        index: 'ViewVideo'
      },
      {
        name: '所有监控',
        index: 'AllVideo'
      }
    ]
  },
  {
    name: '待定制',
    icon: 'el-icon-setting',
    index: '1',
    children: [
      {
        name: 'DEMO',
        index: 'Demo'
      }
    ]
  }
]
