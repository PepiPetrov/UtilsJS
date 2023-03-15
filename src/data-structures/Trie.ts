import wildcardMatch from 'wildcard-match';

class TrieNode {
  public isWord: boolean = false;
  public count: number = 0;
  public children: Map<string, TrieNode> = new Map<string, TrieNode>();
}

/**
 * Trie is a tree-like data structure used for efficient retrieval of keys (words)
 * stored in the structure. Each node in the trie represents a character in a key,
 * with the root representing an empty string. The structure supports operations
 * for inserting, searching, and deleting words, as well as searching for all words
 * that start with a given prefix, searching for words that match a pattern with
 * one or more wildcards, and retrieving the count of how many times each word has
 * been added to the trie.
 *
 */

export class Trie {
  protected root: TrieNode = new TrieNode();
  protected caseSensitive: boolean;

  constructor(caseSensitive: boolean = false) {
    this.caseSensitive = caseSensitive;
  }

  public insert(word: string): void {
    if (!this.caseSensitive) {
      word = word.toLowerCase();
    }
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }

      node = node.children.get(char)!;
    }

    node.isWord = true;
    node.count++;
  }

  public search(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }

      node = node.children.get(char)!;
    }

    return node.isWord;
  }

  public prefixSearch(prefix: string): string[] {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }

      node = node.children.get(char)!;
    }

    const words: string[] = [];
    this.traverseTrie(node, prefix, words);

    return words;
  }

  public wildcardSearch(pattern: string): string[] {
    const words: string[] = [];
    this.traverseTrie(this.root, '', words, pattern);

    return words;
  }

  public count(word: string): number {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return 0;
      }

      node = node.children.get(char)!;
    }

    return node.count;
  }

  public remove(word: string): boolean {
    if (!this.search(word)) {
      return false;
    }

    let node = this.root;
    const stack: any[] = [[this.root, '']];

    for (const char of word) {
      stack.push([node, char]);
      node = node.children.get(char)!;
    }

    node.isWord = false;
    node.count--;

    while (stack.length) {
      const [currentNode, char] = stack.pop()!;
      const childNode = currentNode.children.get(char)!;

      if (childNode.children.size || childNode.isWord) {
        break;
      }

      currentNode.children.delete(char);
    }

    return true;
  }

  public compress(): void {
    this.compressNode(this.root);
  }

  protected compressNode(node: TrieNode): void {
    if (node.children.size === 1) {
      const [childChar, childNode] = node.children.entries().next().value;
      const grandChildren = Array.from(childNode.children);

      // Remove child node from parent
      node.children.delete(childChar);

      // Add grandchild nodes to parent
      for (const [grandChildChar, grandChildNode] of grandChildren as any[]) {
        node.children.set(childChar + grandChildChar, grandChildNode);

        // Recursively compress grandchildren
        this.compressNode(grandChildNode);
      }

      // Set parent's isWord flag if child was a complete word
      node.isWord = childNode.isWord;

      // Update parent's word count
      node.count = childNode.count;
    } else {
      // Recursively compress all child nodes
      for (const [, childNode] of Array.from(node.children)) {
        this.compressNode(childNode);
      }
    }
  }

  public serialize(): string {
    const obj = this.convertMapToObject(this.root);
    return JSON.stringify(obj);
  }

  public static deserialize(str: string) {
    function convertObjectToMap(obj: any) {
      const node = new TrieNode();
      node.isWord = obj.isWord;
      node.count = obj.count;
      for (const char in obj.children) {
        node.children.set(char, convertObjectToMap(obj.children[char]));
      }
      return node;
    }
    const obj = JSON.parse(str);
    const trie = new Trie();
    trie.root = convertObjectToMap(obj);
    return trie;
  }

  protected convertMapToObject(node: TrieNode): object {
    const obj: any = {
      isWord: node.isWord,
      count: node.count,
      children: {},
    };
    for (const [char, childNode] of Array.from(node.children)) {
      obj.children[char] = this.convertMapToObject(childNode);
    }
    return obj;
  }

  protected traverseTrie(
    node: TrieNode,
    prefix: string,
    words: string[],
    pattern = ''
  ): boolean | void {
    if (node.isWord && (!pattern || wildcardMatch(pattern)(prefix))) {
      words.push(prefix);
    }

    for (const [char, childNode] of Array.from(node.children)) {
      if (!pattern || pattern[0] === char || pattern[0] === '?') {
        this.traverseTrie(childNode, prefix + char, words, pattern.slice(1));
      } else if (pattern[0] === '*') {
        const subPattern = pattern.slice(1);
        for (let i = 0; i <= prefix.length; i++) {
          const subPrefix = prefix.slice(i);
          if (this.traverseTrie(childNode, subPrefix, words, subPattern)) {
            return true;
          }
        }
      }
    }
  }
}
