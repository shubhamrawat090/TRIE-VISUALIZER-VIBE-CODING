import React, { useState, useCallback } from 'react';
import TrieVisualizer from './components/TrieVisualizer';
import { useTrie } from './hooks/useTrie';

const App: React.FC = () => {
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchWordValue, setSearchWordValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { visualTrie, insertWord, searchPrefix, searchWord, isAnimating, animationMessage, searchPath, searchResult, wordSearchResult, insertResult, clearSearch } = useTrie();

  const handleInsert = useCallback(() => {
    const sanitized = insertValue.trim().toLowerCase();
    if (!/^[a-z]*$/.test(sanitized)) {
      setError('Only letters are allowed for insertion.');
      return;
    }
    if (sanitized) {
      setError(null);
      clearSearch();
      insertWord(sanitized);
      setInsertValue('');
    }
  }, [insertValue, insertWord, clearSearch]);

  const handleSearch = useCallback(() => {
    const sanitized = searchValue.trim().toLowerCase();
    if (!/^[a-z]*$/.test(sanitized)) {
      setError('Only letters are allowed for searching.');
      return;
    }
    if (sanitized) {
      setError(null);
      clearSearch();
      searchPrefix(sanitized);
      setSearchValue('');
    }
  }, [searchValue, searchPrefix, clearSearch]);

  const handleWordSearch = useCallback(() => {
    const sanitized = searchWordValue.trim().toLowerCase();
    if (!/^[a-z]*$/.test(sanitized)) {
        setError('Only letters are allowed for searching.');
        return;
    }
    if (sanitized) {
        setError(null);
        clearSearch();
        searchWord(sanitized);
        setSearchWordValue('');
    }
  }, [searchWordValue, searchWord, clearSearch]);

  const handleInsertKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInsert();
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchWordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleWordSearch();
    }
  };

  const SearchStatus = () => {
    if (isAnimating && animationMessage) {
      return <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{animationMessage}</div>;
    }
    if (insertResult) {
      return <div className="text-lg font-medium text-green-600 dark:text-green-400">{insertResult} ✅</div>;
    }
    if (wordSearchResult === 'found') {
      return <div className="text-lg font-medium text-green-600 dark:text-green-400">Word Found ✅</div>;
    }
    if (wordSearchResult === 'not_found') {
      return <div className="text-lg font-medium text-red-600 dark:text-red-400">Word Not Found ❌</div>;
    }
    if (searchResult === 'found') {
      return <div className="text-lg font-medium text-green-600 dark:text-green-400">Prefix Found ✅</div>;
    }
    if (searchResult === 'not_found') {
      return <div className="text-lg font-medium text-red-600 dark:text-red-400">Prefix Not Found ❌</div>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            <span role="img" aria-label="tree emoji">🌲</span> Trie Visualizer
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Explore Prefix Trees Visually</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 xl:w-1/4 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Controls</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="insert-word" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insert Word</label>
                  <div className="flex gap-2">
                    <input
                      id="insert-word"
                      type="text"
                      value={insertValue}
                      onChange={(e) => setInsertValue(e.target.value)}
                      onKeyPress={handleInsertKeyPress}
                      placeholder="e.g., apple"
                      disabled={isAnimating}
                      className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 disabled:opacity-50"
                    />
                    <button onClick={handleInsert} disabled={isAnimating || !insertValue} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                      Insert
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="search-prefix" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search Prefix</label>
                  <div className="flex gap-2">
                    <input
                      id="search-prefix"
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="e.g., app"
                      disabled={isAnimating}
                      className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 disabled:opacity-50"
                    />
                    <button onClick={handleSearch} disabled={isAnimating || !searchValue} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                      Search
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="search-word" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search Word</label>
                  <div className="flex gap-2">
                    <input
                      id="search-word"
                      type="text"
                      value={searchWordValue}
                      onChange={(e) => setSearchWordValue(e.target.value)}
                      onKeyPress={handleSearchWordKeyPress}
                      placeholder="e.g., apple"
                      disabled={isAnimating}
                      className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 disabled:opacity-50"
                    />
                    <button onClick={handleWordSearch} disabled={isAnimating || !searchWordValue} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                      Search
                    </button>
                  </div>
                </div>
                 {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-24 flex items-center justify-center">
                <SearchStatus />
             </div>
          </div>
          <div className="lg:w-2/3 xl:w-3/4">
            <TrieVisualizer data={visualTrie} searchPath={searchPath} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;