const assert = require('assert')
const helpers = require('../helpers')
const _createQuestion = require('../../../src/commands/create-question')

describe('createQuestion', () => {
  it('throws if category does not exists', async () => {
    const createQuestion = _createQuestion({
      hasCategory (id) {
        assert.equal(id, '1234')
        return Promise.resolve(false)
      }
    })

    await helpers.assertRejects(() => createQuestion('1234', 'Test', ['1', '2', '3', '4']), _createQuestion.CreateQuestionError)
  })

  it('throws if the title is empty', async () => {
    const createQuestion = _createQuestion({
      hasCategory () {
        return Promise.resolve(true)
      }
    })

    await helpers.assertRejects(() => createQuestion('', '', ['1', '2', '3', '4']), _createQuestion.CreateQuestionError)
  })
})
