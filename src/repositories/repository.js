const { transaction, queryOne, query } = require('./../database')
const { toTimestamp } = require('./../helpers/date')

// TODO: should rename to GameRepository, create separate repository for admin
module.exports = class Repository {
  constructor (pool) {
    this._pool = pool
  }

  /**
   *
   * @returns {Promise<Array<{id: number, name: string}>>}
   */
  async getCategories () {
    const result = await this._pool.query('SELECT * FROM mill.category ORDER BY name')

    return result.rows.map(({ id, name }) => {
      return { id: id, name }
    })
  }

  /**
   *
   * @param {number} categoryId
   * @returns {Promise<boolean>}
   */
  async hasCategory (categoryId) {
    const result = await this._pool.query('SELECT * FROM mill.category WHERE id = $1::bigint', [
      categoryId
    ])

    return result.rows.length === 1
  }

  /**
   *
   * @param {string} name
   * @param {Array<id>} categories
   * @returns {Promise<string>}
   */
  createGame (name, categories) {
    return transaction(this._pool, async (client) => {
      const playerResult = await client.query(
        'INSERT INTO mill.player(name) VALUES($1::text) RETURNING id',
        [name]
      )

      const playerId = playerResult.rows[0].id

      const gameResult = await client.query(
        'INSERT INTO mill.game(player_id) VALUES($1::bigint) RETURNING id',
        [playerId]
      )

      const gameId = gameResult.rows[0].id

      for (let category of categories) {
        await client.query(
          'INSERT into mill.game_category(game_id, category_id) VALUES($1::bigint, $2::bigint)',
          [gameId, category]
        )
      }

      return gameId
    })
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<boolean>}
   */
  async hasGame (gameId) {
    const result = await this._pool.query('SELECT * FROM mill.game WHERE id = $1::bigint', [gameId])
    const game = result.rows[0]

    return (game != null)
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<{}>}
   */
  async getGameById (gameId) {
    const result = await this._pool.query(
      `SELECT game.*, score.score, score.weighted_score FROM mill.game AS game
       LEFT OUTER JOIN mill.score AS score ON score.game_id = game.id
       WHERE game.id = $1::bigint`,
      [gameId]
    )
    const game = result.rows[0]

    if (!game) {
      return null
    }

    return {
      id: game.id,
      has_used_joker: game.has_used_joker,
      player_id: game.player_id,
      started_at: toTimestamp(game.started_at),
      ended_at: game.ended_at ? toTimestamp(game.ended_at) : null,
      score: Number(game.score) || 0,
      weighted_score: Number(game.weighted_score) || 0,
      has_won: (Number(game.score) > 0)
    }
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<boolean>}
   */
  async hasUsedJoker (gameId) {
    const result = await this._pool.query('SELECT has_used_joker FROM mill.game WHERE id = $1::bigint', [gameId])
    const game = result.rows[0]

    if (!game) {
      return false
    }

    return game.has_used_joker
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<Array>}
   */
  async getGameQuestions (gameId) {
    const result = await this._pool.query(
      'SELECT id FROM mill.game_question WHERE game_id = $1::bigint',
      [gameId]
    )

    return result.rows.map(({ id }) => id)
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<{}>}
   */
  async getQuestionById (id) {
    const questionQuery = queryOne(
      this._pool,
      `SELECT
         question.id,
         question.title,
         category.name as category
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       WHERE question.id = $1::bigint`,
      [id]
    )

    const statQuery = queryOne(
      this._pool,
      'SELECT correct_answer_rate FROM mill.question_stat WHERE id = $1::bigint',
      [id]
    )

    const answersQuery = query(
      this._pool,
      `SELECT id, title FROM mill.answer WHERE question_id = $1::bigint`,
      [id]
    )

    const [question, stats, answers] = await Promise.all([questionQuery, statQuery, answersQuery])
    const correctAnswerRate = stats ? stats.correct_answer_rate : null

    if (!question) {
      return null
    }

    return Object.assign(question, { answers, correctAnswerRate })
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<Array<{}>>}
   */
  async getIncorrectAnswers (questionId) {
    const result = await this._pool.query(
      `SELECT id, title FROM mill.answer
       WHERE question_id = $1::bigint
       AND is_correct = FALSE`,
      [questionId]
    )

    return result.rows
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<{}>}
   */
  async getCorrectAnswer (questionId) {
    return queryOne(
      this._pool,
      `SELECT id FROM mill.answer
       WHERE question_id = $1::bigint AND is_correct = TRUE`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise}
   */
  async setUsedJoker (gameId) {
    return await this._pool.query(
      'UPDATE mill.game SET has_used_joker = TRUE WHERE id = $1::bigint',
      [gameId]
    )
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise}
   */
  async setEndedAt (gameId) {
    return await this._pool.query(
      'UPDATE mill.game SET ended_at = mill.utc_now() WHERE id = $1::bigint',
      [gameId]
    )
  }

  /**
   *
   * @param {string} gameId
   * @returns {Promise<number>}
   */
  async getGameDuration (gameId) {
    const result = await this._pool.query(
      'SELECT extract(epoch from (ended_at::timestamp - started_at::timestamp)) as duration FROM mill.game WHERE id = $1::bigint',
      [gameId]
    )

    return result.rows[0].duration
  }

  /**
   *
   * @param {string} gameId
   * @param {string} answerId
   * @returns {Promise<void>}
   */
  async createGameAnswer (gameId, answerId) {
    return this._pool.query(
      'INSERT INTO mill.game_answer (game_id, answer_id) VALUES($1::bigint, $2::bigint)',
      [gameId, answerId]
    )
  }

  /**
   *
   * @param {string} gameId
   * @param {number} score
   * @param {number} weightedScore
   * @returns {Promise}
   */
  writeScore (gameId, score, weightedScore) {
    return this._pool.query(
      'INSERT INTO mill.score (game_id, score, weighted_score) VALUES ($1::bigint, $2::int, $3::double precision)',
      [gameId, score, weightedScore]
    )
  }
}
