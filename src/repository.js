/**
 *
 * @param {PG} pool
 * @param {(function(Client):(Promise|void))} executor
 */
function transaction (pool, executor) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        return reject(err)
      }

      const rollback = () => client.query('ROLLBACK', (err) => done(err))

      client.query('BEGIN', (err) => {
        resolve(err)
      })
    })
  })
}

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

    const categories = result.rows.map(({ id, name }) => {
      return { id: Number(id), name }
    })

    return categories
  }

  /**
   *
   * @param {number} categoryId
   * @returns {Promise<boolean>}
   */
  async hasCategory (categoryId) {
    const result = await this._pool.query('SELECT * FROM mill.category WHERE id = $1::int', [
      categoryId
    ])
  }

  async createGame (name, categories) {

  }
}
