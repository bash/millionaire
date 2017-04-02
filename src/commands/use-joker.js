const { shuffleArray } = require('../helpers/array')

class JokerError extends Error {
}

module.exports.JokerError = JokerError

  /**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 */
module.exports.useJoker = function (repository, dataStore) {
  return async (gameId) => {
    const hasGame = await repository.hasGame(gameId)

    if (!hasGame) {
      throw new JokerError('game does not exist', 'invalid_game')
    }

    const hasUsedJoker = await repository.hasUsedJoker(gameId)

    if (hasUsedJoker) {
      throw new JokerError('joker has already been used', 'joker_used')
    }

    const questionId = await dataStore.getCurrentQuestion(gameId)

    if (!questionId) {
      throw new JokerError('no active question', 'no_question')
    }

    const answers = await repository.getIncorrectAnswers(questionId)

    await repository.setUsedJoker(gameId)

    return shuffleArray(answers).slice(0, 2)
  }
}


