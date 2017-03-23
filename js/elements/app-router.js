import { EventName } from '../data/event'
import { routes, templateFile } from '../data/routes'

/**
 *
 * @param {string} path
 * @returns {(function():(string|Promise<String>))}
 */
const createResolver = (path) => {
  if (routes.hasOwnProperty(path)) {
    return routes[ path ]
  }

  return () => '404'
}

export class AppRouter extends HTMLElement {
  constructor () {
    super()

    this._onRoute = this._onRoute.bind(this)
    this._onPopState = this._onPopState.bind(this)
  }

  connectedCallback () {
    this.ownerDocument.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.defaultView.addEventListener('popstate', this._onPopState)

    this._setRouteFromPath()
  }

  disconnectedCallback () {
    this.ownerDocument.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.defaultView.removeEventListener('popstate', this._onPopState)
  }

  _render () {
    const resolver = createResolver(this.route)
    const resolved = Promise.resolve(resolver())

    const templateUrl = resolved
      .then(({ templateName }) => templateFile(templateName))

    const templateContent = templateUrl
      .then((template) => fetch(template))
      .then((resp) => resp.text())

    const data = resolved
      .then(({ fetchData }) => {
        return fetchData ? Promise.resolve(fetchData()) : Promise.resolve({})
      })

    const html = Promise.all([data, templateContent])
      .then(([data, template]) => {
        return Mustache.render(template, data)
      })

    return html.then((html) => {
      this.innerHTML = html
    })
  }

  /**
   *
   * @param {CustomEvent} event
   * @private
   */
  _onRoute (event) {
    this.setRoute(event.detail.route, event.detail.replace)
  }

  _onPopState () {
    this._setRouteFromPath()
  }

  _setRouteFromPath () {
    this._route = this.ownerDocument.defaultView.location.pathname
    this._render()
  }

  /**
   *
   * @returns {string}
   */
  get route () {
    return this._route
  }

  /**
   *
   * @param {string} value
   * @param {boolean} replace
   */
  setRoute (value, replace = false) {
    this._route = value

    if (replace) {
      this.ownerDocument.defaultView.history.replaceState(null, '', value)
    } else {
      this.ownerDocument.defaultView.history.pushState(null, '', value)
    }

    this._render()
  }
}
