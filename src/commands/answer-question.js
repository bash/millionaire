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
    const [answer, questionId] = await Promise.all([
      repository.getAnswer(answerId),
      dataStore.getCurrentQuestion(gameId)
    ])

    const isCorrect = answer['is_correct']

    if (answer['question_id'] !== questionId) {
      throw new AnswerQuestionError('invalid answer', 'invalid_answer')
    }

    if (isCorrect) {
      await dataStore.incrementScore(gameId)
    } else {
      await dataStore.clearScore(gameId)
    }

    await dataStore.removeCurrentQuestion(gameId)

    const nextQuestion = await dataStore.getCurrentQuestion(gameId)
    const isFinished = (!isCorrect || !nextQuestion)

    if (isFinished) {
      await finishGame(gameId)
    }

    return { isCorrect, isFinished }
  }
}
