import React, { useState } from 'react';
import { ScreenType, TransitionType, PlayerState } from '../../types';
import { submitQuest, ApiError } from '../../api/client';
import { GameProps } from './GameTypes';

// Import game modules
import * as SyntaxModule from './SyntaxDungeonGame';
import * as ExecModule from './ExecutionArenaGame';
import * as SortModule from './SortArenaGame';
import * as HanoiModule from './HanoiGame';
import * as BstModule from './BstQuestGame';
import * as StackModule from './StackQueueGame';

interface GameArenaScreenProps {
  questId: string | null;
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  playerState?: PlayerState;
  setPlayerState?: React.Dispatch<React.SetStateAction<PlayerState>>;
}

// Safely extract component whether it was exported as default or named export
const resolveComponent = (mod: any, name: string): React.FC<GameProps> => {
  return mod[name] || mod.default || mod;
};

const GAME_COMPONENTS: Record<string, React.FC<GameProps>> = {
  'syntax-dungeon': resolveComponent(SyntaxModule, 'SyntaxDungeon'),
  'execution-arena': resolveComponent(ExecModule, 'ExecutionArena'),
  'sort-arena': resolveComponent(SortModule, 'SortArena'),
  'tower-of-hanoi': resolveComponent(HanoiModule, 'TowerOfHanoi'),
  'bst-quest': resolveComponent(BstModule, 'BstQuest'),
  'stack-queue-boss': resolveComponent(StackModule, 'StackQueueBoss'),
};

export const GameArenaScreen: React.FC<GameArenaScreenProps> = ({
  questId,
  onNavigate,
  playerState,
  setPlayerState,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLoseHeart = () => {
    if (setPlayerState) {
      setPlayerState((prev) => ({
        ...prev,
        lives: Math.max(0, (prev?.lives ?? 5) - 1),
      }));
    }
  };

  const handleWin = async (id: string) => {
    try {
      const result = await submitQuest(id);
      if (setPlayerState && result) {
        setPlayerState((prev) => {
          const res = result as Record<string, any>;
          const updatedXp = res.newXp ?? res.currentXp ?? res.xp ?? (prev?.currentXp ?? 0);
          const updatedLevel = res.newLevel ?? res.level ?? (prev?.level ?? 1);

          return {
            ...prev,
            currentXp: updatedXp,
            level: updatedLevel,
          };
        });
      }
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Failed to record quest progress.');
    }
  };

  const ActiveGame = questId ? GAME_COMPONENTS[questId] : undefined;

  if (!ActiveGame || typeof ActiveGame !== 'function') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="text-headline-lg text-on-surface font-bold">Quest Protocol Not Found</h2>
        <p className="text-on-surface-variant font-body-md mt-2 max-w-md">
          Unrecognized quest identifier: <code className="text-secondary">{questId || 'null'}</code>.
        </p>
        <button
          className="mt-6 px-6 py-2 rounded-xl bg-primary text-on-primary font-headline-sm cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {apiError && (
        <div className="w-full bg-error-container/30 text-error text-center py-1 text-label-sm font-label-sm">
          {apiError}
        </div>
      )}
      <ActiveGame
        onNavigate={onNavigate}
        playerState={playerState}
        setPlayerState={setPlayerState}
        onLoseHeart={handleLoseHeart}
        onWin={handleWin}
      />
    </div>
  );
};