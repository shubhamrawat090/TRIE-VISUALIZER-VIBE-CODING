import { useState, useRef, useCallback } from 'react';
import { Trie, TrieNode } from '../lib/Trie';
import { DEMO_WORDS } from '../lib/demoWords';
import type { TrieNodeData } from '../types';

const DEMO_CHAR_DELAY_MS = 80;
const DEMO_WORD_GAP_MS = 120;

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

  const clearTrie = useCallback(() => {
    if (isAnimating) return;

    trieInstance.current = new Trie();
    setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));
    setSearchPath([]);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);
    setAnimationMessage(null);
  }, [isAnimating]);

  const loadDemoWords = useCallback(async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSearchPath(['root']);
    setSearchResult(null);
    setWordSearchResult(null);
    setInsertResult(null);

    trieInstance.current = new Trie();
    setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));

    await new Promise((r) => setTimeout(r, 200));

    for (const word of DEMO_WORDS) {
      setAnimationMessage(`Loading demo: ${word}`);

      let currentNode = trieInstance.current.root;
      let currentPath = ['root'];
      const lowerCaseWord = word.toLowerCase();

      for (const char of lowerCaseWord) {
        const parentId = currentPath[currentPath.length - 1];
        const newId = `${parentId}-${char}`;

        if (currentNode.children.has(char)) {
          currentNode = currentNode.children.get(char)!;
        } else {
          const newNode = new TrieNode(char);
          currentNode.children.set(char, newNode);
          currentNode = newNode;
          setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));
        }

        currentPath.push(newId);
        setSearchPath([...currentPath]);
        await new Promise((r) => setTimeout(r, DEMO_CHAR_DELAY_MS));
      }

      currentNode.isEndOfWord = true;
      setVisualTrie(convertNodeToData(trieInstance.current.root, 'root'));
      await new Promise((r) => setTimeout(r, DEMO_WORD_GAP_MS));
    }

    setInsertResult(`Demo: Loaded ${DEMO_WORDS.length} words!`);
    setIsAnimating(false);
    setAnimationMessage(null);
    setSearchPath([]);
  }, [isAnimating]);

  return {
    visualTrie,
    insertWord,
    searchPrefix,
    searchWord,
    loadDemoWords,
    clearTrie,
    isAnimating,
    animationMessage,
    searchPath,
    searchResult,
    wordSearchResult,
    insertResult,
    clearSearch,
  };
};