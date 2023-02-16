import { PrefixTree, Node } from './PrefixTree';

export let prefixTreeSingleton: PrefixTree;

export const setPrefixTreeSingleton = (data: Node) => {
  if (!data) {
    prefixTreeSingleton = new PrefixTree();
    return;
  }

  prefixTreeSingleton = new PrefixTree(
    data.value,
    data.isComplete,
    data.children
  );
};
