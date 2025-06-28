import { useState, useRef, useCallback } from 'react';
import { Trie, TrieNode } from '../lib/Trie';
import type { TrieNodeData } from '../types';

const convertNodeToData = (node: TrieNode, id: string): TrieNodeData => {
  const childrenData: { [key: string]: TrieNodeData } = {};
  const sortedKeys = Array.from(node.children.keys()).sort();

  for (const char of sortedKeys) {
    const childNode = node.children.get(char)!;
    childrenData[char] = convertNodeToData(childNode, `${id}-${char}`);
  }

  return {
    id,
    char: node.char,
    isEndOfWord: node.isEndOfWord,
    children: childrenData,
  };
};

export const useTrie = () => {
  const trieInstance = useRef<Trie>(new Trie());
  const [visualTrie, setVisualTrie] = useState<TrieNodeData>(convertNodeToData(trieInstance.current.root, 'root'));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationMessage, setAnimationMessage] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [wordSearchResult, setWordSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [insertResult, setInsertResult] = useState<string | null>(null);

  const insertWord = useCallback(async (word: string) => {
    if (!word || isAnimating) return;

    setIsAnimating(true);
    setAnimationMessage('Inserting...');
    setSearchPath(['root']);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);

    await new Promise(r => setTimeout(r, 300));
    
    let currentNode = trieInstance.current.root;
    let currentPath = ['root'];
    const lowerCaseWord = word.toLowerCase();

    for (const char of lowerCaseWord) {
        const parentId = currentPath[currentPath.length - 1];
        const newId = `${parentId}-${char}`;

        if (currentNode.children.has(char)) {
            // Node exists, traverse to it
            currentNode = currentNode.children.get(char)!;
        } else {
            // Node does not exist, create it
            const newNode = new TrieNode(char);
            currentNode.children.set(char, newNode);
            currentNode = newNode;
            // Update the visual trie to show the new node being added
            setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));
        }

        // Highlight the current path
        currentPath.push(newId);
        setSearchPath([...currentPath]);
        
        await new Promise(r => setTimeout(r, 400));
    }

    // Mark the last node as end of word
    currentNode.isEndOfWord = true;
    
    // Final update to visualization to show end-of-word marker
    setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));
    setInsertResult(`Word "${word}" inserted!`);

    setIsAnimating(false);
    setAnimationMessage(null);
  }, [isAnimating]);

  const searchPrefix = useCallback(async (prefix: string) => {
    if (!prefix || isAnimating) return;
    setIsAnimating(true);
    setAnimationMessage('Searching prefix...');
    setSearchPath(['root']);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);

    let currentNode = trieInstance.current.root;
    let currentPath = ['root']; // This will store the full node IDs for the path
    let found = true;

    await new Promise(r => setTimeout(r, 300));

    for (const char of prefix.toLowerCase()) {
      if (currentNode.children.has(char)) {
        currentNode = currentNode.children.get(char)!;
        const parentId = currentPath[currentPath.length - 1];
        const newId = `${parentId}-${char}`;
        currentPath.push(newId);
        setSearchPath([...currentPath]);
        await new Promise(r => setTimeout(r, 400));
      } else {
        found = false;
        break;
      }
    }
    
    setSearchResult(found ? 'found' : 'not_found');
    setIsAnimating(false);
    setAnimationMessage(null);
  }, [isAnimating]);

  const searchWord = useCallback(async (word: string) => {
    if (!word || isAnimating) return;
    setIsAnimating(true);
    setAnimationMessage('Searching word...');
    setSearchPath(['root']);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);

    let currentNode = trieInstance.current.root;
    let currentPath = ['root'];
    let pathExists = true;

    await new Promise(r => setTimeout(r, 300));

    for (const char of word.toLowerCase()) {
      if (currentNode.children.has(char)) {
        currentNode = currentNode.children.get(char)!;
        const parentId = currentPath[currentPath.length - 1];
        const newId = `${parentId}-${char}`;
        currentPath.push(newId);
        setSearchPath([...currentPath]);
        await new Promise(r => setTimeout(r, 400));
      } else {
        pathExists = false;
        break;
      }
    }
    
    const wordFound = pathExists && currentNode.isEndOfWord;
    setWordSearchResult(wordFound ? 'found' : 'not_found');
    setIsAnimating(false);
    setAnimationMessage(null);
  }, [isAnimating]);
  
  const clearSearch = useCallback(() => {
    setSearchPath([]);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);
  }, []);

  return { visualTrie, insertWord, searchPrefix, searchWord, isAnimating, animationMessage, searchPath, searchResult, wordSearchResult, insertResult, clearSearch };
};