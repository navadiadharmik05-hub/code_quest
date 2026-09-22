import React, { useState } from 'react';
import { GameProps } from './GameTypes';

class TreeNode {
  v: number;
  l: TreeNode | null = null;
  r: TreeNode | null = null;
  constructor(v: number) {
    this.v = v;
  }
}

function bstInsert(root: TreeNode | null, v: number): TreeNode {
  if (!root) return new TreeNode(v);
  if (v < root.v) root.l = bstInsert(root.l, v);
  else if (v > root.v) root.r = bstInsert(root.r, v);
  return root;
}

function bstSearch(root: TreeNode | null, v: number, path: number[] = []): number[] | null {
  if (!root) return null;
  path.push(root.v);
  if (v === root.v) return path;
  if (v < root.v) return bstSearch(root.l, v, path);
  return bstSearch(root.r, v, path);
}

function inorder(root: TreeNode | null, res: number[] = []): number[] {
  if (!root) return res;
  inorder(root.l, res);
  res.push(root.v);
  inorder(root.r, res);
  return res;
}

export const BstQuestGame: React.FC<GameProps> = ({ onNavigate, onWin }) => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [insertedList, setInsertedList] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [highlightPath, setHighlightPath] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleInsert = () => {
    const num = parseInt(inputValue, 10);
    setInputValue('');
    if (isNaN(num) || num < 1 || num > 999) return;
    if (insertedList.includes(num)) return;

    const newRoot = bstInsert(root, num);
    const nextList = [...insertedList, num];
    setRoot(newRoot);
    setInsertedList(nextList);
    setHighlightPath([num]);

    if (nextList.length >= 5 && !completed) {
      setCompleted(true);
      if (onWin) onWin('bst-quest');
    }
  };

  const handleSearch = () => {
    const num = parseInt(searchValue, 10);
    setSearchValue('');
    if (isNaN(num)) return;
    const path = bstSearch(root, num);
    setHighlightPath(path || []);
  };

  const positions: Record<number, { x: number; y: number }> = {};
  let xi = 0;
  const assignPos = (node: TreeNode | null, depth: number) => {
    if (!node) return;
    assignPos(node.l, depth + 1);
    positions[node.v] = { x: xi * 60 + 40, y: depth * 60 + 40 };
    xi++;
    assignPos(node.r, depth + 1);
  };
  assignPos(root, 0);

  const lines: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];

  const draw = (node: TreeNode | null) => {
    if (!node) return;
    const parentPos = positions[node.v];

    if (node.l && positions[node.l.v]) {
      lines.push(
        <line
          key={`l-${node.v}-${node.l.v}`}
          x1={parentPos.x}
          y1={parentPos.y}
          x2={positions[node.l.v].x}
          y2={positions[node.l.v].y}
          stroke="#494454"
          strokeWidth="2"
        />
      );
    }
    if (node.r && positions[node.r.v]) {
      lines.push(
        <line
          key={`r-${node.v}-${node.r.v}`}
          x1={parentPos.x}
          y1={parentPos.y}
          x2={positions[node.r.v].x}
          y2={positions[node.r.v].y}
          stroke="#494454"
          strokeWidth="2"
        />
      );
    }

    const isHL = highlightPath.includes(node.v);
    nodes.push(
      <g key={`n-${node.v}`}>
        <circle
          cx={parentPos.x}
          cy={parentPos.y}
          r={18}
          className={isHL ? 'fill-tertiary stroke-tertiary' : 'fill-surface-container-high stroke-primary'}
          strokeWidth="2"
        />
        <text
          x={parentPos.x}
          y={parentPos.y + 4}
          textAnchor="middle"
          className="font-code-inline text-[11px] font-bold fill-on-surface select-none"
        >
          {node.v}
        </text>
      </g>
    );

    draw(node.l);
    draw(node.r);
  };
  draw(root);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Game 05</span>
          <h1 className="text-headline-lg font-bold text-on-surface">BST Quest</h1>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Exit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value (1-999)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-code-inline text-label-md outline-none flex-1"
            />
            <button
              onClick={handleInsert}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
            >
              Insert
            </button>
            <input
              type="number"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-code-inline text-label-md outline-none w-28"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
            >
              Search
            </button>
          </div>

          <div className="h-72 bg-surface-container-lowest rounded-xl overflow-auto p-4 flex items-center justify-center">
            {root ? (
              <svg className="w-full h-full min-w-[320px] min-h-[220px]">
                {lines}
                {nodes}
              </svg>
            ) : (
              <span className="text-outline font-code-inline text-label-sm">Insert nodes to begin building the tree</span>
            )}
          </div>

          {completed && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-secondary text-center">
              <h3 className="text-headline-sm font-bold text-secondary">Tree Built (5+ Nodes)!</h3>
              <p className="text-body-sm text-tertiary font-code-inline mt-1">+60 XP Awarded</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm space-y-3">
            <div>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block">Nodes Inserted</span>
              <span className="text-headline-sm font-bold text-primary font-code-inline">{insertedList.length} / 5</span>
            </div>
            <div>
              <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block">In-Order Traversal</span>
              <span className="text-label-sm font-code-inline text-secondary break-all">
                {inorder(root).join(' → ') || '—'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setRoot(null);
              setInsertedList([]);
              setHighlightPath([]);
              setCompleted(false);
            }}
            className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Clear Tree
          </button>
        </div>
      </div>
    </div>
  );
};