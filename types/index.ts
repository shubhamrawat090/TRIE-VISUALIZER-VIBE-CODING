export interface TrieNodeData {
  id: string; // A unique identifier for the node, e.g., 'root-c-a-t'
  char: string | null;
  children: { [key: string]: TrieNodeData };
  isEndOfWord: boolean;
}