import React, { useState, useEffect } from 'react';
import { GameProps } from './GameTypes';

interface SortFrame {
  a: number[];
  cmp: number[];
  sorted: number[];
  c: number;
  s: number;
}

function buildFrames(initialArr: number[]): SortFrame[] {
  const a = [...initialArr];
  const n = a.length;
  const frames: SortFrame[] = [];
  let c = 0;
  let s = 0;

  frames.push({ a: [...a], cmp: [], sorted: [], c, s });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      c++;
      frames.push({ a: [...a], cmp: [j, j + 1], sorted: [], c, s });
      if (a[j] > a[j + 1]) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        s++;
        frames.push({ a: [...a], cmp: [j, j + 1], sorted: [], c, s });
      }
    }
    frames.push({
      a: [...a],
      cmp: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      c,
      s,
    });
  }

  frames.push({
    a: [...a],
    cmp: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    c,
    s,
  });

  return frames;
}

export const SortArenaGame: React.FC<GameProps> = ({ onNavigate, onWin }) => {
  const [frames, setFrames] = useState<SortFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const initShuffle = () => {
    const raw = Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 10);
    const generated = buildFrames(raw);
    setFrames(generated);
    setFrameIdx(0);
    setIsPlaying(false);
    setCompleted(false);
  };

  useEffect(() => {
    initShuffle();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setFrameIdx((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, frames.length]);

  useEffect(() => {
    if (frames.length > 0 && frameIdx === frames.length - 1 && !completed) {
      setCompleted(true);
      if (onWin) onWin('sort-arena');
    }
  }, [frameIdx, frames.length, completed, onWin]);

  const curr = frames[frameIdx] || { a: [], cmp: [], sorted: [], c: 0, s: 0 };
  const maxVal = Math.max(...(curr.a.length ? curr.a : [100]));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Game 03</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Sort Arena</h1>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Exit
        </button>
      </div>

      <div className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4">
        <div className="flex justify-between items-center text-label-sm font-code-inline text-outline">
          <span>Comparisons: <strong className="text-tertiary">{curr.c}</strong></span>
          <span>Swaps: <strong className="text-error">{curr.s}</strong></span>
          <span>Frame: {frameIdx + 1} / {frames.length}</span>
        </div>

        <div className="h-64 bg-surface-container-lowest rounded-xl p-4 flex items-end gap-2">
          {curr.a.map((val, idx) => {
            const isComparing = curr.cmp.includes(idx);
            const isSorted = curr.sorted.includes(idx);
            const heightPercent = Math.max(8, (val / maxVal) * 100);

            return (
              <div
                key={idx}
                style={{ height: `${heightPercent}%` }}
                className={`flex-1 rounded-t transition-all flex flex-col items-center justify-start pt-1 font-code-inline text-[10px] ${
                  isComparing
                    ? 'bg-tertiary text-on-tertiary shadow-lg'
                    : isSorted
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary-container text-on-primary-container'
                }`}
              >
                {val}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={initShuffle}
            className="px-4 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Shuffle Array
          </button>
          <div className="flex gap-2">
            <button
              disabled={frameIdx === 0}
              onClick={() => setFrameIdx((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-md text-label-md disabled:opacity-40 cursor-pointer"
            >
              ◀ Back
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              disabled={frameIdx === frames.length - 1}
              onClick={() => setFrameIdx((prev) => Math.min(frames.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-md text-label-md disabled:opacity-40 cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>

        {completed && (
          <div className="p-4 rounded-xl bg-surface-container-low border border-secondary text-center">
            <h3 className="text-headline-sm font-bold text-secondary">Array Completely Sorted!</h3>
            <p className="text-body-sm text-tertiary font-code-inline mt-1">+40 XP Awarded</p>
          </div>
        )}
      </div>
    </div>
  );
};