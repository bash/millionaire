/**
 * @template T
 * @param {Array<T>} array
 * @returns {Array<T>}
 */
module.exports.shuffleArray = function shuffleArray (array) {
  let newArray = Array.from(array)
  let m = array.length, t, i

  while (m) {
    i = Math.floor(Math.random() * m--)

    t = newArray[m]
    newArray[m] = newArray[i]
    newArray[i] = t
  }

  return newArray
}
