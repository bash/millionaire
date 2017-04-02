import { staticLoader } from '../loaders/static-loader'
import { gameLoader } from '../loaders/game-loader'

const defaultRoute = staticLoader('404')

const routes = Object.freeze({
  '/': staticLoader('landing'),
  '/game': gameLoader()
})

/**
 *
 * @param route
 * @returns {(function():Promise<{ templateName: string, template: string, data: {} }>)}
 */
export const resolve = (route) => {
  if (routes.hasOwnProperty(route)) {
    return routes[route]
  }

  return defaultRoute
}
