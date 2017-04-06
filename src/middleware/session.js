"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_store_1 = require("../session/session-store");
const session_1 = require("../session/session");
const COOKIE_NAME = 'session_id';
exports.session = (dataStore) => {
    return async (ctx, next) => {
        const store = new session_store_1.SessionStore(dataStore);
        const cookieValue = ctx.cookies.get(COOKIE_NAME);
        const sessionId = await session_1.Session.determineSessionId(store, cookieValue);
        const session = await session_1.Session.loadSession(store, sessionId);
        ctx['session'] = session;
        await next();
        await store.set(sessionId, session.data, session.maxAge);
        ctx.cookies.set(COOKIE_NAME, sessionId, { maxAge: session.maxAge });
    };
};
//# sourceMappingURL=session.js.map