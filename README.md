# 🌲 Interactive Trie Visualizer

A web-based educational tool for visualizing the Trie (prefix tree) data structure. Interactively insert words, search for prefixes, and see how the tree is built and traversed with smooth, step-by-step animations.

This project is built with React, TypeScript, and Tailwind CSS, running entirely in the browser with no build step required.

## ✨ Features

- **Animated Word Insertion**: Visualize the traversal of existing nodes and the creation of new ones, character by character.
- **Animated Prefix Search**: Watch the traversal path light up as the application searches for a prefix.
- **Animated Word Search**: Similar to prefix search, but strictly verifies that the final node marks the end of a word.
- **Interactive UI**: Clean and simple controls to insert words, search for prefixes, and search for full words.
- **Clear Status Feedback**: Get real-time updates on whether an action is in progress (`Inserting...`, `Searching...`), successful (`Word Found ✅`), or failed (`Prefix Not Found ❌`).
- **Responsive Design**: A fluid layout that works on both desktop and mobile devices.
- **Dark Mode Support**: The UI automatically adapts to your system's color scheme preference.
- **Error Handling**: Input is validated to allow only letters, preventing invalid states in the Trie.

## 🚀 Getting Started

This project is designed to be extremely simple to run. Since it uses CDNs for all its dependencies (React, Tailwind CSS), there is **no `npm install` or build step needed**.

1.  **Download the files**
    Clone this repository or download the source code files to your local machine.

2.  **Serve the directory**
    You need a simple local web server to serve the `index.html` file.

    If you have Python installed:

    ```bash
    # For Python 3
    python -m http.server
    ```

    If you have Node.js installed, you can use the `serve` package:

    ```bash
    npx serve .
    ```

3.  **Open in Browser**
    Navigate to the local address provided by your server (e.g., `http://localhost:8000` or `http://localhost:3000`). The application should load immediately.

## 🛠️ How to Use

- **Insert a Word**: Type a word into the "Insert Word" input and click "Insert" or press `Enter`. Watch the animation as the trie is updated.
- **Search for a Prefix**: Type a prefix into the "Search Prefix" input and click "Search". The traversal path will be highlighted, and a status message will show if the prefix was found.
- **Search for a Word**: Type a full word into the "Search Word" input and click "Search". The path will be highlighted, and the status will indicate if the _exact word_ exists in the trie (i.e., its final node is an end-of-word marker).

## 💻 Technology Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Module Loading**: Uses an `importmap` in `index.html` to load React from the [esm.sh](https://esm.sh/) CDN.
- **Core Logic**: The Trie data structure and animation logic are implemented in plain TypeScript with no external dependencies.

## 📂 File Structure

The project is organized into logical components and hooks to maintain clean, readable code.

```
.
├── App.tsx                   # Main application component with UI and state.
├── README.md                 # This file.
├── components/
│   └── TrieVisualizer.tsx    # React component for recursively rendering the trie.
├── hooks/
│   └── useTrie.ts            # Custom hook with all trie logic and animation control.
├── index.html                # The single HTML entry point.
├── index.tsx                 # React root renderer.
├── lib/
│   └── Trie.ts               # Core TrieNode and Trie class implementation.
├── metadata.json             # Application metadata.
└── types/
    └── index.ts              # TypeScript type definitions.
```
