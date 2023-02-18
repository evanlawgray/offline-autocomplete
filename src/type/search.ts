export interface PrefixTreeNode {
  value: string | null;
  isComplete: boolean;
  children: Record<string, PrefixTreeNode>;
}

export interface SearchOption {
  text: string;
  numberOfSearches: number;
}
