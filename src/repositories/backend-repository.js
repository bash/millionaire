const { queryOne } = require('./../database')

// TODO: should rename to GameRepository, create separate repository for admin
module.exports = class BackendRepository {
  constructor (pool) {
    this._pool = pool
  }

  /**
   *
   * @param {string} username
   * @returns {Promise<{id: string, password: string}>}
   */
  getAdminLogin (username) {
    return queryOne(
      this._pool,
      'SELECT id, password FROM mill.admin WHERE lower(username) = lower($1::varchar(255))',
      [username]
    )
  }

  /**
   *
   * @param {string} name
   * @returns {Promise<string>}
   */
  async createCategory (name) {
    const { id } = await queryOne(
      this._pool,
      'INSERT INTO mill.category (name) VALUES ($1::varchar(255)) RETURNING id',
      [name]
    )

    return id
  }
}
