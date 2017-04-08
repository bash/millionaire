const { requireAdmin } = require('../helpers/auth')

/**
 *
 * @param {(function(string))} hideScoreboardEntry
 * @returns {(function(*, string):Promise)}
 */
module.exports = function (hideScoreboardEntry) {
  return async (ctx, scoreId) => {
    requireAdmin(ctx)

    await hideScoreboardEntry(scoreId)

    ctx.body = { hidden: true }
  }
}
