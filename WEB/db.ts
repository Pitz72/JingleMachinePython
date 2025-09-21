import { openDB, IDBPDatabase } from 'https://esm.sh/idb@8.0.0';

const DB_NAME = 'JingleAudioDB';
const STORE_NAME = 'audioFiles';

class AudioDB {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }

  async getAudio(id: number): Promise<string | undefined> {
    return (await this.dbPromise).get(STORE_NAME, id);
  }

  async setAudio(id: number, data: string): Promise<void> {
    await (await this.dbPromise).put(STORE_NAME, data, id);
  }

  async deleteAudio(id: number): Promise<void> {
    await (await this.dbPromise).delete(STORE_NAME, id);
  }
}

export const db = new AudioDB();
