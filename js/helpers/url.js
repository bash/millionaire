/**
 *
 * @param {Array<string>} strings
 * @param {Array<string>} values
 * @returns {string}
 */
export const url = (strings, ...values) => {
  const reducer = (result, string, i) => {
    let value = values[i] == null ? '' : values[i]

    return `${result}${string}${encodeURIComponent(value)}`
  }

  return strings.reduce(reducer, '')
}
