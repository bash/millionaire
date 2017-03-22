/**
 *
 * @param {Array<(function(method, path):((function())))>} routers
 * @param {string} method
 * @param {string} path
 */
module.exports = async function (routers, method, path) {
  for (let router of routers) {
    const result = await Promise.resolve(router(method, path))

    if (result) {
      return result
    }
  }

  return () => {}
}
