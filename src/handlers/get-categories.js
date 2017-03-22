/**
 *
 * @returns {function(Repository)}
 */
module.exports = function (repository) {
  return async (ctx) => {
    ctx.body = await repository.findCategories()
  }
}
