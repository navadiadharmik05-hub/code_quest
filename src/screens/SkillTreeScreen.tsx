import React, { useState } from 'react';
import { ScreenType, TransitionType } from '../types';

interface SkillTreeScreenProps {
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  onStartGame?: (questId: string) => void;
  clearedQuestIds?: string[];
  playerState?: { currentXp: number; level: number };
}

const NODE_TO_QUEST_MAP: Record<string, string> = {
  'node-1-2': 'syntax-dungeon',
  'node-2-2': 'execution-arena',
  'node-3-2': 'sort-arena',
  'node-3-3': 'stack-queue-boss',
  'node-4-1': 'tower-of-hanoi',
  'node-4-2': 'bst-quest',
  'node-5-1': 'stack-queue-boss',
};

export const SkillTreeScreen: React.FC<SkillTreeScreenProps> = ({
  onNavigate,
  onStartGame,
  playerState,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-2-2');

  const handleLaunch = (nodeId: string) => {
    const targetQuest = NODE_TO_QUEST_MAP[nodeId] || 'syntax-dungeon';
    if (onStartGame) {
      onStartGame(targetQuest);
    } else {
      onNavigate('practice-arena', 'push');
    }
  };

  return (
    <div className="flex flex-col w-full min-w-0 pb-space-xl px-margin max-w-[1720px] mx-auto pt-6 gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest block">DAG Master</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Curriculum Progression Map</h1>
        </div>
        <div className="flex items-center gap-2 font-code-inline text-label-md text-tertiary">
          <span>{(playerState?.currentXp ?? 0).toLocaleString()} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-surface-container flex flex-col gap-6">
          <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Select Node</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: 'node-1-2', name: 'Syntax Dungeon', tier: 'Tier 1' },
              { id: 'node-2-2', name: 'Execution Arena', tier: 'Tier 2' },
              { id: 'node-3-2', name: 'Sort Arena', tier: 'Tier 3' },
              { id: 'node-4-1', name: 'Tower of Hanoi', tier: 'Tier 4' },
              { id: 'node-4-2', name: 'BST Quest', tier: 'Tier 4' },
              { id: 'node-5-1', name: 'Stack & Queue Boss', tier: 'Tier 5' },
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedNodeId === node.id
                    ? 'bg-surface-container-high border-secondary shadow-md'
                    : 'bg-surface-container border-transparent hover:border-outline-variant'
                }`}
              >
                <span className="text-label-sm font-label-sm text-secondary block">{node.tier}</span>
                <h3 className="text-headline-sm font-bold text-on-surface mt-1">{node.name}</h3>
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 bg-surface-container-low p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block">Inspecting</span>
            <h2 className="text-headline-md font-bold text-on-surface mt-1">
              {NODE_TO_QUEST_MAP[selectedNodeId]?.toUpperCase().replace(/-/g, ' ')}
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-2">
              Launch directly into this module to solve puzzles, earn verified XP, and unlock accolades.
            </p>
          </div>

          <button
            onClick={() => handleLaunch(selectedNodeId)}
            className="w-full mt-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            <span>Launch Quest</span>
          </button>
        </aside>
      </div>
    </div>
  );
};