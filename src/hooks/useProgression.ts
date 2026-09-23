import { useState, useEffect, useCallback } from 'react';
import { setSfxEnabled } from '../utils/audio';

const KEY_CLEARED = 'cq_cleared_quests';
const KEY_XP = 'cq_xp';
const KEY_SFX = 'cq_sfx_enabled';

export interface ProgressionState {
  clearedQuests: string[];
  xp: number;
  hearts: number;
  sfxEnabled: boolean;
  // Derived lock flags
  node01Unlocked: boolean;
  node02Unlocked: boolean;
  node03Unlocked: boolean;
  node04Unlocked: boolean;
  node05Unlocked: boolean;
  node06Unlocked: boolean;
  // Mutators
  completeQuest: (questId: string, xpReward: number) => void;
  updateHearts: (updater: (prev: number) => number) => void;
  toggleSfx: () => void;
}

export function useProgression(): ProgressionState {
  const [clearedQuests, setClearedQuests] = useState<string[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(5);
  const [sfxEnabled, setSfxState] = useState<boolean>(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_CLEARED);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setClearedQuests(parsed);
      }
    } catch { /* ignore */ }

    try {
      const rawXp = localStorage.getItem(KEY_XP);
      if (rawXp !== null) {
        const parsed = Number(rawXp);
        if (!isNaN(parsed)) setXp(parsed);
      }
    } catch { /* ignore */ }

    try {
      const rawSfx = localStorage.getItem(KEY_SFX);
      if (rawSfx !== null) {
        const enabled = rawSfx !== 'false';
        setSfxState(enabled);
        setSfxEnabled(enabled);
      }
    } catch { /* ignore */ }
  }, []);

  const completeQuest = useCallback((questId: string, xpReward: number) => {
    setClearedQuests(prev => {
      const next = prev.includes(questId) ? prev : [...prev, questId];
      try { localStorage.setItem(KEY_CLEARED, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setXp(prev => {
      const next = prev + xpReward;
      try { localStorage.setItem(KEY_XP, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateHearts = useCallback((updater: (prev: number) => number) => {
    setHearts(prev => {
      const next = Math.max(0, Math.min(5, updater(prev)));
      return next;
    });
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxState(prev => {
      const next = !prev;
      setSfxEnabled(next);
      try { localStorage.setItem(KEY_SFX, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Derived node-lock invariants per spec
  const isG1 = clearedQuests.includes('syntax-dungeon');
  const isG2 = clearedQuests.includes('execution-arena');
  const isG3 = clearedQuests.includes('sort-arena');
  const isG4 = clearedQuests.includes('tower-of-hanoi');
  const isG5 = clearedQuests.includes('bst-quest');

  return {
    clearedQuests,
    xp,
    hearts,
    sfxEnabled,
    // Node 01 always unlocked
    node01Unlocked: true,
    // Nodes 02 + 03 require syntax-dungeon cleared
    node02Unlocked: isG1,
    node03Unlocked: isG1,
    // Node 04 requires execution-arena cleared
    node04Unlocked: isG2,
    // Node 05 requires sort-arena cleared
    node05Unlocked: isG3,
    // Node 06 requires BOTH tower-of-hanoi AND bst-quest
    node06Unlocked: isG4 && isG5,
    completeQuest,
    updateHearts,
    toggleSfx,
  };
}
