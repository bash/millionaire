const HttpError = require('../http/http-error')

/**
 *
 * @returns {function(*)}
 */
module.exports = function (repository) {
  return async (ctx, gameId) => {
    // TODO: remove direct access to repository -> use query instead
    const game = await repository.getGameById(gameId)

    if (!game) {
      throw new HttpError(404, { error: 'game not found' })
    }

    ctx.body = game
  }
}
