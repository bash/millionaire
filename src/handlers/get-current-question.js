/**
 *
 * @param {GetCurrentQuestion} getCurrentQuestion
 * @returns {function(*)}
 */
module.exports = function (getCurrentQuestion) {
  return async (ctx) => {
    ctx.body = await getCurrentQuestion(ctx.session.gameId)
  }
}
