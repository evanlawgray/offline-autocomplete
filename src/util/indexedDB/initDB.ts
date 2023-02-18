import { IDBErrorEventTarget } from '@type/db';
import { AutocompleteStore } from '@util/autocomplete-store/AutocompleteStore';
import { DATABASE_NAME, DATABASE_VERSION, ERROR_MESSAGES } from './constants';
import { updateDB } from './updateDB';

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

  openRequest.onupgradeneeded = updateDB;

  return db;
}
