# Interactive Trie Visualizer

A web-based educational tool for visualizing the Trie (prefix tree) data structure. Interactively insert words, search for prefixes, and see how the tree is built and traversed with step-by-step animations.

Built with React, TypeScript, and Tailwind CSS. The UI runs in the browser; [Vite](https://vite.dev/) handles local development and production builds.

## Features

- **Dual theming**: Switch between a spooky "Trie-lluminator" theme and a clean "Classic" theme with the toggle in the header.
- **Animated word insertion**: See traversal of existing nodes and creation of new ones, character by character.
- **Animated prefix and word search**: Watch the traversal path highlight during search.
- **Input validation**: Only letters are accepted for trie operations.
- **Responsive layout**: Usable on desktop and mobile.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm)

### Run locally

```bash
git clone <repository-url>
cd TRIE-VISUALIZER-VIBE-CODING
npm install
npm run dev
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### Other scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start the dev server     |
| `npm run build`   | Production build to `dist/` |
| `npm run preview` | Preview the production build |

## How to use

- **Toggle theme**: Use the theme button in the top-right corner.
- **Insert a word**: Type in the insert field and click **Insert** or press Enter.
- **Search**: Use the prefix or word search fields and click **Search**.

## Technology stack

- **React** and **TypeScript** — UI and trie logic
- **Tailwind CSS** — loaded via CDN in `index.html` for utility classes
- **Vite** — dev server and bundling
- **Custom CSS variables** — classic and spooky themes in `index.html`

## Project structure

```
.
├── App.tsx                   # Main UI, state, and theme
├── components/
│   └── TrieVisualizer.tsx    # Recursive trie rendering
├── hooks/
│   └── useTrie.ts              # Trie operations and animations
├── index.html                # Entry HTML, themes, Tailwind CDN
├── index.tsx                 # React root
├── lib/
│   └── Trie.ts                 # Trie data structure
├── types/
│   └── index.ts                # Shared TypeScript types
├── metadata.json               # App metadata
├── package.json
├── tsconfig.json
└── vite.config.ts
```
