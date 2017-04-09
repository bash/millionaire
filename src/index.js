#!/usr/bin/env node

const Redis = require('ioredis')
const Repository = require('./repositories/repository')
const BackendRepository = require('./repositories/backend-repository')
const DataStore = require('./data-store')
const bootstrapApp = require('./bootstrap/app')
const bootstrapDb = require('./bootstrap/database')

const pool = bootstrapDb()
const repository = new Repository(pool)
const backendRepository = new BackendRepository(pool)

const redis = new Redis()
const dataStore = new DataStore(redis)

bootstrapApp(repository, backendRepository, dataStore)
  .listen(3000, () => {
    console.log('Listening on :3000')
  })
