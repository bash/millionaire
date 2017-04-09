const assert = require('assert')
const helpers = require('../helpers')
const _createCategory = require('../../../src/commands/create-category')

describe('createCategory', () => {
  it('works', async () => {
    const createCategory = _createCategory({
      createCategory(name) {
        assert.equal(name, 'foo')
      }
    })

    await createCategory('foo')
  })

  it('throws for empty names', async () => {
    const createCategory = _createCategory({})

    await helpers.assertRejects(() => createCategory(''), _createCategory.CreateCategoryError)
  })
})
