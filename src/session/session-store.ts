import { DataStore } from '../data-store'

const sessionKey = (sessionId) => `session:${sessionId}`

export class SessionStore {
  private _dataStore: DataStore

  constructor (dataStore: DataStore) {
    this._dataStore = dataStore
  }

  has (sessionId: string): Promise<boolean> {
    return this._dataStore.has(sessionKey(sessionId))
  }

  async get (sessionId: string): Promise<{}|null> {
    const rawData = await this._dataStore.get(sessionKey(sessionId))

    if (!rawData) {
      return null
    }

    return JSON.parse(rawData)
  }

  async set (sessionId: string, data: {}, maxAge: number): Promise<void> {
    return this._dataStore.set(sessionKey(sessionId), JSON.stringify(data), { maxAge })
  }
}
