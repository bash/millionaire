const assert = require('assert')
const helpers = require('../helpers')
const _deleteQuestion = require('../../../src/commands/delete-question')

describe('deleteQuestion', () => {
  it('works', async () => {
    const deleteQuestion = _deleteQuestion({
      deleteQuestion(id) {
        assert.equal(id, '123')
      }
    })

    await deleteQuestion('123')
  })
})
