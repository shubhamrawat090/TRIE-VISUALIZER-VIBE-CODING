# 🌲 Interactive Trie Visualizer

A web-based educational tool for visualizing the Trie (prefix tree) data structure. Interactively insert words, search for prefixes, and see how the tree is built and traversed with smooth, step-by-step animations.

This project is built with React, TypeScript, and Tailwind CSS, running entirely in the browser with no build step required.

## ✨ Features

- **Dual Theming**: Switch between a spooky "Trie-lluminator" theme and a clean "Classic" theme with the "Toggle Realm" button (☀️/👻).
- **Animated Word Insertion**: Visualize the traversal of existing nodes and the creation of new ones, character by character.
- **Animated Prefix & Word Search**: Watch the traversal path light up as the application searches for a prefix or a full word.
- **Interactive UI**: Simple controls to insert words and perform searches, dynamically styled to match the selected theme.
- **Clear Status Feedback**: Get real-time, theme-appropriate updates on whether an action is in progress, successful, or failed.
- **Responsive Design**: A fluid layout that works on both desktop and mobile devices.
- **Input Validation**: Ensures only letters are entered, preventing invalid states in the Trie.
- **Focus Management**: Input fields automatically regain focus after an operation for a smooth workflow.

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

- **Toggle Theme**: Click the ☀️/👻 icon in the top-right corner to switch between the Classic and Spooky themes.
- **Insert a Word**: Type a word into the input field and click the corresponding button or press `Enter`.
- **Search for a Prefix/Word**: Type into the respective input fields and click the button to see the search animation.

## 💻 Technology Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom CSS variable-based theming system.
- **Module Loading**: Uses an `importmap` in `index.html` to load React from the [esm.sh](https://esm.sh/) CDN.
- **Core Logic**: The Trie data structure and animation logic are implemented in plain TypeScript with no external dependencies.

## 📂 File Structure

The project is organized into logical components and hooks to maintain clean, readable code.

```
.
├── App.tsx                   # Main application component with UI, state, and theme management.
├── README.md                 # This file.
├── components/
│   └── TrieVisualizer.tsx    # React component for recursively rendering the trie (theme-aware).
├── hooks/
│   └── useTrie.ts            # Custom hook with all trie logic and animation control.
├── index.html                # The single HTML entry point with theming styles.
├── index.tsx                 # React root renderer.
├── lib/
│   └── Trie.ts               # Core TrieNode and Trie class implementation.
├── metadata.json             # Application metadata.
└── types/
    └── index.ts              # TypeScript type definitions.
```