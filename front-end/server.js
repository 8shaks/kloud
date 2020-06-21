// server.js
const next = require("next")
const express = require("express")
const { createProxyMiddleware } = require('http-proxy-middleware');

;(async () => {
  const app = next({ dev: true })
  await app.prepare()

  const expressServer = express()

  // Handle requests using Next.js
  const handle = app.getRequestHandler()
  expressServer.all("*", async (req, res) => {
    await handle(req, res)
  })

  // Handle requests using the proxy middleware
  expressServer.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:5000/api',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
    })
  );
  expressServer.listen(8000, (err) => {
    if (err) {
      throw err
    }
    console.log("Server ready on port 8000")
  })
})()