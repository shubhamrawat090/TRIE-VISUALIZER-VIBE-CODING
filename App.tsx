import React, { useState, useCallback, useEffect, useRef, forwardRef } from 'react';
import TrieVisualizer from './components/TrieVisualizer';
import { useTrie } from './hooks/useTrie';

type Theme = 'classic' | 'spooky';

// --- Helper Component: AppButton ---
const AppButton = ({ onClick, disabled, children, color, className }: { onClick: () => void, disabled: boolean, children: React.ReactNode, color: string, className?: string }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        // SCALED DOWN: text-lg -> text-base
        className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-300 border-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-500 ${color} ${className}`}
        style={{ fontFamily: 'var(--font-body)' }}
    >
        {children}
    </button>
);

// --- Helper Component: SearchStatus ---
const SearchStatus = ({ theme, isAnimating, animationMessage, insertResult, wordSearchResult, searchResult }: {
  theme: Theme,
  isAnimating: boolean,
  animationMessage: string | null,
  insertResult: string | null,
  wordSearchResult: 'found' | 'not_found' | null,
  searchResult: 'found' | 'not_found' | null,
}) => {
  let message = null;
  let style = "text-[--color-info]";

  if (isAnimating && animationMessage) {
    message = theme === 'spooky' ? animationMessage.replace('...', ' the void...') : `${animationMessage}...`;
    style = "text-[--color-info] animate-pulse";
  } else if (insertResult) {
    const word = insertResult.match(/"(.*?)"/)?.[1] || '';
    message = theme === 'spooky' ? `The word "${word}" has been etched. 💀` : `Word "${word}" inserted! ✅`;
    style = "text-[--color-success]";
  } else if (wordSearchResult === 'found') {
    message = theme === 'spooky' ? 'The spirits have found this word! ✅' : 'Word found! ✅';
    style = "text-[--color-success]";
  } else if (wordSearchResult === 'not_found') {
    message = theme === 'spooky' ? 'The word is lost to the ether. ❌' : 'Word not found. ❌';
    style = "text-[--color-error]";
  } else if (searchResult === 'found') {
    message = theme === 'spooky' ? 'A path has been revealed! ✅' : 'Prefix found! ✅';
    style = "text-[--color-success]";
  } else if (searchResult === 'not_found') {
    message = theme === 'spooky' ? 'This path leads to nowhere. ❌' : 'Prefix not found. ❌';
    style = "text-[--color-error]";
  }

  if (!message) return null;

  // SCALED DOWN: text-xl -> text-lg
  return <div className={`text-lg text-center transition-colors duration-300 ${style}`} style={{fontFamily: 'var(--font-body)'}}>{message}</div>;
};

// --- Helper Component: InputField ---
const InputField = forwardRef<HTMLInputElement, {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
  color: string;
}>(({ id, value, onChange, onKeyPress, placeholder, disabled, color }, ref) => (
  <input
    ref={ref}
    id={id} type="text" value={value} onChange={onChange}
    onKeyPress={onKeyPress} placeholder={placeholder} disabled={disabled}
    autoComplete="off"
    // SCALED DOWN: text-lg -> text-base
    className={`flex-grow p-2 text-base border-2 rounded-md bg-black/10 outline-none transition-all disabled:opacity-50
    border-[--color-border] focus:ring-2 
    ${color}`}
    style={{ fontFamily: 'var(--font-body)' }}
  />
));

const App: React.FC = () => {
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchWordValue, setSearchWordValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('classic');

  const insertInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWordInputRef = useRef<HTMLInputElement>(null);

  const { visualTrie, insertWord, searchPrefix, searchWord, isAnimating, animationMessage, searchPath, searchResult, wordSearchResult, insertResult, clearSearch } = useTrie();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'spooky') {
      document.body.classList.add('bg-spooky-pattern');
    } else {
      document.body.classList.remove('bg-spooky-pattern');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'spooky' ? 'classic' : 'spooky');
  };
  
  const validateInput = (value: string) => {
    if (!/^[a-z]*$/.test(value)) {
      setError(theme === 'spooky' ? 'Only earthly letters may be used.' : 'Please enter only letters.');
      return false;
    }
    setError(null);
    return true;
  }

  const handleInsert = useCallback(async () => {
    const sanitized = insertValue.trim().toLowerCase();
    if (sanitized && validateInput(sanitized)) {
      clearSearch();
      await insertWord(sanitized);
      setInsertValue('');
      setTimeout(() => insertInputRef.current?.focus(), 0);
    }
  }, [insertValue, insertWord, clearSearch, theme]);

  const handleSearch = useCallback(async () => {
    const sanitized = searchValue.trim().toLowerCase();
    if (sanitized && validateInput(sanitized)) {
      clearSearch();
      await searchPrefix(sanitized);
      setSearchValue('');
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [searchValue, searchPrefix, clearSearch, theme]);

  const handleWordSearch = useCallback(async () => {
    const sanitized = searchWordValue.trim().toLowerCase();
    if (sanitized && validateInput(sanitized)) {
      clearSearch();
      await searchWord(sanitized);
      setSearchWordValue('');
      setTimeout(() => searchWordInputRef.current?.focus(), 0);
    }
  }, [searchWordValue, searchWord, clearSearch, theme]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };
  
  const buttonColors = {
    accent: 'bg-[--color-accent] text-white border-transparent hover:bg-[--color-accent-hover]',
    secondary: 'bg-[--color-secondary] text-white border-transparent hover:bg-[--color-secondary-hover]',
    primary: 'bg-[--color-primary] text-white border-transparent hover:bg-[--color-primary-hover]',
  };
  
  const inputColors = {
    accent: 'focus:ring-[--color-accent] focus:border-[--color-accent]',
    secondary: 'focus:ring-[--color-secondary] focus:border-[--color-secondary]',
    primary: 'focus:ring-[--color-primary] focus:border-[--color-primary]',
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      {/* SCALED DOWN: max-w-8xl -> max-w-7xl */}
      <div className="max-w-7xl mx-auto">
        {/* SCALED DOWN: mb-10 -> mb-8 */}
        <header className="text-center mb-8 relative">
          {/* SCALED DOWN: text-6xl md:text-8xl -> text-5xl md:text-6xl */}
          <h1 className="text-5xl md:text-6xl tracking-wider" style={{ fontFamily: 'var(--font-heading)', textShadow: theme === 'spooky' ? '0 5px 10px rgba(154,79,246,0.4)' : 'none' }}>
             {theme === 'spooky' ? 'Spooky Trie-lluminator' : 'Trie Visualizer'}
          </h1>
          {/* SCALED DOWN: text-lg -> text-base */}
          <p className="mt-2 text-base text-[--color-text-muted]" style={{fontFamily: 'var(--font-body)'}}>
             {theme === 'spooky' ? 'Unearth the secrets of the prefix tree' : 'Explore Prefix Trees Visually'}
          </p>
          <button onClick={toggleTheme} className="absolute top-0 right-0 p-2 rounded-lg bg-[--color-surface] text-[--color-text] border border-[--color-border] shadow-md transition-all hover:scale-110">
            <span className="text-2xl">{theme === 'spooky' ? '☀️' : '👻'}</span>
            <span className="sr-only">Toggle Theme</span>
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[--color-surface]/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[--color-border]">
              {/* SCALED DOWN: text-4xl -> text-3xl, mb-6 -> mb-5 */}
              <h2 className="text-3xl mb-5 text-center text-[--color-primary]" style={{ fontFamily: 'var(--font-heading)' }}>
                {theme === 'spooky' ? 'The Altar' : 'Controls'}
              </h2>
              {/* SCALED DOWN: space-y-6 -> space-y-5 */}
              <div className="space-y-5">
                
                <div>
                  {/* SCALED DOWN: text-lg -> text-base */}
                  <label htmlFor="insert-word" className="block text-base text-[--color-accent] mb-2" style={{ fontFamily: 'var(--font-body)'}}>
                    {theme === 'spooky' ? 'Etch a Word' : 'Insert Word'}
                  </label>
                  <div className="flex gap-3">
                    <InputField ref={insertInputRef} id="insert-word" value={insertValue} onChange={(e) => setInsertValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleInsert)} placeholder="e.g., ghost" disabled={isAnimating} color={inputColors.accent}
                    />
                    <AppButton onClick={handleInsert} disabled={isAnimating || !insertValue} color={buttonColors.accent}>
                      {theme === 'spooky' ? 'Summon' : 'Insert'}
                    </AppButton>
                  </div>
                </div>

                <div>
                  {/* SCALED DOWN: text-lg -> text-base */}
                  <label htmlFor="search-prefix" className="block text-base text-[--color-secondary] mb-2" style={{ fontFamily: 'var(--font-body)'}}>
                    {theme === 'spooky' ? 'Seek a Prefix' : 'Search Prefix'}
                  </label>
                  <div className="flex gap-3">
                    <InputField ref={searchInputRef} id="search-prefix" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSearch)} placeholder="e.g., gho" disabled={isAnimating} color={inputColors.secondary}
                    />
                    <AppButton onClick={handleSearch} disabled={isAnimating || !searchValue} color={buttonColors.secondary}>
                      {theme === 'spooky' ? 'Seek' : 'Search'}
                    </AppButton>
                  </div>
                </div>
                
                <div>
                  {/* SCALED DOWN: text-lg -> text-base */}
                  <label htmlFor="search-word" className="block text-base text-[--color-primary] mb-2" style={{ fontFamily: 'var(--font-body)'}}>
                    {theme === 'spooky' ? 'Find a Word' : 'Search Word'}
                  </label>
                  <div className="flex gap-3">
                    <InputField ref={searchWordInputRef} id="search-word" value={searchWordValue} onChange={(e) => setSearchWordValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleWordSearch)} placeholder="e.g., ghost" disabled={isAnimating} color={inputColors.primary}
                    />
                    <AppButton onClick={handleWordSearch} disabled={isAnimating || !searchWordValue} color={buttonColors.primary}>
                      {theme === 'spooky' ? 'Find' : 'Search'}
                    </AppButton>
                  </div>
                </div>
                
                {error && <p className="text-sm text-center text-[--color-error] pt-2" style={{ fontFamily: 'var(--font-body)'}}>{error}</p>}
              </div>
            </div>
            
             {/* SCALED DOWN: min-h-[120px] -> min-h-[100px] */}
             <div className="bg-[--color-surface]/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[--color-border] min-h-[100px] flex items-center justify-center">
                <SearchStatus 
                  theme={theme}
                  isAnimating={isAnimating}
                  animationMessage={animationMessage}
                  insertResult={insertResult}
                  wordSearchResult={wordSearchResult}
                  searchResult={searchResult}
                />
             </div>
          </div>
          <div className="lg:col-span-2">
            <TrieVisualizer data={visualTrie} searchPath={searchPath} theme={theme} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;