"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg = require("pg");
const Redis = require("ioredis");
const Repository = require("./repository");
const data_store_1 = require("./data-store");
const app_1 = require("./bootstrap/app");
const pool = new pg.Pool({
    user: 'postgres',
    database: 'postgres',
    max: 3
});
const repository = new Repository(pool);
const redis = new Redis();
const dataStore = new data_store_1.DataStore(redis);
app_1.bootstrapApp(repository, dataStore)
    .listen(3000, () => {
    console.log('Listening on :3000');
});
//# sourceMappingURL=index.js.map