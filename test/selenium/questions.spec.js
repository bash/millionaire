const assert = require('assert')
const webdriver = require('selenium-webdriver')
const test = require('selenium-webdriver/testing')
const helper = require('./helper')
const bootstrapDb = require('../../src/bootstrap/database')

const until = webdriver.until
const By = webdriver.By

test.describe('Questions', () => {
  let login = helper.login()
  let driver
  let pool
  let categoryId

  test.before(function *() {
    driver = helper.getDriver()
    pool = bootstrapDb()

    yield login.before()
    yield login.run(driver)

    const result = yield pool.query('INSERT INTO mill.category (name) VALUES (\'Selenium\') RETURNING id')

    categoryId = result.rows[0].id
  })

  test.after(function *() {
    login.after()
    driver.quit()

    yield pool.query('DELETE FROM mill.category WHERE id = $1::bigint', [categoryId])
  })

  test.it('should redirect to edit page', () => {
    driver.get(`${helper.baseUrl}/admin/questions`)

    const button = driver.wait(until.elementLocated(By.css(`.question > .buttons > .basic-button`)))
    const href = button.getAttribute('href')

    button.click()

    href.then((href) => driver.wait(until.urlIs(href)))
  })

  test.it('should be able to delete question', function *() {
    driver.get(`${helper.baseUrl}/admin/questions`)

    const result = yield pool.query('INSERT INTO mill.question (title, category_id) VALUES($1::varchar(255), $2::bigint) RETURNING id', [
      'Test?',
      categoryId
    ])

    const id = result.rows[0].id

    const button = driver.wait(until.elementLocated(By.css(`[name="question_id"][value="${id}"] ~ button`)))

    button.click()

    yield driver.wait(until.stalenessOf(driver.findElement(By.css('app-view'))))

    const testResult = yield pool.query('SELECT 1 FROM mill.question WHERE id = $1::bigint', [id])

    assert.ok(testResult.rows.length === 0)
  })
})
