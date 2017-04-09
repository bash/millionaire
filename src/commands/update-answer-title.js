class UpdateAnswerTitleError extends Error {}

/**
 *
 * @param {BackendRepository} repository
 */
module.exports = function (repository) {
  return async (id, title) => {
    if (title.length === 0) {
      throw new UpdateAnswerTitleError('title must not be empty')
    }

    await repository.updateAnswerTitle(id, title)
  }
}

module.exports.UpdateAnswerTitleError = UpdateAnswerTitleError
