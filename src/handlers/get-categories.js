/**
 *
 * @returns {function(*)}
 */
module.exports = function (pool) {
  return async (ctx) => {
    const result = await pool.query('SELECT * FROM mill.category')

    const rows = result.rows.map(({ id, name }) => {
      return { id: Number(id), name }
    })

    ctx.body = rows
  }
}
