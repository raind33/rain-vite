const static = require('koa-static')
const path = require('path')

function serveStaticPlugin ({app, root}) {
  // vite在哪里运行 哪里就作为静态服务
  app.use(static(root))
  app.use(static(path.join(root, 'public')))
}

exports.serveStaticPlugin = serveStaticPlugin