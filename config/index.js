var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable: {
    //   '/api': {
    //     // target: 'http://192.168.1.238:8080',
    //     target: 'http://mdzz.ails.cc:8000',
    //     // target: 'http://sins-home.dlinkddns.com:8088',
    //     // target: 'http://sfxh.pw:38080',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
      // '/live': {
      //   target: 'http://192.168.0.200',
      //   changeOrigin: true,
      // }
    },
    cssSourceMap: false
  }
}
