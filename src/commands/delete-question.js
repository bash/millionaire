/**
 *
 * @param {BackendRepository} repository
 */
module.exports = function (repository) {
  return async (questionId) => {
    await repository.deleteQuestion(questionId)
  }
}
