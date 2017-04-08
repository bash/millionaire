/**
 *
 * @param {BackendRepository} repository
 */
module.exports = function (repository) {
  return async (scoreId) => {
    await repository.hideScoreboardEntry(scoreId)
  }
}
