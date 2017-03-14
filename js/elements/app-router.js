import { EventName } from '../data/event'
import { routes, templateFile } from '../data/routes'

/**
 *
 * @param {string} path
 * @returns {string}
 */
const resolve = (path) => {
  if (routes.hasOwnProperty(path)) {
    return routes[ path ]
  }

  return '404'
}

export class AppRouter extends HTMLElement {
  constructor () {
    super()

    this._onRoute = this._onRoute.bind(this)
    this._onPopState = this._onPopState.bind(this)
  }

  connectedCallback () {
    this.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.defaultView.addEventListener('popstate', this._onPopState)

    this._setRouteFromPath()
  }

  disconnectedCallback() {
    this.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.defaultView.removeEventListener('popstate', this._onPopState)
  }

  _render () {
    const name = resolve(this.route)
    const template = templateFile(name)

    fetch(template)
      .then((resp) => resp.text())
      .then((text) => {
        this.innerHTML = text
      })
  }

  /**
   *
   * @param {CustomEvent} event
   * @private
   */
  _onRoute (event) {
    this.route = event.detail.route
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
   */
  set route (value) {
    this._route = value
    this.ownerDocument.defaultView.history.pushState(null, '', value)
    this._render()
  }
}
