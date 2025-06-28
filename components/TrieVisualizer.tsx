import React from 'react';
import type { TrieNodeData } from '../types';

type Theme = 'classic' | 'spooky';

interface TrieBranchProps {
  node: TrieNodeData;
  searchPath: string[];
  theme: Theme;
}

const TrieBranch: React.FC<TrieBranchProps> = ({ node, searchPath, theme }) => {
  const children = Object.values(node.children);
  const isRoot = node.char === 'root';
  const isHighlighted = searchPath.includes(node.id);
  const isPathEnd = searchPath.length > 0 && searchPath[searchPath.length - 1] === node.id;

  const nodeStyle = {
    // SCALED DOWN: w-12 h-12 -> w-10 h-10, text-lg -> text-base
    base: 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ease-in-out relative shadow-lg',
    highlighted: 'shadow-[0_0_15px_5px] animate-pulse',
    pathEnd: theme === 'spooky' 
      ? 'ring-4 ring-offset-2 ring-offset-[--color-surface] ring-cyan-400'
      : 'ring-4 ring-offset-2 ring-offset-[--color-surface] ring-blue-400',
  };

  const getThemeStyles = () => {
    const common = {
      highlight: `bg-[--color-highlight] text-[--color-highlight-text] border-2 border-[--color-highlight-border] shadow-[--color-highlight]`,
      endOfWord: `bg-[--color-end-of-word] text-[--color-end-of-word-text] border-2 border-[--color-end-of-word-border] shadow-[var(--color-end-of-word)]`,
      normal: 'bg-[--color-node-bg] border-2 border-[--color-node-border] text-[--color-text]'
    };
    
    if (theme === 'classic') {
      return {
        ...common,
        rootChar: 'Φ',
        // SCALED DOWN: text-lg -> text-base
        endOfWordIcon: <span className="absolute -top-1 -right-1 text-base bg-white rounded-full p-px" role="img" aria-label="End of word">✅</span>,
        // SCALED DOWN: h-9 -> h-8
        connector: `absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 transition-colors duration-300`,
      };
    }
    
    // Spooky theme
    return {
      ...common,
      rootChar: '👻',
      // SCALED DOWN: text-xl -> text-lg
      endOfWordIcon: <span className="absolute -top-2 -right-2 text-lg" role="img" aria-label="End of word">💀</span>,
      // SCALED DOWN: h-9 -> h-8
      connector: `absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 transition-colors duration-300`,
    };
  };

  const themeStyles = getThemeStyles();

  const nodeStateStyle = isHighlighted
    ? `${themeStyles.highlight} ${nodeStyle.highlighted}`
    : (node.isEndOfWord
      ? `${themeStyles.endOfWord} shadow-[0_0_10px_3px]`
      : `${themeStyles.normal}`);

  const nodeClasses = [
    nodeStyle.base,
    nodeStateStyle,
    isPathEnd && nodeStyle.pathEnd,
  ].filter(Boolean).join(' ');

  const getConnectorColor = (childId: string) => {
    return searchPath.includes(childId) && isHighlighted ? 'bg-[--color-highlight]' : 'bg-[--color-connector]';
  };
  
  const getConnectorPulse = (childId: string) => {
    return searchPath.includes(childId) && isHighlighted ? 'animate-pulse' : '';
  };

  return (
    // SCALED DOWN: pb-9 -> pb-8
    <div className="flex flex-col items-center relative pb-8">
      <div className={nodeClasses} style={{ fontFamily: `var(${theme === 'spooky' ? '--font-body' : '--font-heading'})` }}>
        {isRoot ? themeStyles.rootChar : node.char}
        {node.isEndOfWord && themeStyles.endOfWordIcon}
      </div>

      {children.length > 0 && (
        // SCALED DOWN: gap-x-4 md:gap-x-6 -> gap-x-3 md:gap-x-4
        <div className="flex flex-row items-start justify-center absolute top-full mt-[-1px] gap-x-3 md:gap-x-4">
          {children.map((child) => (
             // SCALED DOWN: pt-9 -> pt-8
             <div key={child.id} className="relative pt-8 flex flex-col items-center">
                {/* Connector Line */}
                <div 
                    className={`${themeStyles.connector} ${getConnectorColor(child.id)} ${getConnectorPulse(child.id)}`}
                    style={{
                        boxShadow: `0 0 8px ${searchPath.includes(child.id) && isHighlighted ? 'var(--color-highlight)' : 'var(--color-connector)'}`
                    }}
                ></div>
                <TrieBranch node={child} searchPath={searchPath} theme={theme} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TrieVisualizerProps {
  data: TrieNodeData;
  searchPath: string[];
  theme: Theme;
}

const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ data, searchPath, theme }) => {
  return (
    // SCALED DOWN: min-h-[500px] -> min-h-[450px]
    <div className="w-full h-full min-h-[450px] bg-[--color-surface]/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 overflow-x-auto shadow-lg border border-[--color-border]">
      <TrieBranch node={data} searchPath={searchPath} theme={theme} />
    </div>
  );
};

export default TrieVisualizer;