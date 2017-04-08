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
 * @returns {Promise<Array>}
 */
async function getSessionData (store, sessionId) {
  const data = await store.get(sessionId)

  if (data) {
    return data
  }

  return []
}

module.exports = class Session {
  /**
   *
   * @param {string} sessionId
   * @param {Map} data
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
   * @returns {Map}
   */
  get data () {
    return this._data
  }

  /**
   *
   * @returns {string}
   */
  get gameId () {
    return this._data.get('gameId')
  }

  /**
   *
   * @param {string} value
   */
  set gameId (value) {
    this._data.set('gameId', value)
  }

  removeGameId () {
    this._data.delete('gameId')
  }

  /**
   *
   * @returns {string}
   */
  get adminId () {
    return this._data.get('adminId')
  }

  /**
   *
   * @param {string} value
   */
  set adminId (value) {
    return this._data.set('adminId', value)
  }

  removeAdminId () {
    return this._data.delete('adminId')
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

    return new Session(sessionId, new Map(data))
  }
}
