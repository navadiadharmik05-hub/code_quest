import React, { useState } from 'react';
import { GameProps } from './GameTypes';

interface BlankDef {
  a: string;
  opts: string[];
}

interface Puzzle {
  title: string;
  desc: string;
  lang: string;
  code: string[];
  blanks: Record<string, BlankDef>;
}

const PUZZLES: Record<'js' | 'py', Puzzle[]> = {
  js: [
    {
      title: 'Reverse a String',
      desc: 'Drop the correct array method into the blank.',
      lang: 'JavaScript',
      code: ['function reverseStr(str) {', "  return str.split('')", '    .__B1__()', "    .join('');", '}'],
      blanks: { B1: { a: 'reverse', opts: ['reverse', 'sort', 'slice', 'concat'] } },
    },
    {
      title: 'Loop to Sum',
      desc: 'Complete the for-loop header.',
      lang: 'JavaScript',
      code: ['function sum(arr) {', '  let total = 0;', '  for (let i=__B1__; i __B2__ arr.length; i++) {', '    total += arr[i];', '  }', '  return total;', '}'],
      blanks: {
        B1: { a: '0', opts: ['0', '1', '-1', 'arr.length'] },
        B2: { a: '<', opts: ['<', '<=', '>', '=='] },
      },
    },
    {
      title: 'Arrow Function',
      desc: 'Fill in the keyword and arrow symbol.',
      lang: 'JavaScript',
      code: ['__B1__ square = (n) __B2__ n * n;', 'square(9); // 81'],
      blanks: {
        B1: { a: 'const', opts: ['const', 'let', 'print', 'func'] },
        B2: { a: '=>', opts: ['=>', '->', ':=', '='] },
      },
    },
  ],
  py: [
    {
      title: 'Define a Function',
      desc: 'Python uses a special keyword — find it.',
      lang: 'Python',
      code: ['__B1__ greet(name):', '    __B2__(f"Hello, {name}!")', '', 'greet("Ada")'],
      blanks: {
        B1: { a: 'def', opts: ['def', 'function', 'void', 'fn'] },
        B2: { a: 'print', opts: ['print', 'echo', 'log', 'return'] },
      },
    },
    {
      title: 'List Comprehension',
      desc: 'Python power move — fill in the operator.',
      lang: 'Python',
      code: ['squares = [n __B1__ n for n in range(5)]', '__B2__(squares)'],
      blanks: {
        B1: { a: '*', opts: ['*', '**', '^', '//'] },
        B2: { a: 'print', opts: ['print', 'echo', 'show', 'return'] },
      },
    },
    {
      title: 'While Loop',
      desc: 'Countdown from 5 — pick the right condition.',
      lang: 'Python',
      code: ['n = 5', '__B1__ n __B2__ 0:', '    print(n)', '    n -= 1'],
      blanks: {
        B1: { a: 'while', opts: ['while', 'for', 'loop', 'if'] },
        B2: { a: '>', opts: ['>', '<', '==', '>='] },
      },
    },
  ],
};

export const SyntaxDungeonGame: React.FC<GameProps> = ({ onNavigate, playerState, onLoseHeart, onWin }) => {
  const [lang, setLang] = useState<'js' | 'py'>('js');
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({});
  const [clearedPuzzles, setClearedPuzzles] = useState<Record<string, boolean>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [won, setWon] = useState<boolean>(false);

  const currentPuzzle = PUZZLES[lang][puzzleIdx];
  const allWords = Array.from(new Set(Object.values(currentPuzzle.blanks).flatMap((b) => b.opts)));

  const handleSelectBlank = (blankId: string, requiredAns: string) => {
    if (filledBlanks[blankId] || !selectedToken) return;

    if (selectedToken === requiredAns) {
      const updated = { ...filledBlanks, [blankId]: selectedToken };
      setFilledBlanks(updated);
      setSelectedToken(null);

      const allFilled = Object.keys(currentPuzzle.blanks).every((k) => updated[k] === currentPuzzle.blanks[k].a);
      if (allFilled) {
        setClearedPuzzles((prev) => ({ ...prev, [`${lang}-${puzzleIdx}`]: true }));
        setWon(true);
        if (onWin) onWin('syntax-dungeon');
      }
    } else {
      if (onLoseHeart) onLoseHeart();
      setWrongKey(blankId);
      setTimeout(() => setWrongKey(null), 500);
    }
  };

  const resetCurrentPuzzle = () => {
    setFilledBlanks({});
    setSelectedToken(null);
    setWon(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-sm">
        <div>
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Game 01</span>
          <h1 className="text-headline-lg font-bold text-on-surface">Syntax Dungeon</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-error">
            {Array.from({ length: playerState?.maxLives ?? 5 }).map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[18px]">
                {i < (playerState?.lives ?? 0) ? 'favorite' : 'heart_broken'}
              </span>
            ))}
          </div>
          <button
            className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md cursor-pointer"
            onClick={() => onNavigate('dashboard-quests', 'push_back')}
          >
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex gap-2">
              <button
                className={`px-4 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer ${
                  lang === 'js' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}
                onClick={() => {
                  setLang('js');
                  setPuzzleIdx(0);
                  resetCurrentPuzzle();
                }}
              >
                JavaScript
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer ${
                  lang === 'py' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}
                onClick={() => {
                  setLang('py');
                  setPuzzleIdx(0);
                  resetCurrentPuzzle();
                }}
              >
                Python
              </button>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    clearedPuzzles[`${lang}-${idx}`]
                      ? 'bg-secondary'
                      : idx === puzzleIdx
                      ? 'bg-tertiary'
                      : 'bg-surface-container-highest'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-xl shadow-md">
            <h2 className="text-headline-sm font-semibold text-tertiary">{currentPuzzle.title}</h2>
            <p className="text-body-sm text-on-surface-variant mt-1 mb-4">{currentPuzzle.desc}</p>

            <div className="bg-surface-container-lowest p-4 rounded-xl font-code-block text-code-block text-on-surface overflow-x-auto space-y-2">
              {currentPuzzle.code.map((line, lineIdx) => {
                const parts = line.split(/(__B\d+__)/g);
                return (
                  <div key={lineIdx} className="flex gap-4">
                    <span className="text-outline w-6 text-right select-none">{lineIdx + 1}</span>
                    <div className="flex-1 whitespace-pre-wrap">
                      {parts.map((part, pIdx) => {
                        const match = part.match(/__B(\d+)__/);
                        if (match) {
                          const blankId = `B${match[1]}`;
                          const blankDef = currentPuzzle.blanks[blankId];
                          const filled = filledBlanks[blankId];
                          const isWrong = wrongKey === blankId;

                          return (
                            <button
                              key={pIdx}
                              onClick={() => handleSelectBlank(blankId, blankDef.a)}
                              className={`mx-1 px-3 py-0.5 rounded border font-bold transition-all ${
                                filled
                                  ? 'bg-secondary/20 border-secondary text-secondary cursor-default'
                                  : isWrong
                                  ? 'bg-error/20 border-error text-error animate-pulse'
                                  : 'border-dashed border-primary text-primary hover:bg-primary/10 cursor-pointer'
                              }`}
                            >
                              {filled || '___'}
                            </button>
                          );
                        }
                        return <span key={pIdx}>{part}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {allWords.map((word) => {
                const isUsed = Object.values(filledBlanks).includes(word);
                const isSelected = selectedToken === word;
                return (
                  <button
                    key={word}
                    disabled={isUsed}
                    onClick={() => setSelectedToken(word)}
                    className={`px-4 py-2 rounded-lg font-code-inline text-code-inline transition-all cursor-pointer ${
                      isUsed
                        ? 'opacity-20 line-through cursor-not-allowed bg-surface-container-lowest'
                        : isSelected
                        ? 'bg-tertiary text-on-tertiary shadow-md scale-105'
                        : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {won && (
              <div className="mt-6 p-4 rounded-xl bg-surface-container-low border border-secondary text-center space-y-3">
                <span className="material-symbols-outlined text-[32px] text-secondary">verified</span>
                <h3 className="text-headline-md font-bold text-on-surface">Puzzle Cleared!</h3>
                <p className="text-body-sm text-tertiary font-code-inline">+30 XP Awarded</p>
                {puzzleIdx < 2 && (
                  <button
                    className="px-6 py-2 rounded-lg bg-primary text-on-primary font-headline-sm cursor-pointer"
                    onClick={() => {
                      setPuzzleIdx((prev) => prev + 1);
                      resetCurrentPuzzle();
                    }}
                  >
                    Next Puzzle →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm space-y-2">
            <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Instructions</span>
            <p className="text-body-sm text-on-surface-variant">
              1. Tap a token from the word bank.<br />
              2. Tap the dashed blank to insert it.<br />
              3. Mismatched tokens cost 1 life.
            </p>
          </div>
          <button
            onClick={resetCurrentPuzzle}
            className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Reset Current Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};