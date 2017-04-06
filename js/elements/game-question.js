import { EventName } from '../data/event'
import { AnswerButton } from './answer-button'
import { answerQuestion, useJoker, finishGame } from '../fetch'
import { gameScore } from '../data/routes'

const delay = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export class GameQuestion extends HTMLElement {
  constructor () {
    super()

    this._onSelectAnswer = this._onSelectAnswer.bind(this)
    this._onUseJoker = this._onUseJoker.bind(this)
    this._onCollectReward = this._onCollectReward.bind(this)
  }

  connectedCallback () {
    this.addEventListener(EventName.SelectAnswer, this._onSelectAnswer)
    this.addEventListener(EventName.UseJoker, this._onUseJoker)
    this.addEventListener(EventName.CollectReward, this._onCollectReward)
  }

  disconnectedCallback () {
    this.removeEventListener(EventName.SelectAnswer, this._onSelectAnswer)
    this.removeEventListener(EventName.UseJoker, this._onUseJoker)
    this.removeEventListener(EventName.CollectReward, this._onCollectReward)
  }

  async _onSelectAnswer (event) {
    const answerId = event.detail.answerId
    const button = event.target

    button.setActive()

    const { isFinished, isCorrect } = await answerQuestion(answerId)

    button.setStatus(isCorrect)

    await delay(2000)

    if (isFinished) {
      this._finishGame()
    } else {
      this.dispatchEvent(new CustomEvent(EventName.ReloadRoute, { bubbles: true }))
    }
  }

  async _onUseJoker (event) {
    const button = event.target
    const incorrectAnswers = await useJoker()

    button.disabled = true

    incorrectAnswers
      .map(({ id }) => this.querySelector(AnswerButton.uniqueSelector(id)))
      .forEach(($button) => {
        $button.disabled = true
      })
  }

  _finishGame () {
    this.dispatchEvent(new CustomEvent(EventName.Route, { bubbles: true, detail: { route: gameScore(this.gameId) } }))
  }

  _onCollectReward () {
    finishGame()
      .then(() => this._finishGame())
  }

  /**
   *
   * @returns {string}
   */
  get gameId () {
    return this.getAttribute('game-id')
  }
}
