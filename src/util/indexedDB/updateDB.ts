import { IDBOpenEventTarget } from '@type/db';
import { OBJECT_STORE_NAMES } from './constants';

export function updateDB(event: Event) {
  const target = event.target as unknown as IDBOpenEventTarget;
  const db = target.result;

  if (db.objectStoreNames.contains(OBJECT_STORE_NAMES.PREFIX_TREE)) {
    db.deleteObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE);
  }

  db.createObjectStore(OBJECT_STORE_NAMES.PREFIX_TREE, {
    keyPath: 'recordKey'
  });
}
