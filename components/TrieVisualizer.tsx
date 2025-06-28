import React from 'react';
import type { TrieNodeData } from '../types';

interface TrieBranchProps {
  node: TrieNodeData;
  searchPath: string[];
}

const TrieBranch: React.FC<TrieBranchProps> = ({ node, searchPath }) => {
  const children = Object.values(node.children);
  const isHighlighted = searchPath.includes(node.id);
  const isPathEnd = searchPath.length > 0 && searchPath[searchPath.length - 1] === node.id;

  const nodeClasses = [
    'w-14', 'h-14', 'rounded-full', 'flex', 'items-center', 'justify-center',
    'font-mono', 'font-bold', 'text-2xl', 'transition-all', 'duration-300', 'ease-in-out',
    'border-2', 'relative', 'shadow-md',
    isHighlighted ? 'bg-yellow-300 dark:bg-yellow-500 border-yellow-500 dark:border-yellow-300 text-slate-800' : 
    (node.isEndOfWord ? 'bg-green-300 dark:bg-green-600 border-green-500 dark:border-green-400 text-slate-800' : 
    'bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-800 dark:text-slate-100'),
    isPathEnd && 'ring-4 ring-blue-500 dark:ring-blue-400',
  ].join(' ');

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={nodeClasses}>
        {node.char === 'root' ? '∅' : node.char}
        {node.isEndOfWord && !isHighlighted && (
          <span className="absolute -top-2 -right-2 text-xl" role="img" aria-label="End of word">✅</span>
        )}
      </div>

      {children.length > 0 && (
        <div className="flex flex-row items-start justify-center gap-x-4 md:gap-x-6 relative">
          {/* Connecting lines */}
          <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-400 dark:bg-slate-500"></div>
          {children.map((child, index) => (
             <div key={child.id} className="relative pt-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-400 dark:bg-slate-500"></div>
                 {children.length > 1 && (
                     <div 
                         className="absolute top-0 h-0.5 bg-slate-400 dark:bg-slate-500"
                         style={{
                             left: index === 0 ? '50%' : `calc(-${(children.length - 1 - index) * 100 + (index > 0 ? 50 : 0)}% - ${(children.length - 1 - index) * 1.5}rem + 1px)`,
                             right: index === children.length - 1 ? '50%' : `calc(-${index * 100 + (index < children.length - 1 ? 50 : 0)}% - ${index * 1.5}rem + 1px)`,
                         }}
                     ></div>
                 )}
                 <TrieBranch node={child} searchPath={searchPath} />
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
}

const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ data, searchPath }) => {
  return (
    <div className="w-full min-h-[400px] bg-slate-100 dark:bg-slate-800 rounded-lg p-4 md:p-8 overflow-x-auto">
      <TrieBranch node={data} searchPath={searchPath} />
    </div>
  );
};

export default TrieVisualizer;
