import { fetchTemplate } from '../data/template'

/**
 *
 * @param {string} templateName
 * @returns {Loader}
 */
export function staticLoader (templateName) {
  return (params) => {
    return fetchTemplate(templateName)
      .then((template) => {
        return { templateName, template, data: { params } }
      })
  }
}
