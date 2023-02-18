import { getPrefixTreeData } from '@util/indexedDB';
import { PrefixTree } from '@util/prefix-tree';

export class AutocompleteStore {
  static #instance: PrefixTree;
  static #db: IDBDatabase;

  static injectDB(db: IDBDatabase) {
    AutocompleteStore.#db = db;
  }

  static async init() {
    if (!AutocompleteStore.#db) return;

    if (!AutocompleteStore.#instance) {
      try {
        const { value, isComplete, children } = await getPrefixTreeData(
          AutocompleteStore.#db
        );

        AutocompleteStore.#instance = new PrefixTree(
          value,
          isComplete,
          children
        );

        return AutocompleteStore.#instance;
      } catch (error) {
        console.error('Failed to get data from IndexedDB.');
      }
    }

    return AutocompleteStore.#instance;
  }

  static getInstance() {
    return AutocompleteStore.#instance;
  }
}
