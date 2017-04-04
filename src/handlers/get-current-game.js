/**
 *
 * @returns {function(*)}
 */
module.exports = function (repository, dataStore) {
  return async (ctx) => {
    const gameId = ctx.session.gameId
    const game = await repository.getGameById(gameId)
    const score = await dataStore.getScore(gameId)

    if (game) {
      ctx.body = Object.assign({ state: 'started', score }, game)
    } else {
      ctx.body = { state: 'initial' }
    }
  }
}
