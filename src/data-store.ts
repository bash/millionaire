const gameQuestions = (gameId) => `game:${gameId}:questions`
const gameScore = (gameId) => `game:${gameId}:score`

export class DataStore {
  private _redis

  /**
   *
   * @param {Redis} redis
   */
  constructor (redis) {
    this._redis = redis
  }

  has (key: string): Promise<boolean> {
    return this._redis.exists(key)
  }

  get (key: string): Promise<string> {
    return this._redis.get(key)
  }

  async set (key: string, value: string, { maxAge }: { maxAge?: number } = {}) {
    await this._redis.set(key, value)

    if (maxAge) {
      await this._redis.expire(key, maxAge)
    }
  }

  setGameQuestions (gameId: string, questions: Array<string>): Promise<void> {
    return this._redis.rpush(gameQuestions(gameId), ...questions)
  }

  getCurrentQuestion (gameId: string): Promise<string> {
    return this._redis.lindex(gameQuestions(gameId), 0)
  }

  removeCurrentQuestion (gameId: string): Promise<void> {
    return this._redis.lpop(gameQuestions(gameId))
  }

  incrementScore (gameId: string): Promise<void> {
    // TODO: mayday! mayday! we have a magic number!
    return this._redis.incrby(gameScore(gameId), 30)
  }

  clearScore (gameId: string): Promise<void> {
    return this._redis.del(gameScore(gameId))
  }

  async getScore (gameId: string): Promise<number> {
    return Number.parseInt(await this._redis.get(gameScore(gameId))) || 0
  }

  deleteGameData (gameId: string): Promise<void> {
    return this._redis.del(
      gameScore(gameId),
      gameQuestions(gameId)
    )
  }
}
