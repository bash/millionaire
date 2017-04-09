const assert = require('assert')

module.exports.assertRejects = async function assertRejects (block, error, message) {
  try {
    await block()
  } catch (e) {
    if (!error || e instanceof error) {
      if (!message || e.message === message) {
        return
      }

      assert.fail(e.message, message, 'Unwanted error message', '==', assertRejects)
    }

    assert.fail(e.constructor, error, 'Unwanted rejection')
  }

  assert.fail(e.constructor, null, 'Missing rejection')
}
