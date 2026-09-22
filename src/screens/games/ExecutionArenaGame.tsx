import React, { useState, useEffect } from 'react';
import { GameProps } from './GameTypes';

interface Step {
  l: number;
  v: Record<string, string>;
  s: string[];
  o: string;
}

const PROGS: Record<string, { lines: string[]; trace: Step[] }> = {
  sumArr: {
    lines: [
      'function sum(arr) {',
      '  let total = 0;',
      '  for (let i=0; i<arr.length; i++) {',
      '    total += arr[i];',
      '  }',
      '  return total;',
      '}',
      'sum([3,7,2]);',
    ],
    trace: [
      { l: 8, v: {}, s: [], o: '> sum([3,7,2])' },
      { l: 1, v: { arr: '[3,7,2]' }, s: ['sum(arr=[3,7,2])'], o: '' },
      { l: 2, v: { arr: '[3,7,2]', total: '0' }, s: ['sum(arr=[3,7,2])'], o: '' },
      { l: 3, v: { arr: '[3,7,2]', total: '0', i: '0' }, s: ['sum(...)'], o: 'i=0, 0<3 true' },
      { l: 4, v: { arr: '[3,7,2]', total: '3', i: '0' }, s: ['sum(...)'], o: 'total += arr[0] → 3' },
      { l: 3, v: { arr: '[3,7,2]', total: '3', i: '1' }, s: ['sum(...)'], o: 'i=1, 1<3 true' },
      { l: 4, v: { arr: '[3,7,2]', total: '10', i: '1' }, s: ['sum(...)'], o: 'total += arr[1] → 10' },
      { l: 3, v: { arr: '[3,7,2]', total: '10', i: '2' }, s: ['sum(...)'], o: 'i=2, 2<3 true' },
      { l: 4, v: { arr: '[3,7,2]', total: '12', i: '2' }, s: ['sum(...)'], o: 'total += arr[2] → 12' },
      { l: 3, v: { arr: '[3,7,2]', total: '12', i: '3' }, s: ['sum(...)'], o: 'i=3, 3<3 false — exit loop' },
      { l: 6, v: { arr: '[3,7,2]', total: '12' }, s: ['sum(...)'], o: 'return 12' },
      { l: 8, v: {}, s: [], o: '< 12' },
    ],
  },
  factorial: {
    lines: [
      'function factorial(n) {',
      '  if (n <= 1) return 1;',
      '  return n * factorial(n-1);',
      '}',
      'factorial(4);',
    ],
    trace: [
      { l: 5, v: {}, s: [], o: '> factorial(4)' },
      { l: 1, v: { n: '4' }, s: ['factorial(4)'], o: '' },
      { l: 2, v: { n: '4' }, s: ['factorial(4)'], o: '4<=1? false' },
      { l: 3, v: { n: '4' }, s: ['factorial(4)'], o: 'need factorial(3)...' },
      { l: 1, v: { n: '3' }, s: ['factorial(4)', 'factorial(3)'], o: '' },
      { l: 2, v: { n: '3' }, s: ['factorial(4)', 'factorial(3)'], o: '3<=1? false' },
      { l: 3, v: { n: '3' }, s: ['factorial(4)', 'factorial(3)'], o: 'need factorial(2)...' },
      { l: 1, v: { n: '2' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)'], o: '' },
      { l: 2, v: { n: '2' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)'], o: '2<=1? false' },
      { l: 3, v: { n: '2' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)'], o: 'need factorial(1)...' },
      { l: 1, v: { n: '1' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'], o: '' },
      { l: 2, v: { n: '1' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'], o: '1<=1 true → return 1' },
      { l: 3, v: { n: '2' }, s: ['factorial(4)', 'factorial(3)', 'factorial(2)'], o: '2 * 1 = 2, returns 2' },
      { l: 3, v: { n: '3' }, s: ['factorial(4)', 'factorial(3)'], o: '3 * 2 = 6, returns 6' },
      { l: 3, v: { n: '4' }, s: ['factorial(4)'], o: '4 * 6 = 24, returns 24' },
      { l: 5, v: {}, s: [], o: '< 24' },
    ],
  },
};

export const ExecutionArenaGame: React.FC<GameProps> = ({ onNavigate, onWin }) => {
  const [activeProg, setActiveProg] = useState<'sumArr' | 'factorial'>('sumArr');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const prog = PROGS[activeProg];
  const currentStep = prog.trace[stepIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= prog.trace.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, prog.trace.length]);

  useEffect(() => {
    if (stepIndex === prog.trace.length - 1 && !completed) {
      setCompleted(true);
      if (onWin) onWin('execution-arena');
    }
  }, [stepIndex, prog.trace.length, completed, onWin]);

  const outputLog = prog.trace
    .slice(0, stepIndex + 1)
    .filter((s) => Boolean(s.o))
    .map((s) => s.o);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Game 02</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Execution Arena</h1>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
          onClick={() => onNavigate('dashboard-quests', 'push_back')}
        >
          Exit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex gap-2 bg-surface-container-low p-2 rounded-xl">
            <button
              className={`px-4 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer ${
                activeProg === 'sumArr' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
              }`}
              onClick={() => {
                setActiveProg('sumArr');
                setStepIndex(0);
                setIsPlaying(false);
              }}
            >
              Sum Array (Loop)
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer ${
                activeProg === 'factorial' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
              }`}
              onClick={() => {
                setActiveProg('factorial');
                setStepIndex(0);
                setIsPlaying(false);
              }}
            >
              Factorial (Recursion)
            </button>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl font-code-block text-code-block relative">
            {prog.lines.map((line, idx) => {
              const isCurrent = currentStep.l === idx + 1;
              return (
                <div
                  key={idx}
                  className={`flex gap-4 px-2 py-1 rounded transition-colors ${
                    isCurrent ? 'bg-primary/20 border-l-2 border-primary text-primary' : 'text-on-surface'
                  }`}
                >
                  <span className="text-outline w-6 text-right select-none">{idx + 1}</span>
                  <pre className="font-code-block">{line}</pre>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl">
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
                onClick={() => {
                  setStepIndex(0);
                  setIsPlaying(false);
                }}
              >
                Reset
              </button>
              <button
                disabled={stepIndex === 0}
                className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-md text-label-md disabled:opacity-40 cursor-pointer"
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              >
                ◀ Back
              </button>
              <button
                className="px-4 py-1.5 rounded bg-tertiary text-on-tertiary font-label-md text-label-md cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                disabled={stepIndex === prog.trace.length - 1}
                className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-md text-label-md disabled:opacity-40 cursor-pointer"
                onClick={() => setStepIndex((prev) => Math.min(prog.trace.length - 1, prev + 1))}
              >
                Next ▶
              </button>
            </div>
            <span className="text-label-sm font-label-sm font-code-inline text-outline">
              Step {stepIndex + 1} / {prog.trace.length}
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Variables</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.keys(currentStep.v).length === 0 ? (
                <span className="text-outline text-label-sm">— Empty —</span>
              ) : (
                Object.entries(currentStep.v).map(([k, val]) => (
                  <span key={k} className="px-2 py-1 rounded bg-surface-container font-code-inline text-code-inline">
                    <strong className="text-secondary">{k}</strong>: <span className="text-tertiary">{val}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Call Stack</span>
            <div className="mt-2 flex flex-col-reverse gap-1.5">
              {currentStep.s.length === 0 ? (
                <span className="text-outline text-label-sm">— Empty —</span>
              ) : (
                currentStep.s.map((frame, fIdx) => (
                  <div
                    key={fIdx}
                    className={`p-2 rounded font-code-inline text-label-sm ${
                      fIdx === currentStep.s.length - 1
                        ? 'bg-primary/20 border border-primary text-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {frame}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Console Output</span>
            <div className="mt-2 bg-surface-container-lowest p-3 rounded font-code-inline text-label-sm text-secondary min-h-[90px] max-h-[140px] overflow-y-auto">
              {outputLog.map((line, oIdx) => (
                <div key={oIdx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};