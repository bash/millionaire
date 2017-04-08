import { fetchTemplate } from '../data/template'
import { fetchCategories } from '../fetch'

const templateName = 'manage-categories'

/**
 *
 * @returns {Loader}
 */
export function categoriesLoader () {
  return async (params) => {
    const [template, categories] = await Promise.all([
      fetchTemplate(templateName),
      fetchCategories()
    ])

    return {
      templateName,
      template,
      data: { categories }
    }
  }
}
