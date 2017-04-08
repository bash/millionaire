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

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration - minutes * 60)

  const padMinutes = minutes < 10 ? `0${minutes}` : minutes
  const padSeconds = seconds < 10 ? `0${seconds}` : seconds

  return `${padMinutes}:${padSeconds}`
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
          categories: score.categories.map(({ name }) => name).join(', '),
          duration: formatDuration(score.duration)
        })
      })

    return {
      templateName,
      template,
      data: { scores }
    }
  }
}
