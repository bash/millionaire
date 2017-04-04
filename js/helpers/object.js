/**
 *
 * @param {Array} array
 * @returns {{}}
 */
export function createObjectFromArray (array) {
  const object = {}

  array.forEach(([key, value]) => {
    object[key] = value
  })

  return object
}
