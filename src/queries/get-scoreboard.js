/**
 *
 * @param {Repository} repository
 * @returns {(function():Promise<{}>)}
 */
module.exports = function (repository) {
  return async () => {
    const scores = await repository.getScoreboard()
    const categoriesResult = scores.map(({ game_id }) => repository.getGameCategories(game_id))
    const categories = await Promise.all(categoriesResult)

    return scores.map((score, i) => Object.assign(score, { categories: categories[i] }))
  }
}
