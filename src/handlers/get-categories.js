/**
 *
 * @param {Repository} repository
 * @returns {(function({}):Promise)}
 */
module.exports = function (repository) {
  return async (ctx) => {
    // TODO: remove direct access to repository -> use query instead
    if (ctx.query['has_questions'] === '1') {
      ctx.body = await repository.getCategoriesWithQuestions()
    } else {
      ctx.body = await repository.getCategories()
    }
  }
}
