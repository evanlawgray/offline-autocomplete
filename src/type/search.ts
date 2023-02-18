export interface PrefixTreeNode {
  value: string | null;
  isComplete: boolean;
  children: Record<string, PrefixTreeNode>;
  searchCount: number;
}

export interface SearchOption {
  searchTerm: string;
  searchCount: number;
}
