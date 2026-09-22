import React, { useState } from 'react';
import { GameProps } from './GameTypes';

export const StackQueueGame: React.FC<GameProps> = ({ onNavigate, onLoseHeart, onWin }) => {
  const [stackData, setStackData] = useState<string[]>([]);
  const [queueData, setQueueData] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState<string>('');
  const [queueInput, setQueueInput] = useState<string>('');
  const [pushCount, setPushCount] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const handlePush = () => {
    if (!stackInput.trim()) return;
    setStackData((prev) => [...prev, stackInput.trim()]);
    setStackInput('');
    const nextCount = pushCount + 1;
    setPushCount(nextCount);

    if (nextCount >= 5 && !completed) {
      setCompleted(true);
      if (onWin) onWin('stack-queue-boss');
    }
  };

  const handlePop = () => {
    if (stackData.length === 0) {
      if (onLoseHeart) onLoseHeart();
      return;
    }
    setStackData((prev) => prev.slice(0, -1));
  };

  const handleEnqueue = () => {
    if (!queueInput.trim()) return;
    setQueueData((prev) => [...prev, queueInput.trim()]);
    setQueueInput('');
  };

  const handleDequeue = () => {
    if (queueData.length === 0) {
      if (onLoseHeart) onLoseHeart();
      return;
    }
    setQueueData((prev) => prev.slice(1));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-error uppercase tracking-widest">Boss Raid</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Stack &amp; Queue Boss</h1>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Exit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stack (LIFO) */}
        <div className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-headline-sm font-semibold text-primary">Stack (LIFO)</h2>
            <span className="text-label-sm font-code-inline text-outline">Target: 5 Pushes ({pushCount}/5)</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Item..."
              maxLength={12}
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-code-inline text-label-md outline-none flex-1"
            />
            <button
              onClick={handlePush}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
            >
              Push
            </button>
            <button
              onClick={handlePop}
              className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
            >
              Pop
            </button>
          </div>

          <div className="h-56 bg-surface-container-lowest rounded-xl p-4 flex flex-col-reverse gap-1.5 overflow-y-auto">
            {stackData.length === 0 ? (
              <span className="text-outline font-code-inline text-label-sm m-auto">Stack empty</span>
            ) : (
              stackData.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded font-code-inline text-label-sm text-center ${
                    idx === stackData.length - 1
                      ? 'bg-primary text-on-primary font-bold shadow'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {item} {idx === stackData.length - 1 && '← TOP'}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue (FIFO) */}
        <div className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4">
          <h2 className="text-headline-sm font-semibold text-secondary">Queue (FIFO)</h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Item..."
              maxLength={12}
              value={queueInput}
              onChange={(e) => setQueueInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-code-inline text-label-md outline-none flex-1"
            />
            <button
              onClick={handleEnqueue}
              className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md cursor-pointer"
            >
              Enqueue
            </button>
            <button
              onClick={handleDequeue}
              className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
            >
              Dequeue
            </button>
          </div>

          <div className="h-56 bg-surface-container-lowest rounded-xl p-4 flex items-center gap-2 overflow-x-auto">
            {queueData.length === 0 ? (
              <span className="text-outline font-code-inline text-label-sm m-auto">Queue empty</span>
            ) : (
              queueData.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded font-code-inline text-label-sm whitespace-nowrap ${
                    idx === 0
                      ? 'bg-secondary text-on-secondary font-bold shadow'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {item} {idx === 0 ? '← FRONT' : idx === queueData.length - 1 ? '← BACK' : ''}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {completed && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-secondary text-center space-y-2">
          <h3 className="text-headline-sm font-bold text-secondary">Demon Buffers Stabilized!</h3>
          <p className="text-body-sm text-tertiary font-code-inline">+35 XP Awarded</p>
        </div>
      )}
    </div>
  );
};