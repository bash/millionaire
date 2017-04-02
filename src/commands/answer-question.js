
class AnswerQuestionError extends Error {
}

module.exports.AnswerQuestionError = AnswerQuestionError

/**
 *
 * @param {Repository} repository
 * @param {DataStore} dataStore
 * @returns {(function(*, *))}
 */
module.exports.answerQuestion = function (repository, dataStore) {
  return async (gameId, answerId) => {
    const [answer, questionId] = await Promise.all([
      repository.getAnswer(answerId),
      dataStore.getCurrentQuestion(gameId)
    ])

    if (answer['question_id'] !== questionId) {
      throw new AnswerQuestionError('invalid answer', 'invalid_answer')
    }

    await dataStore.removeCurrentQuestion(gameId)

    return answer['is_correct']
  }
}
