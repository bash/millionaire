/**
 * @typedef {(function(name: string, categories: Array<string>):Promise<string>)} CreateGame
 */

class CreateQuestionError extends Error {}

/**
 *
 * @param {Repository} repository
 * @param {BackendRepository} backendRepository
 * @returns {(function(string, string, Array<string>))}
 */
module.exports = function (repository, backendRepository) {
  return async (categoryId, title, _answers) => {
    const hasCategory = await repository.hasCategory(categoryId)

    if (title.length === 0) {
      throw new CreateQuestionError('title must not be empty')
    }

    if (!hasCategory) {
      throw new CreateQuestionError('invalid category')
    }

    if (_answers.length !== 4) {
      throw new CreateQuestionError('exactly 4 answers are required')
    }

    const answers = [
      { title: _answers[0], isCorrect: true },
      ..._answers.slice(1).map((title) => ({ title, isCorrect: false }))
    ]

    return backendRepository.createQuestion(categoryId, title, answers)
  }
}

module.exports.CreateQuestionError = CreateQuestionError
