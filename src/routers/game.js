const getGame = require('../handlers/get-game')

/**
 *
 * @returns {function(string, string)}
 */
module.exports = function () {
  return (method, path) => {
    if (method !== 'GET') {
      return null
    }

    switch (path) {
      case '/api/game':
        return getGame()
    }
  }
}
