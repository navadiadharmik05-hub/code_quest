import React, { useState, useEffect } from 'react';

interface ExecutionArenaProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

interface StackFrame {
  id: number;
  fnName: string;
  arg: number;
  isBaseCase: boolean;
}

export const ExecutionArena: React.FC<ExecutionArenaProps> = ({ onComplete, onDamage }) => {
  const [frames, setFrames] = useState<StackFrame[]>([
    { id: 1, fnName: 'recurse_eval', arg: 5, isBaseCase: false },
  ]);
  const [depthLimit] = useState(8);
  const [clearedFrames, setClearedFrames] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [log, setLog] = useState('Execution cycle running. Monitor stack boundary.');

  // Push frames over time simulating active execution
  useEffect(() => {
    const interval = setInterval(() => {
      setFrames((prev) => {
        if (prev.length === 0) {
          // Restart with a new call
          return [{ id: Date.now(), fnName: 'recurse_eval', arg: Math.floor(Math.random() * 6) + 3, isBaseCase: false }];
        }
        if (prev.length >= depthLimit) {
          // Overflow penalty!
          setHearts((h) => {
            const nextH = Math.max(0, h - 1);
            if (onDamage) onDamage();
            return nextH;
          });
          setLog('CRITICAL: StackOverflowError triggered! Buffer cleared.');
          return [{ id: Date.now(), fnName: 'main_entry', arg: 4, isBaseCase: false }];
        }

        const top = prev[prev.length - 1];
        if (top.arg <= 1) {
          // Ready to pop
          return prev;
        }

        // Spawn next recursive call
        const nextArg = top.arg - 1;
        return [
          ...prev,
          {
            id: Date.now(),
            fnName: 'recurse_eval',
            arg: nextArg,
            isBaseCase: nextArg <= 1,
          },
        ];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [depthLimit, onDamage]);

  // Handle emergency pop
  const handlePop = () => {
    setFrames((prev) => {
      if (prev.length === 0) return prev;
      const top = prev[prev.length - 1];
      if (top.isBaseCase || top.arg <= 1) {
        setClearedFrames((c) => c + 1);
        setLog(`RESOLVED: Frame popped cleanly with return value.`);
        return prev.slice(0, -1);
      } else {
        setHearts((h) => {
          const nextH = Math.max(0, h - 1);
          if (onDamage) onDamage();
          return nextH;
        });
        setLog(`ERROR: Premature pop! Frame arg ${top.arg} has not met base condition.`);
        return prev;
      }
    });
  };

  // Handle base case insertion
  const handleForceBaseCase = () => {
    setFrames((prev) => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      copy[copy.length - 1].isBaseCase = true;
      copy[copy.length - 1].arg = 1;
      setLog(`OVERRIDE: Base case return injected into active frame.`);
      return copy;
    });
  };

  // Win condition
  useEffect(() => {
    if (clearedFrames >= 8) {
      const stars = hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1;
      onComplete(stars, 200);
    }
  }, [clearedFrames, hearts, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      {/* Top Telemetry */}
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 02 // CALL STACK OVERDRIVE</span>
        <div className="flex items-center gap-6 text-xs">
          <div>RESOLVED FRAMES: <span className="text-[#3D8B66] font-bold">{clearedFrames} / 8</span></div>
          <div>LIVES: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Left: Code Viewer */}
        <div className="col-span-7 bg-[#12151B] border border-[#262C36] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#8C94A4] border-b border-[#262C36] pb-2 mb-3">subroutine_trace.py</div>
            <pre className="text-xs text-[#F1F3F7] leading-relaxed space-y-1">
              <div><span className="text-purple-400">def</span> <span className="text-yellow-300">recurse_eval</span>(n: <span className="text-blue-300">int</span>):</div>
              <div className="pl-4 text-gray-500"># Injected base case condition:</div>
              <div className="pl-4"><span className="text-purple-400">if</span> n &lt;= 1:</div>
              <div className="pl-8 text-green-400">return 1</div>
              <div className="pl-4 text-gray-500"># Danger: Spawns recursive frame</div>
              <div className="pl-4"><span className="text-purple-400">return</span> n * recurse_eval(n - 1)</div>
            </pre>
          </div>
          <div className="bg-[#15181E] p-3 rounded-lg border border-[#262C36] text-xs text-[#E5A93C]">
            STATUS: {log}
          </div>
        </div>

        {/* Right: Stack Column Visualization */}
        <div className="col-span-5 bg-[#12151B] border border-[#262C36] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-[#8C94A4] border-b border-[#262C36] pb-2">
            <span>CALL STACK BUFFER</span>
            <span className={frames.length >= 6 ? 'text-red-400 font-bold animate-pulse' : 'text-[#3D8B66]'}>
              {frames.length} / {depthLimit} MAX DEPTH
            </span>
          </div>

          {/* Stack Cylinder */}
          <div className="flex-1 flex flex-col-reverse justify-start gap-2 py-4 px-2 overflow-hidden">
            {frames.map((f, idx) => (
              <div
                key={f.id}
                className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all ${
                  idx === frames.length - 1
                    ? 'border-[#DE5C34] bg-[#DE5C34]/20 shadow-[0_0_12px_rgba(222,92,52,0.3)]'
                    : 'border-[#262C36] bg-[#15181E]'
                }`}
              >
                <div>
                  <span className="text-[#DE5C34] font-bold">#{idx + 1} </span>
                  <span>{f.fnName}({f.arg})</span>
                </div>
                {f.isBaseCase ? (
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/40">
                    RETURN READY
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">ACTIVE EXECUTION</span>
                )}
              </div>
            ))}
          </div>

          {/* Tactical Controls */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#262C36]">
            <button
              onClick={handleForceBaseCase}
              className="bg-[#15181E] border border-amber-500/50 hover:bg-amber-500/10 text-amber-300 py-3 rounded-lg text-xs font-bold transition-all"
            >
              [F] Force Base Case
            </button>
            <button
              onClick={handlePop}
              className="bg-[#DE5C34] hover:bg-[#DE5C34]/80 text-white py-3 rounded-lg text-xs font-bold transition-all shadow"
            >
              [POP] Unwind Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};