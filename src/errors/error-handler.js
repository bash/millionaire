/**
 *
 * @param {HttpError} error
 */
module.exports = function(error) {
  if (!error) {
    return
  }

  console.log(error)

  const props = error.expose ? error.detail : 'Internal Server Error'
  const code = error.expose ? error.statusCode : 500

  const body = JSON.stringify(props)

  this.type = 'json'
  this.status = code
  this.length = Buffer.byteLength(body)
  this.res.end(body)
  this.headerSent = true
}
