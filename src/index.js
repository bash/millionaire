const Application = require('koa')
const { Pool } = require('pg')
const { get, post } = require('koa-route')
const bodyParser = require('koa-bodyparser')

const Repository = require('./repository')
const redis = require('./middleware/redis')
const session = require('./middleware/session')
const errorHandler = require('./errors/error-handler')

const getGame = require('./handlers/get-game')
const getCategories = require('./handlers/get-categories')
const createGame = require('./handlers/create-game')

const app = new Application()

app.context.onerror = errorHandler

const pool = new Pool({
  user: 'postgres',
  database: 'postgres'
})

const repository = new Repository(pool)

app.use(redis())
app.use(session('session_id'))
app.use(bodyParser())

app.use(get('/api/game', getGame(repository)))
app.use(get('/api/categories', getCategories(repository)))
app.use(post('/api/games', createGame(repository)))

app.listen(3000, () => {
  console.log('Listening on :3000')
})
