import { fetchTemplate } from '../data/template'

/**
 *
 * @param {string} templateName
 * @returns {function():Promise<{ templateName: string, template: string, data: {} }>}
 */
export function staticLoader (templateName) {
  return () => {
    return fetchTemplate(templateName)
      .then((template) => {
        return { templateName, template, data: {} }
      })
  }
}
