module.exports = class HttpError extends Error {
  constructor (statusCode, detail) {
    super(statusCode)

    this.statusCode = statusCode
    this.expose = true
    this.detail = detail
  }
}
