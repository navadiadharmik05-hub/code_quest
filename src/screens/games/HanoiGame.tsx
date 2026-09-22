import React, { useState } from 'react';
import { GameProps } from './GameTypes';

const COLORS = ['#f9c74f', '#ff6b9d', '#7b6ff7', '#43e97b', '#00d4ff'];
const MIN_MOVES: Record<number, number> = { 3: 7, 4: 15, 5: 31 };

export const HanoiGame: React.FC<GameProps> = ({ onNavigate, onLoseHeart, onWin }) => {
  const [diskCount, setDiskCount] = useState<number>(3);
  const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);

  const resetGame = (count: number) => {
    setDiskCount(count);
    const initialPeg: number[] = [];
    for (let i = count; i >= 1; i--) initialPeg.push(i);
    setPegs([initialPeg, [], []]);
    setSelectedPeg(null);
    setMoves(0);
    setWon(false);
  };

  const handlePegClick = (pegIdx: number) => {
    if (won) return;

    if (selectedPeg === null) {
      if (pegs[pegIdx].length === 0) return;
      setSelectedPeg(pegIdx);
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null);
        return;
      }

      const sourceDisk = pegs[selectedPeg][pegs[selectedPeg].length - 1];
      const targetPegDisks = pegs[pegIdx];

      if (targetPegDisks.length > 0 && targetPegDisks[targetPegDisks.length - 1] < sourceDisk) {
        if (onLoseHeart) onLoseHeart();
        setSelectedPeg(null);
        return;
      }

      const updated = pegs.map((arr, i) => {
        if (i === selectedPeg) return arr.slice(0, -1);
        if (i === pegIdx) return [...arr, sourceDisk];
        return arr;
      });

      const nextMoves = moves + 1;
      setPegs(updated);
      setMoves(nextMoves);
      setSelectedPeg(null);

      if (updated[2].length === diskCount) {
        setWon(true);
        if (onWin) onWin('tower-of-hanoi');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Game 04</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Tower of Hanoi</h1>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Exit
        </button>
      </div>

      <div className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[3, 4, 5].map((count) => (
              <button
                key={count}
                onClick={() => resetGame(count)}
                className={`px-4 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer ${
                  diskCount === count ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {count} Disks
              </button>
            ))}
          </div>
          <div className="font-code-inline text-label-md text-on-surface-variant">
            Moves: <strong className="text-tertiary">{moves}</strong> (Optimal: {MIN_MOVES[diskCount]})
          </div>
        </div>

        <div className="relative h-64 bg-surface-container-lowest rounded-xl flex items-end justify-around pb-6 pt-12">
          {[0, 1, 2].map((pegIdx) => {
            const isSelected = selectedPeg === pegIdx;
            return (
              <div
                key={pegIdx}
                onClick={() => handlePegClick(pegIdx)}
                className={`relative w-1/4 h-full flex flex-col items-center justify-end cursor-pointer rounded-lg transition-all ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-surface-container-high/40'
                }`}
              >
                <div className="absolute top-6 bottom-0 w-2 bg-surface-container-highest rounded-t pointer-events-none" />
                <div className="z-10 flex flex-col-reverse items-center gap-1 w-full pb-1 pointer-events-none">
                  {pegs[pegIdx].map((disk, dIdx) => {
                    const widthPercent = (disk / diskCount) * 80;
                    return (
                      <div
                        key={dIdx}
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: COLORS[disk - 1] || '#999',
                        }}
                        className="h-6 rounded-full flex items-center justify-center font-code-inline text-[11px] font-bold text-slate-900 shadow"
                      >
                        {disk}
                      </div>
                    );
                  })}
                </div>
                <span className="mt-2 font-headline-sm text-label-sm text-outline">
                  {['Peg A', 'Peg B', 'Peg C'][pegIdx]}
                </span>
              </div>
            );
          })}
        </div>

        {won && (
          <div className="p-4 rounded-xl bg-surface-container-low border border-secondary text-center space-y-2">
            <h3 className="text-headline-sm font-bold text-secondary">Tower Successfully Conquered!</h3>
            <p className="text-body-sm text-tertiary font-code-inline">+50 XP Awarded</p>
          </div>
        )}
      </div>
    </div>
  );
};