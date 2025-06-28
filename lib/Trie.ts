export class TrieNode {
  char: string | null;
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor(char: string | null = null) {
    this.char = char;
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode('root');
  }

  insert(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode(char));
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.isEndOfWord = true;
  }

  search(prefix: string): TrieNode | null {
    let currentNode = this.root;
    for (const char of prefix) {
      if (currentNode.children.has(char)) {
        currentNode = currentNode.children.get(char)!;
      } else {
        return null;
      }
    }
    return currentNode;
  }

  startsWith(prefix: string): boolean {
    return this.search(prefix) !== null;
  }
}