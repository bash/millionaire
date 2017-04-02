const HttpError = require('../errors/http-error')

/**
 *
 * @param {(function(string, string))} answerQuestion
 * @returns {(function(*):Promise)}
 */
module.exports = function (answerQuestion) {
  return async (ctx) => {
    const gameId = ctx.session.gameId
    const answerId = ctx.request.body['answer_id']

    // TODO: convert error to HttpError
    const isCorrect = await answerQuestion(gameId, answerId)

    ctx.body = { is_correct: isCorrect }
  }
}
