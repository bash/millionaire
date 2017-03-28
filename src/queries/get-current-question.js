/**
 * @typedef {(function(gameId: string):Promise<{}>)} GetCurrentQuestion
 */

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {GetCurrentQuestion}
 */
module.exports = function (repository, dataStore) {
  return async (gameId) => {
    const questionId = await dataStore.getCurrentQuestion(gameId)

    return repository.getQuestionById(questionId)
  }
}
