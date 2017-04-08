import { fetchTemplate } from '../data/template'
import { fetchScoreboard } from '../fetch'

const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat(navigator.languages, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  return formatter.format(date)
}

/**
 *
 * @param {string} templateName
 * @returns {Loader}
 */
export function scoreboardLoader (templateName) {
  return async () => {
    const [template, _scores] = await Promise.all([
      fetchTemplate(templateName),
      fetchScoreboard()
    ])

    const scores = _scores
      .map((score) => {
        return Object.assign(score, {
          weighted_score: Math.round(score.weighted_score * 100) / 100,
          date: formatDate(new Date(score.started_at * 1000)),
          categories: score.categories.map(({ name }) => name).join(', ')
        })
      })

    return {
      templateName,
      template,
      data: { scores }
    }
  }
}
