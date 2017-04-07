class AnswerQuestionError extends Error {
}

module.exports.AnswerQuestionError = AnswerQuestionError

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @param {(function(string))} finishGame
 * @returns {(function(*, *))}
 */
module.exports.answerQuestion = function (repository, dataStore, finishGame) {
  return async (gameId, answerId) => {
    const questionId = await dataStore.getCurrentQuestion(gameId)
    const { id: correctAnswerId } = await repository.getCorrectAnswer(questionId)

    const isCorrect = (answerId === correctAnswerId)

    if (isCorrect) {
      await dataStore.incrementScore(gameId)
    } else {
      await dataStore.clearScore(gameId)
    }

    await Promise.all([
      dataStore.removeCurrentQuestion(gameId),
      repository.createGameAnswer(gameId, answerId)
    ])

    const nextQuestion = await dataStore.getCurrentQuestion(gameId)
    const isFinished = (!isCorrect || !nextQuestion)

    if (isFinished) {
      await finishGame(gameId)
    }

    return { isCorrect, isFinished, correctAnswerId }
  }
}
