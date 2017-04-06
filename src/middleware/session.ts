import koa = require('koa')
import { SessionStore } from '../session/session-store'
import { Session } from '../session/session'

const COOKIE_NAME = 'session_id'

/**
 *
 * @param {DataStore} dataStore
 * @returns {function(*, (function():Promise))}
 */
export const session = (dataStore) => {
  return async (ctx: koa.Context, next) => {
    const store = new SessionStore(dataStore)

    const cookieValue = ctx.cookies.get(COOKIE_NAME)
    const sessionId = await Session.determineSessionId(store, cookieValue)
    const session = await Session.loadSession(store, sessionId)

    ctx['session'] = session

    await next()

    await store.set(sessionId, session.data, session.maxAge)

    ctx.cookies.set(COOKIE_NAME, sessionId, { maxAge: session.maxAge })
  }
}
