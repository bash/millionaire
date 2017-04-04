import { createObjectFromArray } from '../helpers/object'

export class Route {
  /**
   *
   * @param {string} route
   */
  constructor (route) {
    this._parts = route.split('/').slice(1)

    this._params = this._parts
      .map((value, i) => [i, value])
      .filter(([_, value]) => value.indexOf('@') === 0)
      .map(([i, value]) => [i, value.substr(1)])
  }

  /**
   *
   * @param {string} path
   * @returns {boolean}
   */
  test (path) {
    const parts = path.split('/').slice(1)

    if (parts.length != this._parts.length) {
      return false
    }

    const value = parts.find((part, i) => {
      const routePart = this._parts[i]

      if (routePart[0] === '@') {
        return false
      }

      return routePart !== part
    })

    return value == null
  }

  /**
   *
   * @param {string} path
   * @returns {{}}
   */
  params (path) {
    const parts = path.split('/').slice(1)

    return createObjectFromArray(this._params
      .map(([i, name]) => [name, parts[i]]))
  }
}
