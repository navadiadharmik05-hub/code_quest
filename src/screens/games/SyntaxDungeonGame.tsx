import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SyntaxDungeonProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

interface StreamToken {
  id: number;
  text: string;
  type: 'CORRECT' | 'MISMATCH_BRACKET' | 'TYPO_KW' | 'GARBAGE';
  targetFix: number; // 0: none, 1: Bracket, 2: Keyword, 3: Purge
  pos: number; // 0 to 100%
}

export const SyntaxDungeon: React.FC<SyntaxDungeonProps> = ({ onComplete, onDamage }) => {
  const [tokens, setTokens] = useState<StreamToken[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [feedback, setFeedback] = useState<string | null>(null);
  const nextId = useRef(1);

  // Spawn tokens periodically
  useEffect(() => {
    const tokenPresets = [
      { text: 'const', type: 'CORRECT', targetFix: 0 },
      { text: '(', type: 'MISMATCH_BRACKET', targetFix: 1 },
      { text: 'funtion', type: 'TYPO_KW', targetFix: 2 },
      { text: '###CORRUPT###', type: 'GARBAGE', targetFix: 3 },
      { text: 'return', type: 'CORRECT', targetFix: 0 },
      { text: '[}', type: 'MISMATCH_BRACKET', targetFix: 1 },
      { text: 'whille', type: 'TYPO_KW', targetFix: 2 },
      { text: '0xBADF00D', type: 'GARBAGE', targetFix: 3 },
      { text: '=>', type: 'CORRECT', targetFix: 0 },
    ];

    const spawnInterval = setInterval(() => {
      setTokens((prev) => {
        if (prev.length >= 6) return prev;
        const preset = tokenPresets[Math.floor(Math.random() * tokenPresets.length)];
        return [
          ...prev,
          {
            id: nextId.current++,
            text: preset.text,
            type: preset.type as any,
            targetFix: preset.targetFix,
            pos: 0,
          },
        ];
      });
    }, 1800);

    return () => clearInterval(spawnInterval);
  }, []);

  // Move tokens forward
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setTokens((prev) => {
        const next: StreamToken[] = [];
        for (const token of prev) {
          const newPos = token.pos + 3.5;
          if (newPos >= 85) {
            // Token breached parser boundary
            if (token.targetFix !== 0) {
              setHearts((h) => {
                const updated = Math.max(0, h - 1);
                if (onDamage) onDamage();
                return updated;
              });
              setCombo(0);
              setFeedback(`BREACH: Corrupted token "${token.text}" slipped through!`);
            } else {
              setScore((s) => s + 10);
            }
          } else {
            next.push({ ...token, pos: newPos });
          }
        }
        return next;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [onDamage]);

  // Handle action
  const handleAction = useCallback(
    (actionCode: number) => {
      setTokens((prev) => {
        // Find closest token to the target zone (pos > 40)
        const targetIndex = prev.findIndex((t) => t.pos >= 35 && t.pos <= 85);
        if (targetIndex === -1) {
          setFeedback('MISFIRE: No token in target reticle!');
          return prev;
        }

        const token = prev[targetIndex];
        if (token.targetFix === actionCode) {
          setScore((s) => s + 25 + combo * 5);
          setCombo((c) => c + 1);
          setFeedback(`CORRECTED: ${token.text}`);
          return prev.filter((_, idx) => idx !== targetIndex);
        } else {
          setHearts((h) => {
            const updated = Math.max(0, h - 1);
            if (onDamage) onDamage();
            return updated;
          });
          setCombo(0);
          setFeedback(`WRONG PATCH applied to "${token.text}"!`);
          return prev;
        }
      });
    },
    [combo, onDamage]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') handleAction(1);
      if (e.key === '2') handleAction(2);
      if (e.key === '3') handleAction(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction]);

  // Check win/loss
  useEffect(() => {
    if (score >= 200) {
      const stars = hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1;
      onComplete(stars, 150);
    }
  }, [score, hearts, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      {/* HUD Bar */}
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 01 // SYNTAX STREAM DEFUSER</span>
          <span className="text-xs text-[#8C94A4]">AST Ingestion Rate: 1.2 KB/s</span>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div>COMBO: <span className="text-[#E5A93C] font-bold">{combo}x</span></div>
          <div>CLEARED: <span className="text-[#3D8B66] font-bold">{score} / 200 XP</span></div>
          <div>INTEGRITY: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      {/* Stream Runway */}
      <div className="flex-1 bg-[#12151B] border border-[#262C36] rounded-xl relative overflow-hidden flex flex-col justify-center">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DE5C34_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Reticle / Capture Zone */}
        <div className="absolute left-[35%] right-[15%] top-0 bottom-0 bg-[#DE5C34]/10 border-x-2 border-dashed border-[#DE5C34]/50 pointer-events-none flex items-start justify-center pt-2">
          <span className="text-[10px] text-[#DE5C34] tracking-widest font-bold uppercase">INTERCEPTION GATE</span>
        </div>

        {/* Breach Line */}
        <div className="absolute right-[15%] top-0 bottom-0 w-[2px] bg-red-600 shadow-[0_0_10px_red]" />
        <div className="absolute right-[2%] top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold tracking-widest uppercase">
          CORE PARSER
        </div>

        {/* Moving Tokens */}
        <div className="relative w-full h-24">
          {tokens.map((token) => (
            <div
              key={token.id}
              style={{ left: `${token.pos}%` }}
              className={`absolute top-1/2 -translate-y-1/2 px-3 py-1.5 rounded border text-xs font-bold transition-transform ${
                token.type === 'CORRECT'
                  ? 'bg-[#1F242C] border-[#3D8B66] text-[#3D8B66]'
                  : token.type === 'MISMATCH_BRACKET'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : token.type === 'TYPO_KW'
                  ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                  : 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
              }`}
            >
              {token.text}
            </div>
          ))}
        </div>

        {/* Real-time event log */}
        <div className="absolute bottom-4 left-6 text-xs text-[#8C94A4]">
          SYSTEM LOG: <span className="text-[#F1F3F7]">{feedback || 'Monitoring stream for lexical corruption...'}</span>
        </div>
      </div>

      {/* Action Tray */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <button
          onClick={() => handleAction(1)}
          className="bg-[#15181E] border border-[#262C36] hover:border-amber-500 p-4 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"
        >
          <span className="text-xs bg-[#262C36] px-2 py-0.5 rounded text-amber-400 group-hover:bg-amber-500/20">KEY [1]</span>
          <span className="text-sm font-bold text-[#F1F3F7]">Solder Bracket</span>
          <span className="text-[10px] text-[#8C94A4]">Fixes mismatched (), [], {}</span>
        </button>

        <button
          onClick={() => handleAction(2)}
          className="bg-[#15181E] border border-[#262C36] hover:border-orange-500 p-4 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"
        >
          <span className="text-xs bg-[#262C36] px-2 py-0.5 rounded text-orange-400 group-hover:bg-orange-500/20">KEY [2]</span>
          <span className="text-sm font-bold text-[#F1F3F7]">Type Cast Keyword</span>
          <span className="text-[10px] text-[#8C94A4]">Rewrites typos (funtion $\rightarrow$ function)</span>
        </button>

        <button
          onClick={() => handleAction(3)}
          className="bg-[#15181E] border border-[#262C36] hover:border-red-500 p-4 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"
        >
          <span className="text-xs bg-[#262C36] px-2 py-0.5 rounded text-red-400 group-hover:bg-red-500/20">KEY [3]</span>
          <span className="text-sm font-bold text-[#F1F3F7]">Purge Garbage</span>
          <span className="text-[10px] text-[#8C94A4]">Discards corrupted memory bytes</span>
        </button>
      </div>
    </div>
  );
};