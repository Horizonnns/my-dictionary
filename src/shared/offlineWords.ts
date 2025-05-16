import { openDB } from "idb";

const DB_NAME = "my-dictionary-offline";
const STORE_NAME = "words";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export async function saveOfflineWord(word: {
  word: string;
  translation: string;
}) {
  const db = await getDb();
  await db.add(STORE_NAME, word);
}

export async function getOfflineWords(): Promise<
  { word: string; translation: string }[]
> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function clearOfflineWords() {
  const db = await getDb();
  await db.clear(STORE_NAME);
}
