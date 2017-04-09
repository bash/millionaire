const { queryOne, query, transaction } = require('./../database')

module.exports = class BackendRepository {
  constructor (pool) {
    this._pool = pool
  }

  /**
   *
   * @param {string} username
   * @returns {Promise<{id: string, password: string}>}
   */
  getAdminLogin (username) {
    return queryOne(
      this._pool,
      `SELECT id, password
       FROM mill.admin
       WHERE lower(username) = lower($1::varchar(255))`,
      [username]
    )
  }

  /**
   *
   * @param {string} name
   * @returns {Promise<string>}
   */
  async createCategory (name) {
    const { id } = await queryOne(
      this._pool,
      `INSERT INTO mill.category (name)
       VALUES ($1::varchar(255))
       RETURNING id`,
      [name]
    )

    return id
  }

  /**
   *
   * @returns {Promise<Array>}
   */
  getQuestions () {
    return query(
      this._pool,
      `SELECT question.id,
              question.title,
              category.name as category_name
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       ORDER BY category.name`
    )
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<{}>}
   */
  async getQuestion (questionId) {
    const question = await queryOne(
      this._pool,
      `SELECT question.id,
              question.title,
              category.id as category_id,
              category.name as category_name
       FROM mill.question AS question
       JOIN mill.category AS category ON question.category_id = category.id
       WHERE question.id = $1::bigint`,
      [questionId]
    )

    return {
      id: question.id,
      title: question.title,
      category: {
        id: question.category_id,
        name: question.category_name,
      }
    }
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise<Array>}
   */
  getAnswers (questionId) {
    return query(
      this._pool,
      `SELECT id, title, is_correct
       FROM mill.answer
       WHERE question_id = $1::bigint
       ORDER BY is_correct DESC`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} scoreId
   * @returns {Promise<void>}
   */
  hideScoreboardEntry (scoreId) {
    return this._pool.query(
      `UPDATE mill.score
       SET hidden = TRUE
       WHERE id = $1::bigint`,
      [scoreId]
    )
  }

  /**
   *
   * @param {string} questionId
   * @returns {Promise}
   */
  deleteQuestion (questionId) {
    return this._pool.query(
      `DELETE FROM mill.question
       WHERE id = $1::bigint`,
      [questionId]
    )
  }

  /**
   *
   * @param {string} categoryId
   * @param {string} title
   * @param {Array<{}>} answers
   * @returns {Promise<string>}
   */
  createQuestion (categoryId, title, answers) {
    return transaction(this._pool, async (client) => {
      const question = await queryOne(
        client,
        `INSERT INTO mill.question (title, category_id)
         VALUES ($1::varchar(255), $2::bigint)
         RETURNING id`,
        [title, categoryId]
      )

      const answerResults = answers.map(({ title, isCorrect }) => {
        return query(
          client,
          `INSERT INTO mill.answer (title, is_correct, question_id)
           VALUES ($1::varchar(255), $2::boolean, $3::bigint)`,
          [title, isCorrect, question.id]
        )
      })

      await Promise.all(answerResults)

      return question.id
    })
  }

  /**
   *
   * @param {string} id
   * @param {string} title
   * @returns {Promise}
   */
  updateAnswerTitle (id, title) {
    return this._pool.query(
      `UPDATE mill.answer
       SET title = $1::varchar(255)
       WHERE id = $2::bigint`,
      [title, id]
    )
  }

  /**
   *
   * @param {string} id
   * @param {string} category
   * @param {string} title
   * @returns {Promise}
   */
  updateQuestion (id, category, title) {
    return this._pool.query(
      `UPDATE mill.question
       SET category_id = $1::bigint, title = $2::varchar(255)
       WHERE id = $3::bigint`,
      [category, title, id]
    )
  }
}
