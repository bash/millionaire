const { shuffleArray } = require('../helpers/array')

export class JokerError extends Error {
}

export interface UseJokerCommand {
  (gameId: string): Promise<Array<string>>
}

export function useJoker (repository, dataStore): UseJokerCommand {
  return async (gameId) => {
    const hasGame = await repository.hasGame(gameId)

    if (!hasGame) {
      throw new JokerError('game does not exist')
    }

    const hasUsedJoker = await repository.hasUsedJoker(gameId)

    if (hasUsedJoker) {
      throw new JokerError('joker has already been used')
    }

    const questionId = await dataStore.getCurrentQuestion(gameId)

    if (!questionId) {
      throw new JokerError('no active question')
    }

    const answers = await repository.getIncorrectAnswers(questionId)

    await repository.setUsedJoker(gameId)

    return shuffleArray(answers).slice(0, 2)
  }
}