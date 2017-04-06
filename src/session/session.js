"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function getRandomBytes(length) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buf) => {
            err ? reject(err) : resolve(buf);
        });
    });
}
async function generateSessionId() {
    const buffer = await getRandomBytes(24);
    return buffer.toString('hex');
}
async function getSessionData(store, sessionId) {
    const data = await store.get(sessionId);
    if (data) {
        return data;
    }
    return {};
}
class Session {
    constructor(id, data) {
        this._id = id;
        this._data = data;
    }
    get id() {
        return this._id;
    }
    get maxAge() {
        return 30 * 24 * 3600 * 1000;
    }
    get data() {
        return this._data;
    }
    get gameId() {
        return this.data.gameId;
    }
    set gameId(value) {
        this.data.gameId = value;
    }
    removeGameId() {
        delete this._data.gameId;
    }
    static async determineSessionId(store, sessionId) {
        if (!sessionId) {
            return generateSessionId();
        }
        if (await store.has(sessionId)) {
            return sessionId;
        }
        return generateSessionId();
    }
    static async loadSession(store, sessionId) {
        const data = await getSessionData(store, sessionId);
        return new Session(sessionId, data);
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map