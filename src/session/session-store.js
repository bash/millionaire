/**
 *
 * @type {(function(string):string)}
 */
const sessionKey = (sessionId) => `session:${sessionId}`

module.exports = class SessionStore {
  /**
   *
   * @param {Redis} redis
   */
  constructor (redis) {
    /**
     *
     * @type {Redis}
     * @private
     */
    this._redis = redis
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<boolean>}
   */
  has (sessionId) {
    return this._redis.exists(sessionKey(sessionId))
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<{}|null>}
   */
  async get (sessionId) {
    const rawData = await this._redis.get(sessionKey(sessionId))

    if (!rawData) {
      return null
    }

    return JSON.parse(rawData)
  }

  /**
   *
   * @param {string} sessionId
   * @param {{}} data
   * @param {number} maxAge
   * @returns {Promise}
   */
  async set (sessionId, data, maxAge) {
    const key = sessionKey(sessionId)

    await this._redis.set(key, JSON.stringify(data))
    await this._redis.expire(key, maxAge)
  }
}
