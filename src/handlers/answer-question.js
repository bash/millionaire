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
    const { isFinished, isCorrect } = await answerQuestion(gameId, answerId)

    if (isFinished) {
      ctx.session.removeGameId()
    }

    ctx.body = {
      is_finished: isFinished,
      is_correct: isCorrect
    }
  }
}
