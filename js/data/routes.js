import { staticLoader } from '../loaders/static-loader'
import { gameLoader } from '../loaders/game-loader'
import { Route } from '../routing/route'

/**
 *
 * @typedef {(function(params: {}):Promise<{ templateName: string, template: string, data: {} }>)} Loader
 */

/**
 *
 * @type {Loader}
 */
const defaultRoute = staticLoader('404')

/**
 *
 * @type {[{route: Route, loader: Loader}]}
 */
const routes = [
  {
    route: new Route('/'),
    loader: staticLoader('landing'),
  },
  {
    route: new Route('/game'),
    loader: gameLoader()
  },
  {
    route: new Route('/score/@gameId'),
    loader: staticLoader('score')
  }
]

/**
 *
 * @param {string} path
 * @returns {(function():Promise<{ templateName: string, template: string, data: {}}>)}
 */
export const resolve = (path) => {
  const result = routes.find(({ route }) => route.test(path))

  if (!result) {
    return defaultRoute.bind(null)
  }

  const { route, loader } = result

  return loader.bind(null, route.params(path))
}
