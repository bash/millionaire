const assert = require('assert')
const webdriver = require('selenium-webdriver')
const test = require('selenium-webdriver/testing')
const helper = require('./selenium-helper')

const until = webdriver.until
const By = webdriver.By

test.describe('Admin Backend', () => {
  let driver

  test.before(() => {
    driver = helper.getDriver()
  })

  test.after(() => {
    driver.quit()
  })

  test.it('should be able to log in', () => {
    driver.get(`${helper.baseUrl}/login`)

    const username = driver.wait(until.elementLocated(By.name('username')))
    username.sendKeys('admin')

    const password = driver.wait(until.elementLocated(By.name('password')))
    password.sendKeys('backe backe kuchen')

    const button = driver.findElement(By.css('button[type="submit"]'))

    button.click()

    const admin = driver.wait(until.urlIs(`${helper.baseUrl}/admin`), 5000)
  })

  test.it('should be able to create category', () => {
    driver.get(`${helper.baseUrl}/admin/categories`)

    const name = driver.wait(until.elementLocated(By.name('name')))
    name.sendKeys('Selenium Test')

    const button = driver.wait(until.elementLocated(By.css('button[type="submit"]')))
    button.click()

    const content = driver.wait(until.elementLocated(By.css('body')))

    driver.wait(until.elementTextContains(content, 'Selenium Test'))
  })
})
