/**
 *
 * @param {BackendRepository} repository
 * @returns {(function():Promise<Array>)}
 */
module.exports = function (repository) {
  return async () => {
    const questions = await repository.getQuestions()
    const answerResults = questions.map(({ id }) => repository.getAnswers(id))
    const answers = await Promise.all(answerResults)

    return questions.map((question, i) => {
      return Object.assign(question, {
        answers: answers[i]
      })
    })
  }
}
