/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 */
module.exports = function (repository, dataStore) {
  return async (gameId) => {
    await repository.setEndedAt(gameId)

    const duration = await repository.getGameDuration(gameId)
    const score = await dataStore.getScore(gameId)
    const weightedScore = score / duration

    await repository.writeScore(gameId, score, weightedScore)

    await dataStore.deleteGameData(gameId)

    return { duration, score, weightedScore }
  }
}
