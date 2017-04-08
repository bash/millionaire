import { fetchTemplate } from '../data/template'

/**
 *
 * @param {string} templateName
 * @returns {Loader}
 */
export function scoreboardLoader (templateName) {
  return async (params) => {
    const [template, scoreboard] = await Promise.all([
      fetchTemplate(templateName),
      Promise.resolve({})
    ])

    // TODO: actually fetch scoreboard

    return {
      templateName,
      template,
      data: { scoreboard }
    }
  }
}
