import React, { useState, useEffect } from 'react';

interface StackQueueBossProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

export const StackQueueBoss: React.FC<StackQueueBossProps> = ({ onComplete, onDamage }) => {
  const [stack, setStack] = useState<string[]>(['INT_01']);
  const [queue, setQueue] = useState<string[]>(['FRAME_01', 'FRAME_02']);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);

  // Producer stream
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.5) {
        setStack((s) => {
          if (s.length >= 6) {
            setHearts((h) => {
              const next = Math.max(0, h - 1);
              if (onDamage) onDamage();
              return next;
            });
            return [];
          }
          return [...s, `INT_${Math.floor(Math.random() * 90)}`];
        });
      } else {
        setQueue((q) => [...q, `FRAME_${Math.floor(Math.random() * 90)}`]);
      }
    }, 1100);

    return () => clearInterval(timer);
  }, [onDamage]);

  const handlePopStack = () => {
    if (stack.length > 0) {
      setStack((s) => s.slice(0, -1));
      setScore((sc) => sc + 15);
    }
  };

  const handleDequeue = () => {
    if (queue.length > 0) {
      setQueue((q) => q.slice(1));
      setScore((sc) => sc + 15);
    }
  };

  useEffect(() => {
    if (score >= 180) {
      const stars = hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1;
      onComplete(stars, 500);
    }
  }, [score, hearts, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 06 // BUFFER ALLOCATION RAID</span>
        <div className="flex items-center gap-6 text-xs">
          <div>DRAINED: <span className="text-[#3D8B66] font-bold">{score} / 180 XP</span></div>
          <div>LIVES: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* LIFO STACK */}
        <div className="bg-[#12151B] border border-[#262C36] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#DE5C34] font-bold">LIFO STACK (INTERRUPTS)</span>
            <span className={stack.length >= 5 ? 'text-red-400 font-bold' : 'text-gray-400'}>
              {stack.length} / 6 MAX
            </span>
          </div>

          <div className="flex-1 flex flex-col-reverse justify-start gap-1 py-4">
            {stack.map((item, idx) => (
              <div key={idx} className="bg-[#DE5C34]/20 border border-[#DE5C34] p-2 rounded text-xs text-center font-bold">
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handlePopStack}
            className="w-full py-3 bg-[#DE5C34] hover:bg-[#DE5C34]/80 text-white font-bold rounded-lg text-xs"
          >
            [POP] LIFO (TOP ITEM)
          </button>
        </div>

        {/* FIFO QUEUE */}
        <div className="bg-[#12151B] border border-[#262C36] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-blue-400 font-bold">FIFO QUEUE (STREAM)</span>
            <span className="text-gray-400">{queue.length} BUFFERED</span>
          </div>

          <div className="flex-1 flex flex-col justify-start gap-1 py-4">
            {queue.map((item, idx) => (
              <div key={idx} className="bg-blue-950/40 border border-blue-500/50 p-2 rounded text-xs text-center font-bold text-blue-300">
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleDequeue}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
          >
            [DEQUEUE] FIFO (HEAD ITEM)
          </button>
        </div>
      </div>
    </div>
  );
};