const static = require('koa-static')
const path = require('path')
const { readBody } = require('./utils')
const { parse } = require('es-module-lexer') // 解析import语法
const MagicString = require('magic-string') // 字符串具有不变性，转换成对象
function rewriteImports (source) {
  const imports = parse(source)[0]
  let magicString = new MagicString(source)
  if (imports.length) {
    imports.forEach(item => {
      const { s, e} = item
      let id = source.substring(s, e) // vue ./App
      // 当前开头是\或者.不需要重写
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`
        magicString.overwrite(s, e, id)
      }
    })
  }

  return magicString.toString()  //替换后的结果返回, 增加@modules 
  // 浏览器会再次发送请求，服务器要拦截带有@/modules前缀的请求
}
function moduleRewritePlugin ({app, root}) {
  app.use(async (ctx, next) => {
    await next()
    // 之所以能拿到ctx.body，在于中间件的洋葱模型
    // 获取流中的数据
    if (ctx.body && ctx.response.is('js')) {

      const res = await readBody(ctx.body)
      // 重写文件中内容，再返回
      const result = rewriteImports(res)
      ctx.body = result
    }

  })
}

exports.moduleRewritePlugin = moduleRewritePlugin