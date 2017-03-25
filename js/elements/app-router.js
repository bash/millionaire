import { EventName } from '../data/event'
import { routes, templateFile } from '../data/routes'
import { AppView } from './app-view'

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

  async _render () {
    const resolver = createResolver(this.route)
    const { templateName, fetchData } = await Promise.resolve(resolver())
    const templateUrl = templateFile(templateName)

    const [ template, data ] = await this._fetch(templateUrl, fetchData)

    // noinspection ES6ModulesDependencies,NodeModulesDependencies
    const rendered = Mustache.render(template, data)
    const view = new AppView(templateName, rendered)

    this.appendChild(view)

    await this._transitionIntoView(view)

    this._currentView = view
  }

  /**
   *
   * @param {AppView} view
   * @returns {Promise}
   * @private
   */
  async _transitionIntoView (view) {
    if (!this._currentView) {
      view.show()
      return
    }

    await this._currentView.transitionInto(view)

    this.removeChild(this._currentView)
  }

  /**
   *
   * @param {string} templateUrl
   * @param {(function():Promise<{}>)} fetchData
   * @returns {Promise.<string, {}>}
   * @private
   */
  async _fetch (templateUrl, fetchData) {
    const template = fetch(templateUrl)
      .then((resp) => resp.text())

    const data = fetchData ? Promise.resolve(fetchData()) : Promise.resolve({})

    return Promise.all([template, data])
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
