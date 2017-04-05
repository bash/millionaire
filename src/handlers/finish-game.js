const HttpError = require('../http/http-error')
const Status = require('../http/http-status')

/**
 *
 * @param {(function(string))} finishGame
 * @returns {(function(*):Promise)}
 */
module.exports = function (finishGame) {
  return async (ctx) => {
    const gameId = ctx.session.gameId

    if (!gameId) {
      throw new HttpError(Status.BadRequest, { error: 'no game currently running' })
    }

    const game = await finishGame(gameId)

    ctx.session.removeGameId()

    ctx.body = {
      duration: game.duration,
      score: game.score,
      weighted_score: game.weightedScore
    }
  }
}
