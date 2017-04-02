import { fetchTemplate } from '../data/template'

/**
 *
 * @param {string} templateName
 * @returns {function():{}}
 */
export function staticLoader (templateName) {
  return () => {
    return fetchTemplate(templateName)
      .then((template) => {
        return { templateName, template, data: {} }
      })
  }
}
