const { readBody } = require("./utils")

function injectHtmlPlugin ({ root, app }) {
  const script = `<script>
    window.process = {}
    process.env = {
      NODE_ENV: 'development'
    }
  </script>`
  app.use(async (ctx, next) => {
    await next()
    if (ctx.response.is('html')) {
      const res = await readBody(ctx.body)
      ctx.body = res.replace(/<head>/, `$&${script}`)
      // console.log(ctx.body)
    }
  })
}

exports.injectHtmlPlugin = injectHtmlPlugin