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
  let questionId

  test.before(function *() {
    this.timeout(5000)

    driver = helper.getDriver()
    pool = bootstrapDb()

    yield login.before()
    yield login.run(driver)

    const result = yield pool.query('INSERT INTO mill.category (name) VALUES ($1::varchar(255)) RETURNING id', [
      `Selenium ${Date.now()}`
    ])

    categoryId = result.rows[0].id
  })

  test.after(function *() {
    this.timeout(5000)

    yield login.after()

    yield driver.quit()

    yield pool.query('DELETE FROM mill.category WHERE id = $1::bigint', [categoryId])
  })

  test.it('can create a new question', function *() {
    driver.get(`${helper.baseUrl}/admin/questions/new`)

    const category = driver.wait(until.elementLocated(By.css(`option[value="${categoryId}"]`)))
    category.click()

    const questionTitle = `Selenium ${Date.now()}`

    const title = driver.wait(until.elementLocated(By.name('title')))
    title.sendKeys(questionTitle)

    const answer0 = driver.wait(until.elementLocated(By.id('answer-0')))
    answer0.sendKeys('Foo')

    const answer1 = driver.wait(until.elementLocated(By.id('answer-1')))
    answer1.sendKeys('Bar')

    const answer2 = driver.wait(until.elementLocated(By.id('answer-2')))
    answer2.sendKeys('Baz')

    const answer3 = driver.wait(until.elementLocated(By.id('answer-3')))
    answer3.sendKeys('Qux')

    const button = driver.findElement(By.css('button[type="submit"]'))

    button.click()

    yield driver.wait(until.stalenessOf(title))

    const result = yield pool.query('SELECT id FROM mill.question WHERE title = $1::varchar(255)', [
      questionTitle
    ])

    questionId = result.rows[0].id

    yield driver.wait(until.urlIs(`${helper.baseUrl}/admin/questions/${questionId}`))
  })

  test.it('should redirect to edit page', () => {
    driver.get(`${helper.baseUrl}/admin/questions`)

    const button = driver.wait(until.elementLocated(By.css(`.question > .buttons > .basic-button`)))
    const href = button.getAttribute('href')

    button.click()

    href.then((href) => driver.wait(until.urlIs(href)))
  })

  test.it('should be able to delete question', () => {
    driver.get(`${helper.baseUrl}/admin/questions`)

    const button = driver.wait(until.elementLocated(By.css(`[name="question_id"][value="${questionId}"] ~ button`)))
    button.click()

    driver.wait(until.stalenessOf(button))
  })
})
