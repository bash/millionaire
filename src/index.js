const Application = require('koa')

const redis = require('./middleware/redis')
const session = require('./middleware/session')

const app = new Application()

app.use(redis())
app.use(session('session_id'))

app.use((ctx) => {
  ctx.body = { session: ctx.state.session }
})

app.listen(3000, () => {
  console.log('Listening on :3000')
})

