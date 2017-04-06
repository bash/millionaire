import crypto = require('crypto')
import { SessionStore } from '../session/session-store'

function getRandomBytes (length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      err ? reject(err) : resolve(buf)
    })
  })
}

async function generateSessionId (): Promise<string> {
  const buffer = await getRandomBytes(24)

  return buffer.toString('hex')
}

async function getSessionData (store: SessionStore, sessionId: string): Promise<{}> {
  const data = await store.get(sessionId)

  if (data) {
    return data
  }

  return {}
}

export interface SessionData {
  gameId?: string
}

export class Session {
  private _id: string
  private _data: SessionData

  constructor (id: string, data: SessionData) {
    this._id = id
    this._data = data
  }

  get id (): string {
    return this._id
  }

  get maxAge (): number {
    return 30 * 24 * 3600 * 1000
  }

  get data (): SessionData {
    return this._data
  }

  get gameId (): string {
    return this.data.gameId
  }

  set gameId (value: string) {
    this.data.gameId = value
  }

  removeGameId () {
    delete this._data.gameId
  }

  static async determineSessionId (store: SessionStore, sessionId: string): Promise<string> {
    if (!sessionId) {
      return generateSessionId()
    }

    if (await store.has(sessionId)) {
      return sessionId
    }

    return generateSessionId()
  }

  static async loadSession (store: SessionStore, sessionId: string): Promise<Session> {
    const data = await getSessionData(store, sessionId)

    return new Session(sessionId, data)
  }
}
