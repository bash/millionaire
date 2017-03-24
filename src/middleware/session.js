const SessionStore = require('../session/session-store')
const Session = require('../session/session')

/**
 *
 * @param {string} cookieName
 * @returns {function(*, (function():Promise))}
 */
module.exports = (cookieName) => {
  return async (ctx, next) => {
    const store = new SessionStore(ctx.state.redis)

    const cookieValue = ctx.cookies.get(cookieName)
    const sessionId = await Session.determineSessionId(store, cookieValue)
    const session = await Session.loadSession(store, sessionId)

    ctx.state.session = session

    await next()

    await store.set(sessionId, session.data, session.maxAge)

    ctx.cookies.set(cookieName, sessionId, { maxAge: session.maxAge  })
  }
}
