const route = require('../routers/router')

/**
 *
 * @returns {function(*, (function():Promise))}
 */
module.exports = (...routers) => {
  return async (ctx) => {
    const handler = await route(routers, ctx.request.method, ctx.request.path)

    await handler(ctx)
  }
}
