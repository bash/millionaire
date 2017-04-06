import pg = require('pg')
import Redis = require('ioredis')
import Repository = require('./repository')
import { DataStore } from './data-store'
import { bootstrapApp } from './bootstrap/app'

const pool = new pg.Pool({
  user: 'postgres',
  database: 'postgres',
  max: 3
})

const repository = new Repository(pool)

const redis = new Redis()
const dataStore = new DataStore(redis)

bootstrapApp(repository, dataStore)
  .listen(3000, () => {
    console.log('Listening on :3000')
  })