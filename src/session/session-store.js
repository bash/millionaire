/**
 *
 * @type {(function(string):string)}
 */
const sessionKey = (sessionId) => `session:${sessionId}`

module.exports = class SessionStore {
  /**
   *
   * @param {DataStore} dataStore
   */
  constructor (dataStore) {
    /**
     *
     * @type {DataStore}
     * @private
     */
    this._dataStore = dataStore
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<boolean>}
   */
  has (sessionId) {
    return this._dataStore.has(sessionKey(sessionId))
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<{}|null>}
   */
  async get (sessionId) {
    const rawData = await this._dataStore.get(sessionKey(sessionId))

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
    await this._dataStore.set(sessionKey(sessionId), JSON.stringify(data), { maxAge })
  }
}
