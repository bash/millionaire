"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameQuestions = (gameId) => `game:${gameId}:questions`;
const gameScore = (gameId) => `game:${gameId}:score`;
class DataStore {
    constructor(redis) {
        this._redis = redis;
    }
    has(key) {
        return this._redis.exists(key);
    }
    get(key) {
        return this._redis.get(key);
    }
    async set(key, value, { maxAge } = {}) {
        await this._redis.set(key, value);
        if (maxAge) {
            await this._redis.expire(key, maxAge);
        }
    }
    setGameQuestions(gameId, questions) {
        return this._redis.rpush(gameQuestions(gameId), ...questions);
    }
    getCurrentQuestion(gameId) {
        return this._redis.lindex(gameQuestions(gameId), 0);
    }
    removeCurrentQuestion(gameId) {
        return this._redis.lpop(gameQuestions(gameId));
    }
    incrementScore(gameId) {
        return this._redis.incrby(gameScore(gameId), 30);
    }
    clearScore(gameId) {
        return this._redis.del(gameScore(gameId));
    }
    async getScore(gameId) {
        return Number.parseInt(await this._redis.get(gameScore(gameId))) || 0;
    }
    deleteGameData(gameId) {
        return this._redis.del(gameScore(gameId), gameQuestions(gameId));
    }
}
exports.DataStore = DataStore;
//# sourceMappingURL=data-store.js.map