/**
 *
 * @param {(function():Promise)} getScoreboard
 * @returns {(function(*):Promise)}
 */
module.exports = function (getScoreboard) {
  return async (ctx) => {
    ctx.body = await getScoreboard()
  }
}
