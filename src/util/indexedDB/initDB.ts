import {
  DATABASE_NAME,
  DATABASE_VERSION,
  ERROR_MESSAGES,
  OBJECT_STORE_NAMES
} from './constants';

type DBOpenEventTarget = Event & { result: IDBDatabase };

export function initDB(storeErrors: (errors: string | string[]) => void) {
  let db: IDBDatabase | undefined;

  const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  openRequest.onerror = () => {
    storeErrors(ERROR_MESSAGES.INIT_DB);
  };

  openRequest.onsuccess = () => {
    db = openRequest.result;
  };

  openRequest.onupgradeneeded = updateOrCreateDB;

  return db;
}

// TODO: Versioning different object store schemas will require deleting existing object stores,
// then recreating them with the new schema.
export function updateOrCreateDB(event: Event) {
  const target = event.target as unknown as DBOpenEventTarget;
  const db = target.result;

  if (!db.objectStoreNames.contains(OBJECT_STORE_NAMES.PREFIX_TREE)) {
    db.createObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE, {
      autoIncrement: true
    });
  }
}
