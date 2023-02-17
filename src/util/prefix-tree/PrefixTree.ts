import { OptionsDataStore, PrefixTreeNode } from '@type/index';

export class Node implements PrefixTreeNode {
  value: string | null;
  isComplete: boolean;
  children: Record<string, PrefixTreeNode>;

  constructor(value: string | null = null, isComplete = false) {
    this.value = value;
    this.isComplete = isComplete;
    this.children = {};
  }
}

export class PrefixTree implements OptionsDataStore {
  root: PrefixTreeNode;

  constructor(
    value: string | null = null,
    isComplete = false,
    children: Record<string, Node> = {}
  ) {
    const root = {
      value,
      isComplete,
      children
    };

    this.root = root;
  }

  insert(this: PrefixTree, word: string): void {
    const lowercaseWord = word.toLocaleLowerCase();

    let curr = this.root;

    for (let i = 0; i < lowercaseWord.length; i++) {
      const match = curr.children[lowercaseWord[i]];

      if (!match) {
        curr.children[lowercaseWord[i]] = new Node(lowercaseWord[i]);
      }

      if (i === lowercaseWord.length - 1) {
        curr.children[lowercaseWord[i]].isComplete = true;
      }

      curr = curr.children[lowercaseWord[i]];
    }
  }

  search(this: PrefixTree, word: string): boolean {
    const lowercaseWord = word.toLocaleLowerCase();

    let curr = this.root;

    for (let i = 0; i < lowercaseWord.length; i++) {
      const match = curr.children[lowercaseWord[i]];

      if (!match) return false;

      curr = match;
    }

    return curr?.isComplete ? true : false;
  }

  getAllWithPrefix(this: PrefixTree, prefix: string): string[] {
    const lowercasePrefix = prefix.toLocaleLowerCase();

    const result: string[] = [];

    let rootNode = this.root;

    for (let i = 0; i < lowercasePrefix.length; i++) {
      rootNode = rootNode?.children?.[lowercasePrefix[i]];
    }

    const recursivePush = (
      node: Node | undefined,
      baseString: string
    ): void => {
      if (!node) return;

      if (node.isComplete && node.value) result.push(baseString);

      Object.values(node.children).forEach((childNode) =>
        recursivePush(childNode, `${baseString}${childNode.value}`)
      );
    };

    recursivePush(rootNode, lowercasePrefix);

    return result;
  }

  toRawObject() {
    return {
      recordKey: 'key',
      ...this.root
    };
  }
}
