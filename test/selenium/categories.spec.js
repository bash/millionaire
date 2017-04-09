const assert = require('assert')
const webdriver = require('selenium-webdriver')
const test = require('selenium-webdriver/testing')
const helper = require('./helper')
const bootstrapDb = require('../../src/bootstrap/database')

const until = webdriver.until
const By = webdriver.By

test.describe('Categories', () => {
  let login = helper.login()
  let driver
  let pool

  test.before(() => {
    driver = helper.getDriver()
    pool = bootstrapDb()
    login.before()
  })

  test.after(() => {
    login.after()
    driver.quit()
    pool.query('DELETE FROM mill.category WHERE name = \'Selenium Test\'')
  })

  test.it('should be able to create category', () => {
    login.run(driver)
    driver.get(`${helper.baseUrl}/admin/categories`)

    const name = driver.wait(until.elementLocated(By.name('name')))
    name.sendKeys('Selenium Test')

    const button = driver.wait(until.elementLocated(By.css('button[type="submit"]')))
    button.click()

    const content = driver.wait(until.elementLocated(By.css('body')))

    driver.wait(until.elementTextContains(content, 'Selenium Test'))
  })
})
