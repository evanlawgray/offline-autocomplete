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
    let curr = this.root;

    for (let i = 0; i < word.length; i++) {
      const match = curr.children[word[i]];

      if (!match) {
        curr.children[word[i]] = new Node(word[i]);
      }

      if (i === word.length - 1) {
        curr.children[word[i]].isComplete = true;
      }

      curr = curr.children[word[i]];
    }
  }

  search(this: PrefixTree, word: string): boolean {
    let curr = this.root;

    for (let i = 0; i < word.length; i++) {
      const match = curr.children[word[i]];

      if (!match) return false;

      curr = match;
    }

    return curr?.isComplete ? true : false;
  }

  getAllWithPrefix(this: PrefixTree, prefix: string): string[] {
    const result: string[] = [];

    let rootNode = this.root;

    for (let i = 0; i < prefix.length; i++) {
      rootNode = rootNode?.children?.[prefix[i]];
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

    recursivePush(rootNode, prefix);

    return result;
  }

  toRawObject() {
    return {
      recordKey: 'key',
      ...this.root
    };
  }
}
