import { OptionsDataStore } from '@type/index';

export class PrefixTree implements OptionsDataStore {
  value: string | null;
  isComplete: boolean;
  children: Record<string, PrefixTree>;

  constructor(value: string | null = null, isComplete = false) {
    this.value = value;
    this.isComplete = isComplete;
    this.children = {};
  }

  insert(this: PrefixTree, word: string): void {
    let curr = this;

    for (let i = 0; i < word.length; i++) {
      const match = curr.children[word[i]];

      if (!match) {
        curr.children[word[i]] = new PrefixTree(word[i]);
      }

      if (i === word.length - 1) {
        curr.children[word[i]].isComplete = true;
      }

      curr = curr.children[word[i]];
    }
  }

  search(this: PrefixTree, word: string): boolean {
    let curr = this;

    for (let i = 0; i < word.length; i++) {
      const match = curr.children[word[i]];

      if (!match) return false;

      curr = match;
    }

    return curr?.isComplete ? true : false;
  }

  getAllWithPrefix(this: PrefixTree, prefix: string): string[] {
    const result: string[] = [];

    let rootNode = this;

    for (let i = 0; i < prefix.length; i++) {
      rootNode = rootNode?.children?.[prefix[i]];
    }

    const recursivePush = (
      node: PrefixTree | undefined,
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
}
