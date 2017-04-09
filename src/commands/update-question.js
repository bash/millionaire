class UpdateQuestionError extends Error {}

/**
 *
 * @param {Repository} repository
 * @param {BackendRepository} backendRepository
 */
module.exports = function (repository, backendRepository) {
  return async (id, category, title) => {
    const hasCategory = await repository.hasCategory(category)

    if (!hasCategory) {
      throw new UpdateQuestionError('category does not exist')
    }

    if (title.length === 0) {
      throw new UpdateQuestionError('title must not be empty')
    }

    await backendRepository.updateQuestion(id, category, title)
  }
}

module.exports.UpdateAnswerTitleError = UpdateQuestionError
