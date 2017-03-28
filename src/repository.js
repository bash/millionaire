const { transaction } = require('./database')
const moment = require('moment')

const toTimestamp = (date) => moment(date).unix()

module.exports = class Repository {
  constructor (pool) {
    this._pool = pool
  }

  /**
   *
   * @returns {Promise<Array<{id: number, name: string}>>}
   */
  async findCategories () {
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
   * @returns {Promise<number>}
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

  async getGameById (gameId) {
    const result = await this._pool.query('SELECT * FROM mill.game WHERE id = $1::bigint', [gameId])
    const game = result.rows[0]

    return {
      id: game.id,
      has_used_joker: game.has_used_joker,
      player_id: game.player_id,
      started_at: toTimestamp(game.started_at),
      ended_at: game.ended_at ? toTimestamp(game.ended_at) : null
    }
  }
}
