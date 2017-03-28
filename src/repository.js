const { transaction } = require('./database')
const { toTimestamp } = require('./helpers/date')

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
    const result = await this._pool.query('SELECT * FROM mill.category')

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
   * @returns {Promise<{ id: string, has_used_joker: boolean, player_id: string, started_at: number, ended_at: number }>}
   */
  async getGameById (gameId) {
    const result = await this._pool.query('SELECT * FROM mill.game WHERE id = $1::bigint', [gameId])
    const game = result.rows[0]

    if (!game) {
      return null
    }

    return {
      id: game.id,
      has_used_joker: game.has_used_joker,
      player_id: game.player_id,
      started_at: toTimestamp(game.started_at),
      ended_at: game.ended_at ? toTimestamp(game.ended_at) : null
    }
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
    const result = await this._pool.query(
      `SELECT question.id, question.title, category.name as category
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       WHERE question.id = $1::bigint`,
      [id]
    )

    const answers = await this._pool.query(
      `SELECT id, title FROM mill.answer WHERE question_id = $1::bigint`,
      [id]
    )

    return Object.assign(result.rows[0], { answers: answers.rows })
  }
}
