const Redis = require('ioredis')

/**
 *
 * @returns {function(*, (function():Promise))}
 */
module.exports = () => {
  return async (ctx, next) => {
    // Todo: make connection configurable
    const redis = new Redis()

    ctx.state.redis = redis

    await next()

    redis.disconnect()
  }
}
