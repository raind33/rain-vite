const Koa = require('koa')
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite')
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve')
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic')
const { injectHtmlPlugin } = require('./plugins/serverPluginInjectHtml')
function createServer () {
  const app = new Koa()
  const root = process.cwd()

  const context = {
    app,
    root
  }

  const resolvedPlugins = [
    injectHtmlPlugin,
    // 解析import 重写路径
    moduleRewritePlugin,
    // 解析以/@modules开头的内容，找到对应的结果
    moduleResolvePlugin,
    // 实现静态服务
    serveStaticPlugin
  ]
  resolvedPlugins.forEach(plugin => plugin(context))

  return app
}

module.exports = createServer