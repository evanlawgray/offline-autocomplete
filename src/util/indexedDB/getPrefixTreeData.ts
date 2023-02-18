import { PrefixTreeNode } from '@type/index';
import { OBJECT_STORE_NAMES } from './constants';

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
