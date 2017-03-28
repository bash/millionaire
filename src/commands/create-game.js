const { shuffleArray } = require('../helpers/array')

/**
 * @typedef {(function(name: string, categories: Array<string>):Promise<string>)} CreateGame
 */

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {CreateGame}
 */
module.exports = function (repository, dataStore) {
  return async (name, categories) => {
    const gameId = await repository.createGame(name, categories)
    const questions = await repository.getGameQuestions(gameId)
    const shuffled = shuffleArray(questions)

    await dataStore.setGameQuestions(gameId, shuffled)

    return gameId
  }
}
