import type { TrieNodeData } from '../types';

export const NODE_SIZE = 52;
export const HORIZONTAL_GAP = 64;
export const VERTICAL_GAP = 96;
export const LAYOUT_PADDING = 40;

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  char: string | null;
  isEndOfWord: boolean;
  isRoot: boolean;
}

export interface LayoutEdge {
  fromId: string;
  toId: string;
}

export interface TrieLayout {
  nodes: PositionedNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
}

function layoutSubtree(
  node: TrieNodeData,
  depth: number,
  xOffset: number,
  positions: Map<string, { x: number; y: number }>,
): number {
  const children = Object.values(node.children).sort((a, b) => a.char.localeCompare(b.char));

  if (children.length === 0) {
    const x = xOffset + HORIZONTAL_GAP / 2;
    positions.set(node.id, { x, y: depth * VERTICAL_GAP });
    return xOffset + HORIZONTAL_GAP;
  }

  let currentX = xOffset;
  const childCenters: number[] = [];

  for (const child of children) {
    currentX = layoutSubtree(child, depth + 1, currentX, positions);
    childCenters.push(positions.get(child.id)!.x);
  }

  const parentX = (childCenters[0] + childCenters[childCenters.length - 1]) / 2;
  positions.set(node.id, { x: parentX, y: depth * VERTICAL_GAP });

  return currentX;
}

function collectNodesAndEdges(
  node: TrieNodeData,
  positions: Map<string, { x: number; y: number }>,
  nodes: PositionedNode[],
  edges: LayoutEdge[],
): void {
  const pos = positions.get(node.id);
  if (!pos) return;

  nodes.push({
    id: node.id,
    x: pos.x + LAYOUT_PADDING,
    y: pos.y + LAYOUT_PADDING,
    char: node.char,
    isEndOfWord: node.isEndOfWord,
    isRoot: node.char === 'root',
  });

  for (const child of Object.values(node.children)) {
    edges.push({ fromId: node.id, toId: child.id });
    collectNodesAndEdges(child, positions, nodes, edges);
  }
}

export function computeTrieLayout(root: TrieNodeData): TrieLayout {
  const positions = new Map<string, { x: number; y: number }>();
  const treeWidth = layoutSubtree(root, 0, 0, positions);

  const nodes: PositionedNode[] = [];
  const edges: LayoutEdge[] = [];
  collectNodesAndEdges(root, positions, nodes, edges);

  const maxY = nodes.reduce((max, n) => Math.max(max, n.y), 0);

  return {
    nodes,
    edges,
    width: Math.max(treeWidth + LAYOUT_PADDING * 2, NODE_SIZE + LAYOUT_PADDING * 2),
    height: maxY + NODE_SIZE + LAYOUT_PADDING,
  };
}
