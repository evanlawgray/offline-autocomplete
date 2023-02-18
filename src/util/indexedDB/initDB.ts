import { PrefixTreeNode } from '@type/index';
import { AutocompleteStore } from '@util/autocomplete-store/AutocompleteStore';
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  ERROR_MESSAGES,
  OBJECT_STORE_NAMES
} from './constants';

type IDBOpenEventTarget = EventTarget & { result: IDBDatabase };
type IDBErrorEventTarget = EventTarget & { errorCode: string };

export let db: IDBDatabase | undefined;

export function initDB(storeErrors: (errors: string | string[]) => void) {
  const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  openRequest.onerror = () => {
    storeErrors(ERROR_MESSAGES.INIT_DB);
  };

  openRequest.onsuccess = () => {
    db = openRequest.result;

    db.onerror = (event) => {
      storeErrors((event.target as IDBErrorEventTarget).errorCode);
    };

    AutocompleteStore.injectDB(db);
    AutocompleteStore.init();
  };

  openRequest.onupgradeneeded = updateOrCreateDB;

  return db;
}

export function getPrefixTreeData(db: IDBDatabase): Promise<PrefixTreeNode> {
  return new Promise((resolve, reject) => {
    const objectStore = db
      .transaction([OBJECT_STORE_NAMES.PREFIX_TREE])
      .objectStore(OBJECT_STORE_NAMES.PREFIX_TREE);

    const treeDataRequest = objectStore.getAll();

    treeDataRequest.onsuccess = (event) => {
      const queryResult = (event.target as IDBRequest<PrefixTreeNode[]>)
        .result[0];

      resolve(queryResult);
    };

    treeDataRequest.onerror = () => reject();
  });
}

export function updateOrCreateDB(event: Event) {
  const target = event.target as unknown as IDBOpenEventTarget;
  const db = target.result;

  if (db.objectStoreNames.contains(OBJECT_STORE_NAMES.PREFIX_TREE)) {
    db.deleteObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE);
  }

  db.createObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE, {
    keyPath: 'recordKey'
  });
}
