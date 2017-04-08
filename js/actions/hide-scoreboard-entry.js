import { hideScoreboardEntry } from '../fetch'

/**
 *
 * @param {FormData} form
 * @returns {Promise}
 */
export async function hideScoreboardEntryAction (form) {
  const id = form.get('score_id')

  await hideScoreboardEntry(id)

  return {
    route: '/admin/scoreboard'
  }
}
