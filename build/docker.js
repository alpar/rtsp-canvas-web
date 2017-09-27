var shell = require('shelljs')
var package = require('../package.json')
var options = process.argv;
var registryUrl = 'ccr.ccs.tencentyun.com'
var registryNamespace = 'ccr.ccs.tencentyun.com/heyi-cloud'
var code = 0

function exec(cmd) {
  console.info(`Execute command '${cmd}'`)
  code += shell.exec(cmd).code
  if (code !== 0) {
    throw new Error(`Command execute fail, exit code:${code}`)
  }
}

if (options.length < 3) {
  console.info('Usage: node docker.js [build|push]')
}

// 构建
if (options[2] === 'build') {
  exec('docker build -f ./Dockerfile -t ' + package.name + ':latest ./')
}

// 发布
if (options[2] === 'push') {
  exec('docker login --username="${REGISTRY_USERNAME}" --password="${REGISTRY_PASSWORD}" ' + registryUrl)
  // 发布 latest 版本
  exec('docker tag ' + package.name + ' ' + registryNamespace + '/' + package.name)
  exec('docker push ' + registryNamespace + '/' + package.name)
// 发布目标版本
  exec('docker tag ' + package.name + ' ' + registryNamespace + '/' + package.name + ':' + package.version)
  exec('docker push ' + registryNamespace + '/' + package.name + ':' + package.version)
}
