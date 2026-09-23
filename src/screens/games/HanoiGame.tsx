import React, { useState, useEffect } from 'react';

interface TowerOfHanoiProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

export const TowerOfHanoi: React.FC<TowerOfHanoiProps> = ({ onComplete, onDamage }) => {
  const [towers, setTowers] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [hearts, setHearts] = useState(5);
  const optimalMoves = 7; // For 3 discs: 2^3 - 1 = 7

  const handleTowerClick = (index: number) => {
    if (selectedTower === null) {
      if (towers[index].length > 0) setSelectedTower(index);
    } else {
      if (selectedTower === index) {
        setSelectedTower(null);
        return;
      }

      const source = towers[selectedTower];
      const target = towers[index];
      const disc = source[source.length - 1];

      // Validation
      if (target.length === 0 || target[target.length - 1] > disc) {
        const newTowers = towers.map((t, idx) => {
          if (idx === selectedTower) return t.slice(0, -1);
          if (idx === index) return [...t, disc];
          return t;
        });

        setTowers(newTowers);
        setMoves((m) => m + 1);
        setSelectedTower(null);
      } else {
        // Illegal placement
        setHearts((h) => {
          const next = Math.max(0, h - 1);
          if (onDamage) onDamage();
          return next;
        });
        setSelectedTower(null);
      }
    }
  };

  // Check victory
  useEffect(() => {
    if (towers[2].length === 3) {
      const stars = moves <= optimalMoves ? 3 : moves <= optimalMoves + 3 ? 2 : 1;
      onComplete(stars, 300);
    }
  }, [towers, moves, optimalMoves, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 04 // POWER CORE RESONANCE (HANOI)</span>
        <div className="flex items-center gap-6 text-xs">
          <div>MOVES: <span className="text-amber-400 font-bold">{moves}</span> (OPTIMAL: {optimalMoves})</div>
          <div>LIVES: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      <div className="flex-1 bg-[#12151B] border border-[#262C36] rounded-xl p-8 flex flex-col justify-end">
        <div className="grid grid-cols-3 gap-8 items-end h-64 border-b-4 border-[#262C36] pb-2">
          {towers.map((tower, tIdx) => (
            <button
              key={tIdx}
              onClick={() => handleTowerClick(tIdx)}
              className={`flex flex-col-reverse items-center justify-start h-full relative group transition-all ${
                selectedTower === tIdx ? 'bg-[#DE5C34]/10 rounded-t-xl' : ''
              }`}
            >
              {/* Peg Rod */}
              <div className="absolute w-2.5 h-48 bg-[#262C36] rounded-t-full bottom-0" />

              {/* Stacked Discs */}
              {tower.map((size) => (
                <div
                  key={size}
                  style={{ width: `${size * 30 + 40}px` }}
                  className={`h-7 rounded mb-1 z-10 border transition-all ${
                    size === 1
                      ? 'bg-amber-500 border-amber-300'
                      : size === 2
                      ? 'bg-orange-600 border-orange-400'
                      : 'bg-[#DE5C34] border-red-400'
                  }`}
                />
              ))}
              <span className="absolute -bottom-8 text-xs font-bold text-[#8C94A4]">
                PYLON 0{tIdx + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};