const HttpError = require('../http/http-error')

const roundRate = (rate) => Math.round(rate * 100) / 100

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

    const { correctAnswerRate } = question

    ctx.body = Object.assign(question, {
      correct_answer_rate: correctAnswerRate ? roundRate(correctAnswerRate) : null
    })
  }
}
