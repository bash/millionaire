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

    // disable all other questions
    Array.from(this.querySelectorAll(AnswerButton.tagSelector()))
      .filter(($button) => !$button.matches(AnswerButton.uniqueSelector(answerId)))
      .forEach(($button) => {
        $button.flipBack()
        $button.disabled = true
      })

    // submit answer
    const { isFinished, correctAnswerId } = await answerQuestion(answerId)
    // find correct answer
    const $correctAnswer = this.querySelector(AnswerButton.uniqueSelector(correctAnswerId))

    // show check icon to indicate answer is correct
    $correctAnswer.showIcon()

    // short delay to let player read correct answer
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
      .forEach(($button) => $button.flip())
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
