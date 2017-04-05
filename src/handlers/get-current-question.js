const HttpError = require('../http/http-error')

/**
 *
 * @param {GetCurrentQuestion} getCurrentQuestion
 * @returns {function(*)}
 */
module.exports = function (getCurrentQuestion) {
  return async (ctx) => {
    const question = await getCurrentQuestion(ctx.session.gameId)

    if (!question) {
      throw new HttpError(404, { error: 'no question found' })
    }

    ctx.body = question
  }
}
