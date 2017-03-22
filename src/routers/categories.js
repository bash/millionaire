const getCategories = require('../handlers/get-categories')

/**
 *
 * @returns {function(string, string)}
 */
module.exports = function (pool) {
  return (method, path) => {
    if (method !== 'GET') {
      return null
    }

    switch (path) {
      case '/api/categories':
        return getCategories(pool)
    }
  }
}
