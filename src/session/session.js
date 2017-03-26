const crypto = require('crypto')

/**
 *
 * @param {number} length
 * @returns {Promise<Buffer>}
 */
function getRandomBytes (length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      err ? reject(err) : resolve(buf)
    })
  })
}

/**
 *
 * @returns {Promise<string>}
 */
async function generateSessionId () {
  const buffer = await getRandomBytes(24)

  return buffer.toString('hex')
}

/**
 *
 * @param {string} sessionId
 * @param {SessionStore} store
 * @returns {Promise<{}>}
 */
async function getSessionData (store, sessionId) {
  const data = await store.get(sessionId)

  if (data) {
    return data
  }

  return {}
}

module.exports = class Session {
  /**
   *
   * @param {string} sessionId
   * @param {{}} data
   */
  constructor (sessionId, data) {
    this._id = sessionId
    this._data = data
  }

  /**
   *
   * @returns {string}
   */
  get id () {
    return this._id
  }

  /**
   *
   * @returns {number}
   */
  get maxAge () {
    return 30 * 24 * 3600 * 1000
  }

  /**
   *
   * @returns {{}}
   */
  get data () {
    return this._data
  }

  /**
   *
   * @param {SessionStore} store
   * @param {string} sessionId
   * @returns {string}
   */
  static async determineSessionId (store, sessionId) {
    if (!sessionId) {
      return await generateSessionId()
    }

    if (await store.has(sessionId)) {
      return sessionId
    }

    return await generateSessionId()
  }

  /**
   *
   * @param {string} sessionId
   * @param {SessionStore} store
   * @returns {Promise<Session>}
   */
  static async loadSession (store, sessionId) {
    const data = await getSessionData(store, sessionId)

    return new Session(sessionId, data)
  }
}
