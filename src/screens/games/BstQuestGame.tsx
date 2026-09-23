import React, { useState, useEffect } from 'react';

interface BstQuestProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

export const BstQuest: React.FC<BstQuestProps> = ({ onComplete, onDamage }) => {
  const [treeBalance, setTreeBalance] = useState(0); // -3 (heavy left) to +3 (heavy right)
  const [wavesCleared, setWavesCleared] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [nextValue, setNextValue] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate automatic insertion drifting balance
      setTreeBalance((prev) => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        const newBal = prev + drift;
        if (Math.abs(newBal) >= 3) {
          setHearts((h) => {
            const next = Math.max(0, h - 1);
            if (onDamage) onDamage();
            return next;
          });
          return 0; // Reset after collapse
        }
        return newBal;
      });
      setNextValue(Math.floor(Math.random() * 80) + 10);
    }, 2000);

    return () => clearInterval(timer);
  }, [onDamage]);

  const handleRotateLeft = () => {
    setTreeBalance((b) => b - 1);
    setWavesCleared((w) => w + 1);
  };

  const handleRotateRight = () => {
    setTreeBalance((b) => b + 1);
    setWavesCleared((w) => w + 1);
  };

  useEffect(() => {
    if (wavesCleared >= 6) {
      const stars = hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1;
      onComplete(stars, 350);
    }
  }, [wavesCleared, hearts, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 05 // AVL TREE REBALANCER</span>
        <div className="flex items-center gap-6 text-xs">
          <div>REBALANCES: <span className="text-[#3D8B66] font-bold">{wavesCleared} / 6</span></div>
          <div>LIVES: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      <div className="flex-1 bg-[#12151B] border border-[#262C36] rounded-xl p-8 flex flex-col justify-between items-center">
        <div className="text-center">
          <span className="text-xs text-amber-400">INCOMING VALUE: [{nextValue}]</span>
          <h2 className="text-sm font-bold text-white mt-1">Subtree Invariant Balance Gauge</h2>
        </div>

        {/* Tree Tilt Visualizer */}
        <div
          style={{ transform: `rotate(${treeBalance * 12}deg)` }}
          className="w-64 h-32 border-b-4 border-[#DE5C34] flex justify-between items-end px-4 transition-transform duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-[#15181E] border-2 border-blue-400 flex items-center justify-center font-bold text-xs">
            LEFT
          </div>
          <div className="w-12 h-12 rounded-full bg-[#15181E] border-2 border-amber-400 flex items-center justify-center font-bold text-xs">
            RIGHT
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-gray-400">
          Balance Factor: <span className="text-white font-bold">{treeBalance}</span> (Collapse threshold: ±3)
        </div>

        {/* Rotation Controls */}
        <div className="flex gap-6">
          <button
            onClick={handleRotateLeft}
            className="px-6 py-3 bg-[#15181E] border border-blue-500 hover:bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold"
          >
            ↺ ROTATE LEFT (AVL)
          </button>
          <button
            onClick={handleRotateRight}
            className="px-6 py-3 bg-[#15181E] border border-amber-500 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold"
          >
            ↻ ROTATE RIGHT (AVL)
          </button>
        </div>
      </div>
    </div>
  );
};