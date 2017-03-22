const Application = require('koa')
const { Pool } = require('pg')
const { get } = require('koa-route')

const Repository = require('./repository')
const redis = require('./middleware/redis')
const session = require('./middleware/session')

const getGame = require('./handlers/get-game')
const getCategories = require('./handlers/get-categories')

const app = new Application()

const pool = new Pool({
  user: 'postgres',
  database: 'postgres'
})

const repository = new Repository(pool)

app.use(redis())
app.use(session('session_id'))

app.use(get('/api/game', getGame()))
app.use(get('/api/categories', getCategories(repository)))

app.listen(3000, () => {
  console.log('Listening on :3000')
})

