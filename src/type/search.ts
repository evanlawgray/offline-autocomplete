export interface PrefixTreeNode {
  value: string | null;
  isComplete: boolean;
  children: Record<string, PrefixTreeNode>;
}

export interface OptionsDataStore {
  insert(word: string): void;
  search(word: string): boolean;
  getAllWithPrefix(prefix: string): string[];
  toRawObject(): PrefixTreeNode & { recordKey: string };
}

export interface SearchOption {
  text: string;
  numberOfSearches: number;
}
