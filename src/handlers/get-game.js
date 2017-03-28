/**
 *
 * @returns {function(*)}
 */
module.exports = function (repository) {
  return async (ctx) => {
    const gameId = ctx.session.gameId
    const game = await repository.getGameById(gameId)

    if (game) {
      ctx.body = Object.assign({ state: 'started' }, game)
    } else {
      ctx.body = { state: 'initial' }
    }
  }
}
