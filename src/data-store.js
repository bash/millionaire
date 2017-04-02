module.exports = class DataStore {
  /**
   *
   * @param {Redis} redis
   */
  constructor (redis) {
    this._redis = redis
  }

  /**
   *
   * @param {string} key
   * @returns {Promise.<boolean>}
   */
  has (key) {
    return this._redis.exists(key)
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<string>}
   */
  get (key) {
    return this._redis.get(key)
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   * @param {number} [maxAge]
   * @returns {Promise}
   */
  async set (key, value, { maxAge } = {}) {
    await this._redis.set(key, value)

    if (maxAge) {
      await this._redis.expire(key, maxAge)
    }
  }

  /**
   *
   * @param {string} gameId
   * @param {Array<string>} questions
   * @returns {Promise}
   */
  setGameQuestions (gameId, questions) {
    return this._redis.rpush(`game_questions:${gameId}`, ...questions)
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<string>}
   */
  getCurrentQuestion (gameId) {
    return this._redis.lindex(`game_questions:${gameId}`, 0)
  }

  /**
   *
   * @returns {Promise}
   */
  removeCurrentQuestion (gameId) {
    return this._redis.lpop(`game_questions:${gameId}`)
  }
}
