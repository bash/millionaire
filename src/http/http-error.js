module.exports = class HttpError extends Error {
  /**
   *
   * @param {number} statusCode
   * @param {{}} detail
   */
  constructor (statusCode, detail) {
    super(statusCode)

    this.statusCode = statusCode
    this.expose = true
    this.detail = detail
  }
}
