import { EventName } from '../data/event'
import { resolve } from '../data/routes'
import { AppView } from './app-view'

export class AppRouter extends window.HTMLElement {
  constructor () {
    super()

    this._onRoute = this._onRoute.bind(this)
    this._onReloadRoute = this._onReloadRoute.bind(this)
    this._onPopState = this._onPopState.bind(this)
  }

  connectedCallback () {
    this.ownerDocument.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.addEventListener(EventName.ReloadRoute, this._onReloadRoute)
    this.ownerDocument.defaultView.addEventListener('popstate', this._onPopState)

    this._setRouteFromPath()
  }

  disconnectedCallback () {
    this.ownerDocument.addEventListener(EventName.Route, this._onRoute)
    this.ownerDocument.addEventListener(EventName.ReloadRoute, this._onReloadRoute)
    this.ownerDocument.defaultView.removeEventListener('popstate', this._onPopState)
  }

  async _render () {
    const loader = resolve(this.route)
    const { template, templateName, data } = await loader()

    // noinspection ES6ModulesDependencies,NodeModulesDependencies
    const rendered = window.Mustache.render(template, data)
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
   * @param {CustomEvent} event
   * @private
   */
  _onRoute (event) {
    this.setRoute(event.detail.route, event.detail.replace)
  }

  /**
   *
   * @private
   */
  _onReloadRoute () {
    this.setRoute(this.route, true)
  }

  /**
   *
   * @private
   */
  _onPopState () {
    this._setRouteFromPath()
  }

  /**
   *
   * @private
   */
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
