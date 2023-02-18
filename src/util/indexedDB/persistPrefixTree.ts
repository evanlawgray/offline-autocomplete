import { PrefixTree } from '@util/prefix-tree';
import { OBJECT_STORE_NAMES } from './constants';

import { db } from './initDB';

export function persistPrefixTree(
  treeData: ReturnType<PrefixTree['toRawObject']>,
  storeErrors: (errors: string | string[]) => void
) {
  if (!db) return;

  const transaction = db.transaction(
    [OBJECT_STORE_NAMES.PREFIX_TREE],
    'readwrite'
  );
  const objectStore = transaction.objectStore(OBJECT_STORE_NAMES.PREFIX_TREE);
  const updateRequest = objectStore.put(treeData);

  updateRequest.onerror = (error) => storeErrors(`${error}`);
}
