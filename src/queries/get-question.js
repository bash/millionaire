/**
 *
 * @param {BackendRepository} repository
 * @returns {(function():Promise<Array>)}
 */
module.exports = function (repository) {
  return async (questionId) => {
    const [question, answers] = await Promise.all([
      repository.getQuestion(questionId),
      repository.getAnswers(questionId)
    ])

    if (question == null) {
      return null
    }

    return Object.assign(question, { answers })
  }
}
