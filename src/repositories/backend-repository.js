const { fetchOne } = require('./../database')

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
    return fetchOne(
      this._pool,
      'SELECT id, password FROM mill.admin WHERE lower(username) = lower($1::varchar(255))',
      [username]
    )
  }
}
