/**
 *
 * @param {HttpError} error
 */
module.exports = function(error) {
  if (!error) {
    return
  }

  const { expose } = error

  if (!expose) {
    console.error(error)
  }

  const props = expose ? error.detail : 'Internal Server Error'
  const code = expose ? error.statusCode : 500

  const body = JSON.stringify(props)

  this.type = 'json'
  this.status = code
  this.length = Buffer.byteLength(body)
  this.res.end(body)
  this.headerSent = true
}
