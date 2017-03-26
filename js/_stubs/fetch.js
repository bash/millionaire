/**
 * @typedef {{
 *  method?: string,
 *  headers?: Headers|{},
 *  body?: Blob|BufferSource|FormData|URLSearchParams|string,
 *  mode?: "cors"|"no-cors"|"same-origin",
 *  credentials?: "omit"|"same-origin"|"include",
 *  cache?: "default"|"no-store"|"reload"|"no-cache"|"force-cache"|"only-if-cached",
 *  redirect?: "follow"|"error"|"manual",
 *  referrer?: "no-referrer"|"client",
 *  referrerPolicy?: "referrer"|"no-referrer-when-downgrade"|"origin"|"origin-when-cross-origin"|"unsafe-url",
 *  integrity?: string
 * }} FetchInit
 */

/**
 *
 * @param {string|Request} input
 * @param {FetchInit} [init]
 * @returns {Promise<Response>}
 */
window.fetch = function fetch (input, init) {
}

/**
 *
 * @param {Headers|{}} [init]
 * @constructor
 */
window.Headers = function (init) {
}

/**
 *
 * @param {string} name
 * @param {string} string
 */
window.Headers.prototype.append = function (name, string) {
}

/**
 *
 * @param {string} name
 */
window.Headers.prototype.delete = function (name) {
}

/**
 *
 * @returns {Iterator<[string, string]>}
 */
window.Headers.prototype.entries = function () {
}

/**
 *
 * @param {string} name
 * @returns {string|null}
 */
window.Headers.prototype.get = function (name) {
}

/**
 *
 * @param {string} name
 * @returns {boolean}
 */
window.Headers.prototype.has = function (name) {
}

/**
 *
 * @returns {Iterator<[string]>}
 */
window.Headers.prototype.keys = function () {
}

/**
 *
 * @param {string} name
 * @param {string} value
 */
window.Headers.prototype.set = function (name, value) {
}

/**
 *
 * @returns {Iterator<[string]>}
 */
window.Headers.prototype.values = function () {
}

/**
 *
 * @param {string} name
 * @returns {Array<string>}
 * @deprecated
 */
window.Headers.prototype.getAll = function (name) {
}

window.Response = class Response {
  /**
   *
   * @param {Blob|BufferSource|FormData|ReadableStream|URLSearchParams|string} body
   * @param {{status?: number, statusText?: string, headers?: Headers|{}}} init
   */
  constructor (body, init) {
  }

  /**
   *
   * @returns {Headers}
   */
  get headers () {
  }

  /**
   *
   * @returns {boolean}
   */
  get ok () {
  }

  /**
   *
   * @returns {boolean}
   */
  get redirected () {
  }

  /**
   *
   * @returns {number}
   */
  get status () {
  }

  /**
   *
   * @returns {string}
   */
  get statusText () {
  }

  /**
   *
   * @returns {string}
   */
  get type () {
  }

  /**
   *
   * @returns {string}
   */
  get url () {
  }

  /**
   *
   * @returns {boolean}
   */
  get bodyUsed () {
  }

  /**
   *
   * @returns {Response}
   */
  clone () {
  }

  /**
   *
   * @returns {Response}
   */
  static error () {
  }

  /**
   *
   * @param {string} url
   * @param {number} [status]
   * @returns {Response}
   */
  static redirect (url, status) {
  }

  /**
   *
   * @returns {Promise<ArrayBuffer>}
   */
  arrayBuffer () {
  }

  /**
   *
   * @returns {Promise<Blob>}
   */
  blob () {
  }

  /**
   *
   * @returns {Promise<FormData>}
   */
  formData () {
  }

  /**
   *
   * @returns {Promise<null|boolean|number|string|{}|Array>}
   */
  json () {
  }

  /**
   *
   * @returns {Promise<string>}
   */
  text () {
  }
}
