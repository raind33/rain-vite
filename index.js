const Koa = require('koa')
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite')
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic')
function createServer () {
  const app = new Koa()
  const root = process.cwd()

  const context = {
    app,
    root
  }

  const resolvedPlugins = [
    // 解析import 重写路径
    moduleRewritePlugin,
    // 实现静态服务
    serveStaticPlugin
  ]
  resolvedPlugins.forEach(plugin => plugin(context))

  return app
}

module.exports = createServer