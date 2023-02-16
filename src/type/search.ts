export interface OptionsDataStore {
  insert(word: string): void;
  search(word: string): boolean;
  getAllWithPrefix(prefix: string): string[];
}

export interface SearchOption {
  text: string;
  numberOfSearches: number;
}
