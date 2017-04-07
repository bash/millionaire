const gameQuestions = (gameId) => `game:${gameId}:questions`
const gameScore = (gameId) => `game:${gameId}:score`

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
    return this._redis.rpush(gameQuestions(gameId), ...questions)
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<string>}
   */
  getCurrentQuestion (gameId) {
    return this._redis.lindex(gameQuestions(gameId), 0)
  }

  /**
   *
   * @returns {Promise}
   */
  removeCurrentQuestion (gameId) {
    return this._redis.lpop(gameQuestions(gameId))
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise}
   */
  incrementScore (gameId) {
    // TODO: mayday! mayday! we have a magic number!
    return this._redis.incrby(gameScore(gameId), 30)
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise}
   */
  clearScore (gameId) {
    return this._redis.del(gameScore(gameId))
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<number>}
   */
  async getScore (gameId) {
    const score = await this._redis.get(gameScore(gameId))

    return Number.parseInt(score) || 0
  }

  /**
   *
   * @param {string} gameId
   */
  deleteGameData (gameId) {
    return this._redis.del(
      gameScore(gameId),
      gameQuestions(gameId)
    )
  }
}
