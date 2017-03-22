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
}
