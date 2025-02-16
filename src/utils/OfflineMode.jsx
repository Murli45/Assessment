import { openDB } from 'idb';

const DB_NAME = 'newsDB';
const STORE_NAME = 'articles';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveArticles = async (articles) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(articles.map(article => tx.store.put(article)));
  await tx.done;
};

export const getArticles = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearArticles = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
};