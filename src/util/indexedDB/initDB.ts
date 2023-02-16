import { PrefixTreeNode } from '@type/index';
import { setPrefixTreeSingleton } from '@util/prefix-tree';
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  ERROR_MESSAGES,
  OBJECT_STORE_NAMES
} from './constants';

type IDBOpenEventTarget = { result: IDBDatabase };

export let db: IDBDatabase | undefined;

export function initDB(storeErrors: (errors: string | string[]) => void) {
  const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  openRequest.onerror = () => {
    storeErrors(ERROR_MESSAGES.INIT_DB);
  };

  openRequest.onsuccess = () => {
    db = openRequest.result;

    const transaction = db.transaction([OBJECT_STORE_NAMES.PREFIX_TREE]);
    const objectStore = transaction.objectStore(OBJECT_STORE_NAMES.PREFIX_TREE);

    const treeDataRequest = objectStore.getAll();

    treeDataRequest.onsuccess = (event) => {
      const queryResult = (event.target as IDBRequest<PrefixTreeNode[]>)
        .result[0];

      setPrefixTreeSingleton(queryResult as PrefixTreeNode);
    };
  };

  openRequest.onupgradeneeded = updateOrCreateDB;

  return db;
}

// TODO: Versioning different object store schemas will require deleting existing object stores,
// then recreating them with the new schema.
export function updateOrCreateDB(event: Event) {
  const target = event.target as unknown as IDBOpenEventTarget;
  const db = target.result;

  if (!db.objectStoreNames.contains(OBJECT_STORE_NAMES.PREFIX_TREE)) {
    db.createObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE, {
      keyPath: 'recordKey'
    });
  } else {
    db.deleteObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE);
    db.createObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE, {
      keyPath: 'recordKey'
    });
  }
}
