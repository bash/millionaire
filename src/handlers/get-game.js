/**
 *
 * @returns {function(*)}
 */
module.exports = function () {
  return (ctx) => {
    ctx.body = { state: 'initial' }
  }
}
