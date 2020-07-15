const fs = require('fs').promises
const path = require('path')
const reg = /^\/@modules\//

function resolveVue (root) {

  const compilePkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')
  const compilePkg = require(compilePkgPath)
  const compilePath = path.join(path.dirname(compilePkgPath), compilePkg.main)

  const resolvePath = (name) => path.join(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)
  const runtimeDomPath = resolvePath('runtime-dom')
  const runtimeCorePath = resolvePath('runtime-core')
  const reactivityPath = resolvePath('reactivity')
  const sharedPath = resolvePath('shared')

  return {
    compiler: compilePath, // 用于后端进行编译的文件路径
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue: runtimeDomPath
  }
}
function moduleResolvePlugin ({ app, root }) {
  const vueResolved = resolveVue(root)          // 根据当前运行vite的目录解析出一个映射表来，包含vue中所有的模块

  app.use(async (ctx, next) => {
    if (!reg.test(ctx.path)) {
      return next()
    }
    const id = ctx.path.replace(reg, '')
    console.log(id, 323)
    ctx.type = 'js' // 设置响应类型
    const content = await fs.readFile(vueResolved[id], 'utf8')
    ctx.body = content
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin