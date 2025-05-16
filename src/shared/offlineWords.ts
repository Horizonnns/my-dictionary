import { openDB } from "idb";

const DB_NAME = "my-dictionary-offline";
const STORE_WORDS = "words";
const STORE_EDITS = "edits";
const STORE_DELETES = "deletes";

async function getDb() {
  return openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(STORE_WORDS)) {
        db.createObjectStore(STORE_WORDS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STORE_EDITS)) {
          db.createObjectStore(STORE_EDITS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_DELETES)) {
          db.createObjectStore(STORE_DELETES, { keyPath: "id" });
        }
      }
    },
  });
}

export async function saveOfflineWord(word: {
  word: string;
  translation: string;
}) {
  const db = await getDb();
  const id = `offline-${Date.now()}`;
  await db.add(STORE_WORDS, { id, ...word });
}

export async function getOfflineWords(): Promise<
  { word: string; translation: string }[]
> {
  const db = await getDb();
  return db.getAll(STORE_WORDS);
}

export async function clearOfflineWords() {
  const db = await getDb();
  await db.clear(STORE_WORDS);
}

export async function saveOfflineEditWord(
  id: string,
  word: string,
  translation: string
) {
  const db = await getDb();
  await db.put(STORE_EDITS, { id, word, translation });
}

export async function getOfflineEdits(): Promise<
  { id: string; word: string; translation: string }[]
> {
  const db = await getDb();
  return db.getAll(STORE_EDITS);
}

export async function clearOfflineEdits() {
  const db = await getDb();
  await db.clear(STORE_EDITS);
}

export async function saveOfflineDeleteWord(id: string) {
  const db = await getDb();
  await db.put(STORE_DELETES, { id });
}

export async function getOfflineDeletes(): Promise<{ id: string }[]> {
  const db = await getDb();
  return db.getAll(STORE_DELETES);
}

export async function clearOfflineDeletes() {
  const db = await getDb();
  await db.clear(STORE_DELETES);
}

export async function saveWordsToIndexedDB(
  words: { id: string; word: string; translation: string }[]
) {
  const db = await getDb();
  await db.clear(STORE_WORDS);
  for (const word of words) {
    await db.put(STORE_WORDS, word);
  }
}

export async function removeOfflineWordById(id: string) {
  const db = await getDb();
  await db.delete(STORE_WORDS, id);
}
