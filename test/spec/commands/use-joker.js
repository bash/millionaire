const assert = require('assert')
const helpers = require('../helpers')
const { useJoker: _useJoker, JokerError } = require('../../../src/commands/use-joker')

describe('useJoker', () => {
  it('works', async () => {
    const useJoker = _useJoker(
      {
        hasGame (gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(true)
        },
        hasUsedJoker(gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(false)
        },
        getIncorrectAnswers(questionId) {
          assert.equal(questionId, 'foo')
          return Promise.resolve([11, 12, 13])
        },
        setUsedJoker(gameId) {
          assert.equal(gameId, '1234')
        }
      },
      {
        getCurrentQuestion() {
          return Promise.resolve('foo')
        }
      }
    )

    const answers = await useJoker('1234')

    assert.equal(answers.length, 2)
  })

  it('throws if the game is not found', async () => {
    const useJoker = _useJoker(
      {
        hasGame (gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(false)
        }
      }
    )

    await helpers.assertRejects(() => useJoker('1234'), JokerError, 'game does not exist')
  })

  it('throws if the joker has already been used', async () => {
    const useJoker = _useJoker(
      {
        hasGame (gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(true)
        },
        hasUsedJoker(gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(true)
        },
      }
    )

    await helpers.assertRejects(() => useJoker('1234'), JokerError, 'joker has already been used')
  })

  it('throws if there is no active question', async () => {
    const useJoker = _useJoker(
      {
        hasGame (gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(true)
        },
        hasUsedJoker(gameId) {
          assert.equal(gameId, '1234')
          return Promise.resolve(false)
        }
      },
      {
        getCurrentQuestion() {
          return Promise.resolve(null)
        }
      }
    )

    await helpers.assertRejects(() => useJoker('1234'), JokerError, 'no active question')
  })
})
