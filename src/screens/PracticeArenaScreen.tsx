import React, { useState, useEffect } from 'react';
import { ScreenType, TransitionType } from '../types';

interface PracticeArenaScreenProps {
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
}

export const PracticeArenaScreen: React.FC<PracticeArenaScreenProps> = ({ onNavigate }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(164); // 02:44
  const [selectedPrediction, setSelectedPrediction] = useState<string>('B');
  const [hintActive, setHintActive] = useState<boolean>(false);
  const [test3State, setTest3State] = useState<'pending' | 'running' | 'passed'>('pending');
  const [score, setScore] = useState<number>(1840);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const remainingSecs = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${remainingSecs}`;
  };

  const handleHint = () => {
    if (hintActive) return;
    setHintActive(true);
    setScore((prev) => Math.max(prev - 50, 0));
    setTimeout(() => {
      setHintActive(false);
    }, 4000);
  };

  const handleRunTests = () => {
    if (test3State === 'passed') return;
    setTest3State('running');
    setTimeout(() => {
      setTest3State('passed');
    }, 600);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onNavigate('trophy-hall', 'push');
      } else if (e.key === '1') {
        setSelectedPrediction('A');
      } else if (e.key === '2') {
        setSelectedPrediction('B');
      } else if (e.key === '3') {
        setSelectedPrediction('C');
      } else if (e.key === '4') {
        setSelectedPrediction('D');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden px-margin-mobile md:px-margin py-space-md flex flex-col gap-space-md">
        {/* Ambient Glow Blobs restricted to canvas */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 1. Top Gameplay HUD Bar */}
        <section className="relative z-10 w-full bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            {/* Mission Metadata & Stage Info */}
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">terminal</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                    Phase IV • Recursion
                  </span>
                  <span className="text-outline text-label-sm font-label-sm">•</span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">memory</span>
                    SysStack Labyrinth
                  </span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Execution Arena: Subroutine Labyrinth • Level 4 of 8
                </h1>
              </div>
            </div>

            {/* Gameplay Vital Telemetry */}
            <div className="flex items-center gap-space-md flex-wrap shrink-0">
              {/* Timer Countdown */}
              <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm">
                <span className={`material-symbols-outlined text-[18px] ${secondsRemaining < 60 ? 'text-error animate-ping' : 'text-secondary animate-pulse'}`}>
                  timer
                </span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Clock</span>
                  <span
                    className={`font-code-inline text-code-inline tracking-wider font-semibold ${
                      secondsRemaining < 60 ? 'text-error' : 'text-on-surface'
                    }`}
                    id="speedrun-timer"
                  >
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
              </div>

              {/* Lives Metric */}
              <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm">
                <div className="flex items-center gap-1 text-error" title="4 out of 5 Lives Remaining">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-outline-variant">favorite</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant ml-1 font-code-inline">4/5</span>
              </div>

              {/* Live Score & Multiplier */}
              <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="font-code-inline text-code-inline font-bold text-tertiary">
                      {score.toLocaleString()}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">PTS</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary tracking-tight font-semibold">x2.5 Multiplier!</span>
                </div>
              </div>

              {/* Action Buttons (Hint & Pause) */}
              <div className="flex items-center gap-space-xs">
                <button
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-tertiary transition-colors shadow-sm cursor-pointer"
                  id="hint-trigger"
                  title="Reveal execution trace hint"
                  type="button"
                  onClick={handleHint}
                >
                  {hintActive ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] text-tertiary">check</span>
                      <span className="font-label-md text-label-md">Path &gt; Right Subtree</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                      <span className="font-label-md text-label-md font-medium">Hint</span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-container/30 text-on-tertiary-fixed font-code-inline text-label-sm">
                        -50 XP
                      </span>
                    </>
                  )}
                </button>
                <button
                  className="p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors shadow-sm cursor-pointer"
                  title="Pause simulation"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">pause</span>
                </button>
              </div>
            </div>
          </div>

          {/* Segmented Level Progress Bar */}
          <div className="w-full flex items-center gap-1.5 pt-space-xs">
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-secondary"></div>
              <span className="font-label-sm text-[9px] text-secondary font-code-inline uppercase tracking-widest hidden sm:inline">01 • Node</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-secondary"></div>
              <span className="font-label-sm text-[9px] text-secondary font-code-inline uppercase tracking-widest hidden sm:inline">02 • Edge</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-secondary"></div>
              <span className="font-label-sm text-[9px] text-secondary font-code-inline uppercase tracking-widest hidden sm:inline">03 • Frame</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-primary relative overflow-hidden shadow-[0_0_8px_rgba(208,188,255,0.7)] animate-pulse"></div>
              <span className="font-label-sm text-[9px] text-primary font-code-inline uppercase tracking-widest font-bold hidden sm:inline">04 • Active</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 opacity-40">
              <div className="h-1.5 w-full rounded-full bg-surface-container-highest"></div>
              <span className="font-label-sm text-[9px] text-outline font-code-inline uppercase tracking-widest hidden sm:inline">05 • Leaf</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 opacity-40">
              <div className="h-1.5 w-full rounded-full bg-surface-container-highest"></div>
              <span className="font-label-sm text-[9px] text-outline font-code-inline uppercase tracking-widest hidden sm:inline">06 • Invert</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 opacity-40">
              <div className="h-1.5 w-full rounded-full bg-surface-container-highest"></div>
              <span className="font-label-sm text-[9px] text-outline font-code-inline uppercase tracking-widest hidden sm:inline">07 • Prune</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 opacity-40">
              <div className="h-1.5 w-full rounded-full bg-surface-container-highest"></div>
              <span className="font-label-sm text-[9px] text-outline font-code-inline uppercase tracking-widest hidden sm:inline">08 • Final</span>
            </div>
          </div>
        </section>

        {/* 2. Main Puzzle Workspace */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* LEFT COLUMN: Interactive Code & State Inspector */}
          <div className="lg:col-span-7 flex flex-col gap-space-md min-w-0">
            {/* Objective Card */}
            <div className="w-full bg-surface-container rounded-xl p-space-md shadow-md flex items-start gap-space-md">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">
                    Mission Objective
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-code-inline text-label-sm">
                    Memory Limit: 4 Frames
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-snug">
                  Predict the return value of{' '}
                  <code className="font-code-inline text-code-inline px-1 py-0.5 rounded bg-surface-container-lowest text-secondary">
                    stack_walk(root)
                  </code>{' '}
                  given the binary memory structure and recursive bounds below.
                </p>
              </div>
            </div>

            {/* IDE / Code Snippet Panel */}
            <div className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="w-full bg-surface-container-low px-space-md py-space-xs flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-error/60"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary/60"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary/60"></span>
                  </div>
                  <span className="font-code-inline text-code-inline text-on-surface-variant text-label-sm ml-2">stack_eval.py</span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  <span className="font-label-sm text-label-sm">Python 3.12 (Isolated Sandbox)</span>
                </div>
              </div>

              {/* Code Body */}
              <div className="p-space-md font-code-block text-code-block text-on-surface overflow-x-auto select-text leading-relaxed">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">1</td>
                      <td className="whitespace-pre">
                        <span className="text-primary font-semibold">def</span> <span className="text-secondary font-medium">stack_walk</span>(node, depth=<span className="text-tertiary">0</span>):
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">2</td>
                      <td className="whitespace-pre">
                        {'    '}<span className="text-primary font-semibold">if</span> <span className="text-primary font-semibold">not</span> node <span className="text-primary font-semibold">or</span> depth &gt; <span className="text-tertiary">3</span>:
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40 bg-primary/5">
                      <td className="pr-space-md text-right text-primary select-none w-8 font-code-inline text-label-sm">3</td>
                      <td className="whitespace-pre">
                        {'        '}<span className="text-primary font-semibold">return</span> <span className="text-tertiary">0</span> <span className="text-outline-variant font-body-sm italic"># Base case pruning threshold</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">4</td>
                      <td className="whitespace-pre"> </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">5</td>
                      <td className="whitespace-pre">
                        {'    '}left_energy = <span className="text-secondary font-medium">stack_walk</span>(node.left, depth + <span className="text-tertiary">1</span>)
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">6</td>
                      <td className="whitespace-pre">
                        {'    '}right_energy = <span className="text-secondary font-medium">stack_walk</span>(node.right, depth + <span className="text-tertiary">1</span>)
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">7</td>
                      <td className="whitespace-pre"> </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/40">
                      <td className="pr-space-md text-right text-outline select-none w-8 font-code-inline text-label-sm">8</td>
                      <td className="whitespace-pre">
                        {'    '}<span className="text-primary font-semibold">return</span> node.val + <span className="text-secondary-fixed">max</span>(left_energy, right_energy)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Memory Stack Frames & Pointer Inspector */}
            <div className="w-full bg-surface-container rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary">layers</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Call Stack Telemetry</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-code-inline">Stack Depth: 3 / Max 4</span>
              </div>

              {/* Stack Frame Cascade */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-xs">
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-code-inline text-code-inline font-bold text-secondary text-label-sm">FRAME #0</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-code-inline">root</span>
                  </div>
                  <div className="font-code-inline text-label-sm text-on-surface-variant flex flex-col">
                    <span>node.val = <strong className="text-tertiary">10</strong></span>
                    <span>depth = <strong className="text-primary">0</strong></span>
                    <span className="text-secondary">state = WAITING_CHILD</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-code-inline text-code-inline font-bold text-secondary text-label-sm">FRAME #1</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-code-inline">node.right</span>
                  </div>
                  <div className="font-code-inline text-label-sm text-on-surface-variant flex flex-col">
                    <span>node.val = <strong className="text-tertiary">18</strong></span>
                    <span>depth = <strong className="text-primary">1</strong></span>
                    <span className="text-secondary">state = WAITING_CHILD</span>
                  </div>
                </div>

                <div className="bg-surface-container-high p-space-sm rounded-lg flex flex-col gap-1 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-bl"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-code-inline text-code-inline font-bold text-primary text-label-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      FRAME #2
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary text-label-sm font-code-inline">LEAF</span>
                  </div>
                  <div className="font-code-inline text-label-sm text-on-surface flex flex-col">
                    <span>node.val = <strong className="text-tertiary">14</strong></span>
                    <span>depth = <strong className="text-primary">2</strong></span>
                    <span className="text-primary font-semibold">state = RETURN_EVAL</span>
                  </div>
                </div>
              </div>

              {/* Tree Visual Sketch */}
              <div className="w-full mt-space-xs bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-center">
                <svg className="w-full max-w-sm h-16 text-outline" fill="none" stroke="currentColor" viewBox="0 0 360 80">
                  <circle className="fill-surface-container-high stroke-secondary" cx="180" cy="16" r="10" strokeWidth="2"></circle>
                  <text className="fill-on-surface text-[10px] font-mono" stroke="none" textAnchor="middle" x="180" y="20">10</text>
                  <line stroke="currentColor" strokeDasharray="2,2" x1="172" x2="128" y1="23" y2="52"></line>
                  <line className="stroke-primary" stroke="currentColor" strokeWidth="2" x1="188" x2="232" y1="23" y2="52"></line>
                  <circle className="fill-surface-container-high stroke-outline" cx="120" cy="60" r="10" strokeWidth="1.5"></circle>
                  <text className="fill-on-surface-variant text-[10px] font-mono" stroke="none" textAnchor="middle" x="120" y="64">8</text>
                  <circle className="fill-surface-container-high stroke-primary" cx="240" cy="60" r="10" strokeWidth="2"></circle>
                  <text className="fill-primary text-[10px] font-mono" stroke="none" textAnchor="middle" x="240" y="64">18</text>
                  <text className="fill-secondary text-[9px] font-mono" stroke="none" x="285" y="64">max path →</text>
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: User Input & Action Area */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Decision Selector Module */}
            <div className="w-full bg-surface-container rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">flaky</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Select Prediction</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-code-inline">+120 XP</span>
              </div>

              {/* Radio Options Group */}
              <fieldset className="flex flex-col gap-space-xs">
                <legend className="sr-only">Select your computed answer</legend>

                {/* Option A */}
                <label className="cursor-pointer group" onClick={() => setSelectedPrediction('A')}>
                  <input className="sr-only peer" name="prediction" type="radio" value="A" checked={selectedPrediction === 'A'} readOnly />
                  <div className={`w-full p-space-sm rounded-xl transition-all flex items-center justify-between group-hover:bg-surface-container-high ${
                    selectedPrediction === 'A'
                      ? 'bg-primary/10 shadow-[inset_0_0_0_1px_rgba(208,188,255,0.4)] text-primary'
                      : 'bg-surface-container-low'
                  }`}>
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-code-inline text-label-sm font-bold ${
                        selectedPrediction === 'A' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        A
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-code-inline text-code-inline font-semibold text-on-surface">Value: 42</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Max Depth: 3 (Balanced Traversal)</span>
                      </div>
                    </div>
                    {selectedPrediction === 'A' ? (
                      <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-outline opacity-0 group-hover:opacity-60">check_circle</span>
                    )}
                  </div>
                </label>

                {/* Option B */}
                <label className="cursor-pointer group" onClick={() => setSelectedPrediction('B')}>
                  <input className="sr-only peer" name="prediction" type="radio" value="B" checked={selectedPrediction === 'B'} readOnly />
                  <div className={`w-full p-space-sm rounded-xl transition-all flex items-center justify-between group-hover:bg-surface-container-high ${
                    selectedPrediction === 'B'
                      ? 'bg-primary/10 shadow-[inset_0_0_0_1px_rgba(208,188,255,0.4)] text-primary'
                      : 'bg-surface-container-low'
                  }`}>
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-code-inline text-label-sm font-bold ${
                        selectedPrediction === 'B' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        B
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-code-inline text-code-inline font-semibold text-primary">Value: 28</span>
                        <span className="font-label-sm text-label-sm text-secondary">Optimal Energy Subtree (Depth: 2)</span>
                      </div>
                    </div>
                    {selectedPrediction === 'B' ? (
                      <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-outline opacity-0 group-hover:opacity-60">check_circle</span>
                    )}
                  </div>
                </label>

                {/* Option C */}
                <label className="cursor-pointer group" onClick={() => setSelectedPrediction('C')}>
                  <input className="sr-only peer" name="prediction" type="radio" value="C" checked={selectedPrediction === 'C'} readOnly />
                  <div className={`w-full p-space-sm rounded-xl transition-all flex items-center justify-between group-hover:bg-surface-container-high ${
                    selectedPrediction === 'C'
                      ? 'bg-primary/10 shadow-[inset_0_0_0_1px_rgba(208,188,255,0.4)] text-primary'
                      : 'bg-surface-container-low'
                  }`}>
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-code-inline text-label-sm font-bold ${
                        selectedPrediction === 'C' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        C
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-code-inline text-code-inline font-semibold text-on-surface">RecursionError: Limit Exceeded</span>
                        <span className="font-label-sm text-label-sm text-error">Unbounded stack allocation detected</span>
                      </div>
                    </div>
                    {selectedPrediction === 'C' ? (
                      <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-outline opacity-0 group-hover:opacity-60">check_circle</span>
                    )}
                  </div>
                </label>

                {/* Option D */}
                <label className="cursor-pointer group" onClick={() => setSelectedPrediction('D')}>
                  <input className="sr-only peer" name="prediction" type="radio" value="D" checked={selectedPrediction === 'D'} readOnly />
                  <div className={`w-full p-space-sm rounded-xl transition-all flex items-center justify-between group-hover:bg-surface-container-high ${
                    selectedPrediction === 'D'
                      ? 'bg-primary/10 shadow-[inset_0_0_0_1px_rgba(208,188,255,0.4)] text-primary'
                      : 'bg-surface-container-low'
                  }`}>
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-code-inline text-label-sm font-bold ${
                        selectedPrediction === 'D' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        D
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-code-inline text-code-inline font-semibold text-on-surface">Value: 15</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Early Base Case Return (Depth &gt; 1)</span>
                      </div>
                    </div>
                    {selectedPrediction === 'D' ? (
                      <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-outline opacity-0 group-hover:opacity-60">check_circle</span>
                    )}
                  </div>
                </label>
              </fieldset>
            </div>

            {/* Test Suite / Console Harness */}
            <div className="w-full bg-surface-container rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary">fact_check</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Assertion Runner</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-code-inline">
                  {test3State === 'passed' ? '3 / 3 Verified' : '2 / 3 Verified'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pt-space-xs">
                <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span className="font-code-inline text-code-inline text-on-surface">Test #1: Null Tree Bounds</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-code-inline">4ms</span>
                </div>

                <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span className="font-code-inline text-code-inline text-on-surface">Test #2: Single Right Branch</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-code-inline">2ms</span>
                </div>

                <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-lg flex items-center justify-between">
                  {test3State === 'passed' ? (
                    <>
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                        <span className="font-code-inline text-code-inline text-on-surface">Test #3: Max Recursive Depth</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-code-inline">3ms</span>
                    </>
                  ) : test3State === 'running' ? (
                    <>
                      <div className="flex items-center gap-space-xs text-primary">
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                        <span className="font-code-inline text-code-inline text-primary">Test #3: Max Recursive Depth</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-code-inline">RUNNING...</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-space-xs text-outline">
                        <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
                        <span className="font-code-inline text-code-inline text-on-surface-variant">Test #3: Max Recursive Depth</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline font-code-inline">PENDING</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="w-full flex items-center gap-space-sm pt-space-xs">
              <button
                className="flex-1 py-space-sm px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                type="button"
                onClick={handleRunTests}
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Run Test</span>
              </button>
              <button
                className="flex-[1.8] py-space-sm px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs transition-all shadow-lg active:scale-[0.99] cursor-pointer"
                id="submit-action"
                type="button"
                onClick={() => onNavigate('trophy-hall', 'push')}
              >
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>Submit Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Bottom Feedback & Telemetry Status Drawer */}
        <section className="relative z-10 w-full bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Solving Velocity</span>
                <span className="font-code-inline text-code-inline text-on-surface font-semibold">
                  18.4 ops/min <span className="text-secondary">(Top 5%)</span>
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-surface-container-highest hidden sm:block"></div>

            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Streak Bonus</span>
                <span className="font-code-inline text-code-inline text-on-surface font-semibold">+45 XP Applied</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-code-inline">Ctrl</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-code-inline">Enter</kbd> to Run
            </span>
            <span className="text-outline">•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-code-inline">1-4</kbd> to Pick Option
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
