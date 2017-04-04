import { fetchTemplate } from '../data/template'
import { fetchGame } from '../fetch'

const templateName = 'score'

/**
 *
 * @returns {Loader}
 */
export function scoreLoader () {
  return async (params) => {
    const [template, game] = await Promise.all([
      fetchTemplate(templateName),
      fetchGame(params.gameId)
    ])

    return {
      templateName,
      template,
      data: { game }
    }
  }
}
