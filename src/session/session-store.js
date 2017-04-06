"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionKey = (sessionId) => `session:${sessionId}`;
class SessionStore {
    constructor(dataStore) {
        this._dataStore = dataStore;
    }
    has(sessionId) {
        return this._dataStore.has(sessionKey(sessionId));
    }
    async get(sessionId) {
        const rawData = await this._dataStore.get(sessionKey(sessionId));
        if (!rawData) {
            return null;
        }
        return JSON.parse(rawData);
    }
    async set(sessionId, data, maxAge) {
        return this._dataStore.set(sessionKey(sessionId), JSON.stringify(data), { maxAge });
    }
}
exports.SessionStore = SessionStore;
//# sourceMappingURL=session-store.js.map