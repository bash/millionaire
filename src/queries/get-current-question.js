const { shuffleArray } = require('../helpers/array')

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

    if (!questionId) {
      return
    }

    const question = await repository.getQuestionById(questionId)

    if (!question) {
      return
    }

    return Object.assign(question, {
      answers: shuffleArray(question.answers)
    })
  }
}
