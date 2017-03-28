/**
 *
 * @param {Repository} repository
 * @returns {(function({}):Promise)}
 */
module.exports = function (repository) {
  return async (ctx) => {
    ctx.body = await repository.getCategories()
  }
}
