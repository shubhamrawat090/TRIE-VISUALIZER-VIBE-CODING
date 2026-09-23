import React, { useMemo, useState, useCallback, useRef } from 'react';
import type { TrieNodeData } from '../types';
import { computeTrieLayout, NODE_SIZE } from '../lib/trieLayout';

type Theme = 'classic' | 'spooky';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const NODE_RADIUS = NODE_SIZE / 2;

interface TrieVisualizerProps {
  data: TrieNodeData;
  searchPath: string[];
  theme: Theme;
}

const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ data, searchPath, theme }) => {
  const layout = useMemo(() => computeTrieLayout(data), [data]);
  const nodeById = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);

  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const setZoomClamped = useCallback((value: number) => {
    setZoom(clampZoom(value));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const rootChar = theme === 'spooky' ? '👻' : 'Φ';

  const scaledWidth = layout.width * zoom;
  const scaledHeight = layout.height * zoom;

  return (
    <div
      className="w-full min-h-[450px] max-h-[min(70vh,720px)] flex flex-col bg-[--color-surface]/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[--color-border] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-[--color-border] shrink-0">
        <span className="text-sm text-[--color-text-muted]" style={{ fontFamily: 'var(--font-body)' }}>
          {theme === 'spooky' ? 'Haunted grove' : 'Trie canvas'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoomClamped(zoom - ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-md border border-[--color-border] bg-[--color-bg] text-[--color-text] text-lg font-semibold hover:bg-[--color-primary]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="min-w-[3.5rem] h-9 px-2 rounded-md border border-[--color-border] bg-[--color-bg] text-[--color-text] text-sm font-medium hover:bg-[--color-primary]/10 transition-colors"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(zoom + ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-md border border-[--color-border] bg-[--color-bg] text-[--color-text] text-lg font-semibold hover:bg-[--color-primary]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="flex-1 overflow-auto p-2 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      >
        <div style={{ width: scaledWidth, height: scaledHeight, minWidth: '100%', minHeight: '100%' }}>
          <div
            style={{
              width: layout.width,
              height: layout.height,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="relative"
          >
            <svg
              width={layout.width}
              height={layout.height}
              className="absolute inset-0 pointer-events-none"
              aria-hidden
            >
              {layout.edges.map(({ fromId, toId }) => {
                const from = nodeById.get(fromId);
                const to = nodeById.get(toId);
                if (!from || !to) return null;

                const highlighted =
                  searchPath.includes(fromId) && searchPath.includes(toId);
                const x1 = from.x;
                const y1 = from.y + NODE_RADIUS;
                const x2 = to.x;
                const y2 = to.y - NODE_RADIUS;

                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={highlighted ? 'var(--color-highlight)' : 'var(--color-connector)'}
                    strokeWidth={highlighted ? 3 : 2}
                    strokeLinecap="round"
                    className={highlighted ? 'animate-pulse' : undefined}
                  />
                );
              })}
            </svg>

            {layout.nodes.map((node) => {
              const isHighlighted = searchPath.includes(node.id);
              const isPathEnd =
                searchPath.length > 0 && searchPath[searchPath.length - 1] === node.id;

              const stateClasses = isHighlighted
                ? 'bg-[--color-highlight] text-[--color-highlight-text] border-[--color-highlight-border] shadow-[0_0_14px_4px_var(--color-highlight)] animate-pulse'
                : node.isEndOfWord
                  ? 'bg-[--color-end-of-word] text-[--color-end-of-word-text] border-[--color-end-of-word-border] shadow-[0_0_12px_3px_var(--color-end-of-word)]'
                  : 'bg-[--color-node-bg] border-[--color-node-border] text-[--color-text]';

              const ringClass = isPathEnd
                ? 'ring-4 ring-[--color-primary] ring-offset-2 ring-offset-[--color-surface]'
                : '';

              return (
                <div
                  key={node.id}
                  className={`absolute flex items-center justify-center rounded-full border-2 font-bold leading-none transition-all duration-300 ease-in-out ${stateClasses} ${ringClass} ${node.isRoot ? 'text-2xl' : 'text-xl'}`}
                  style={{
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                    left: node.x - NODE_RADIUS,
                    top: node.y - NODE_RADIUS,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span className="select-none" aria-hidden={node.isRoot}>
                    {node.isRoot ? rootChar : node.char}
                  </span>
                  {node.isEndOfWord && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-base leading-none font-bold"
                      role="img"
                      aria-label="End of word"
                    >
                      {theme === 'spooky' ? '💀' : '✓'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrieVisualizer;
