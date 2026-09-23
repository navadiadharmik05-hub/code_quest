import React, { useState } from 'react';
import { VIDEO_BRIEFINGS, VideoBriefing } from '../data/constants';
import { BriefingModal } from '../components/BriefingModal';
import { playTactileTick, playUnlockChime } from '../utils/audio';

interface DashboardScreenProps {
  clearedQuests: string[];
  xp: number;
  hearts: number;
  node01Unlocked: boolean;
  node02Unlocked: boolean;
  node03Unlocked: boolean;
  node04Unlocked: boolean;
  node05Unlocked: boolean;
  node06Unlocked: boolean;
  onLaunchQuest: (nodeKey: string) => void;
  onCompleteQuest: (questId: string, xpReward: number) => void;
}

export function DashboardScreen({
  clearedQuests,
  xp,
  hearts,
  node01Unlocked,
  node02Unlocked,
  node03Unlocked,
  node04Unlocked,
  node05Unlocked,
  node06Unlocked,
  onLaunchQuest,
  onCompleteQuest,
}: DashboardScreenProps) {
  const [activeBriefing, setActiveBriefing] = useState<VideoBriefing | null>(null);
  const [evalModalQuest, setEvalModalQuest] = useState<string | null>(null);

  const isG1 = clearedQuests.includes('syntax-dungeon');
  const isG2 = clearedQuests.includes('execution-arena');
  const isG3 = clearedQuests.includes('sort-arena');
  const isG4 = clearedQuests.includes('tower-of-hanoi');
  const isG5 = clearedQuests.includes('bst-quest');
  const isG6 = clearedQuests.includes('stack-queue-boss');

  const openBriefing = (nodeKey: string) => {
    playTactileTick();
    const b = VIDEO_BRIEFINGS.find(v => v.nodeKey === nodeKey);
    if (b) setActiveBriefing(b);
  };

  const handleLaunchQuest = (nodeKey: string) => {
    playTactileTick();
    setActiveBriefing(null);
    onLaunchQuest(nodeKey);
  };

  const handleSimulateEval = (nodeKey: string) => {
    playTactileTick();
    setEvalModalQuest(nodeKey);
  };

  const handleCommitEval = () => {
    if (!evalModalQuest) return;
    playUnlockChime();
    onCompleteQuest(evalModalQuest, 100);
    setEvalModalQuest(null);
  };

  return (
    <div className="relative w-full min-h-screen pb-16" style={{ background: '#07080A' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative pt-8 pb-4 text-center px-4 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest mb-3"
          style={{ background: 'rgba(222,92,52,0.1)', color: '#DE5C34', border: '1px solid rgba(222,92,52,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: '#DE5C34' }} />
          SYSTEM OPERATIONAL // FOUNDATION ARC
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight font-display"
          style={{ color: '#E2E2E6' }}
        >
          CURRICULUM DAG MAP
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-mono max-w-lg mx-auto" style={{ color: '#6E788A' }}>
          Select an unlocked node to launch the game arena or watch the video briefing.
        </p>
      </div>

      {/* DAG Skill Tree Canvas Container */}
      <div className="relative max-w-[900px] mx-auto px-4 overflow-x-auto py-4">
        <div className="relative w-[840px] min-w-[840px] h-[870px] mx-auto">

          {/* SVG Connection Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="activeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DE5C34" />
                <stop offset="100%" stopColor="#DE5C34" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Node01 -> Fork Hub */}
            <path d="M 420 180 L 420 244" stroke={isG1 ? '#DE5C34' : '#1E2633'} strokeWidth="2" fill="none" />
            {isG1 && (
              <path d="M 420 180 L 420 244" stroke="#e76c46" strokeWidth="2" fill="none" className="active-circuit-pulse" />
            )}

            {/* Fork Hub Circle */}
            <circle cx="420" cy="244" r="4" fill={isG1 ? '#DE5C34' : '#1E2633'} />

            {/* Fork Hub -> Node 02 */}
            <path
              d="M 420 244 C 420 268, 220 268, 220 290"
              stroke={isG1 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG1 ? undefined : '4 4'}
            />

            {/* Fork Hub -> Node 03 */}
            <path
              d="M 420 244 C 420 268, 620 268, 620 290"
              stroke={isG1 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG1 ? undefined : '4 4'}
            />

            {/* Node 02 -> Node 04 */}
            <path
              d="M 220 470 L 220 535"
              stroke={isG2 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG2 ? undefined : '4 4'}
            />
            {isG2 && (
              <path d="M 220 470 L 220 535" stroke="#e76c46" strokeWidth="2" fill="none" className="active-circuit-pulse" />
            )}

            {/* Node 03 -> Node 05 */}
            <path
              d="M 620 470 L 620 535"
              stroke={isG3 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG3 ? undefined : '4 4'}
            />
            {isG3 && (
              <path d="M 620 470 L 620 535" stroke="#e76c46" strokeWidth="2" fill="none" className="active-circuit-pulse" />
            )}

            {/* Node 04 -> Boss Node 06 */}
            <path
              d="M 220 715 C 220 752, 420 752, 420 762"
              stroke={isG4 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG4 ? undefined : '4 4'}
            />

            {/* Node 05 -> Boss Node 06 */}
            <path
              d="M 620 715 C 620 752, 420 752, 420 762"
              stroke={isG5 ? '#DE5C34' : '#1E2633'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isG5 ? undefined : '4 4'}
            />

            {/* Boss Merge Pip */}
            <circle cx="420" cy="762" r="5" fill={node06Unlocked ? '#DE5C34' : '#1E2633'} />
          </svg>

          {/* NODE 01: Syntax Dungeon */}
          <div className="absolute left-[290px] top-0 w-[260px] z-10">
            <NodeCard
              gameId="01"
              title="Syntax Dungeon"
              topic="Lexical Parsing & AST Tokens"
              nodeKey="syntax-dungeon"
              isUnlocked={node01Unlocked}
              isCleared={isG1}
              xpReward={150}
              onLaunch={() => handleLaunchQuest('syntax-dungeon')}
              onBriefing={() => openBriefing('syntax-dungeon')}
              onEval={() => handleSimulateEval('syntax-dungeon')}
            />
          </div>

          {/* NODE 02: Execution Arena */}
          <div className="absolute left-[90px] top-[290px] w-[260px] z-10">
            <NodeCard
              gameId="02"
              title="Execution Arena"
              topic="Call Stack & Variable Invariants"
              nodeKey="execution-arena"
              isUnlocked={node02Unlocked}
              isCleared={isG2}
              xpReward={280}
              onLaunch={() => handleLaunchQuest('execution-arena')}
              onBriefing={() => openBriefing('execution-arena')}
              onEval={() => handleSimulateEval('execution-arena')}
            />
          </div>

          {/* NODE 03: Sort Arena */}
          <div className="absolute left-[490px] top-[290px] w-[260px] z-10">
            <NodeCard
              gameId="03"
              title="Sort Arena"
              topic="Bubble Sort & Pairwise Inversions"
              nodeKey="sort-arena"
              isUnlocked={node03Unlocked}
              isCleared={isG3}
              xpReward={320}
              onLaunch={() => handleLaunchQuest('sort-arena')}
              onBriefing={() => openBriefing('sort-arena')}
              onEval={() => handleSimulateEval('sort-arena')}
            />
          </div>

          {/* NODE 04: Tower of Hanoi */}
          <div className="absolute left-[90px] top-[535px] w-[260px] z-10">
            <NodeCard
              gameId="04"
              title="Tower of Hanoi"
              topic="Recursion & Proof Induction"
              nodeKey="tower-of-hanoi"
              isUnlocked={node04Unlocked}
              isCleared={isG4}
              xpReward={450}
              onLaunch={() => handleLaunchQuest('tower-of-hanoi')}
              onBriefing={() => openBriefing('tower-of-hanoi')}
              onEval={() => handleSimulateEval('tower-of-hanoi')}
            />
          </div>

          {/* NODE 05: BST Quest */}
          <div className="absolute left-[490px] top-[535px] w-[260px] z-10">
            <NodeCard
              gameId="05"
              title="BST Quest"
              topic="Binary Search Trees & Search Passes"
              nodeKey="bst-quest"
              isUnlocked={node05Unlocked}
              isCleared={isG5}
              xpReward={500}
              onLaunch={() => handleLaunchQuest('bst-quest')}
              onBriefing={() => openBriefing('bst-quest')}
              onEval={() => handleSimulateEval('bst-quest')}
            />
          </div>

          {/* NODE 06: Stack & Queue Boss */}
          <div className="absolute left-[290px] top-[765px] w-[260px] z-10">
            <NodeCard
              gameId="06"
              title="Stack & Queue Boss"
              topic="Buffer Mechanics & FIFO/LIFO"
              nodeKey="stack-queue-boss"
              isUnlocked={node06Unlocked}
              isCleared={isG6}
              xpReward={750}
              isBoss
              onLaunch={() => handleLaunchQuest('stack-queue-boss')}
              onBriefing={() => openBriefing('stack-queue-boss')}
              onEval={() => handleSimulateEval('stack-queue-boss')}
            />
          </div>
        </div>
      </div>

      {/* Briefing Modal */}
      <BriefingModal
        briefing={activeBriefing}
        onClose={() => setActiveBriefing(null)}
        onLaunchQuest={handleLaunchQuest}
      />

      {/* Sim Eval Harness Modal */}
      {evalModalQuest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
        >
          <div
            className="w-full max-w-md rounded-xl border p-5 space-y-4"
            style={{ background: '#11141A', borderColor: '#1A202A' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#1A202A' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: '#3D8B66' }}>
                  terminal
                </span>
                <span className="font-mono text-xs font-semibold" style={{ color: '#E2E2E6' }}>
                  SIMULATED EVALUATION HARNESS
                </span>
              </div>
              <button onClick={() => setEvalModalQuest(null)} className="text-gray-500 hover:text-white text-xs">
                ✕
              </button>
            </div>
            <div
              className="font-mono text-xs p-3 rounded space-y-1"
              style={{ background: '#07080A', border: '1px solid #1A202A', color: '#3D8B66' }}
            >
              <div>{`> RUNNING_SUITE(node: "${evalModalQuest}")`}</div>
              <div>{`> VERIFYING_INVARIANTS: PASS [100%]`}</div>
              <div>{`> TEST_CASES: 12/12 PASSED`}</div>
              <div style={{ color: '#DE5C34' }}>{`> REWARD: +100 XP APPROVED`}</div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setEvalModalQuest(null)}
                className="px-3 py-1.5 rounded text-xs font-mono"
                style={{ color: '#6E788A', border: '1px solid #1F242C' }}
              >
                CANCEL
              </button>
              <button
                onClick={handleCommitEval}
                className="px-4 py-1.5 rounded text-xs font-mono font-semibold"
                style={{ background: '#3D8B66', color: '#fff' }}
              >
                COMMIT & UNLOCK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Individual Node Card
interface NodeCardProps {
  gameId: string;
  title: string;
  topic: string;
  nodeKey: string;
  isUnlocked: boolean;
  isCleared: boolean;
  xpReward: number;
  isBoss?: boolean;
  onLaunch: () => void;
  onBriefing: () => void;
  onEval: () => void;
}

function NodeCard({
  gameId,
  title,
  topic,
  isUnlocked,
  isCleared,
  xpReward,
  isBoss,
  onLaunch,
  onBriefing,
  onEval,
}: NodeCardProps) {
  return (
    <div
      className="rounded-xl border transition-all duration-300 relative overflow-hidden group"
      style={{
        background: isCleared
          ? '#131922'
          : isUnlocked
          ? '#11141A'
          : '#0A0C0F',
        borderColor: isCleared
          ? '#3D8B66'
          : isBoss
          ? isUnlocked ? '#DE5C34' : '#1A202A'
          : isUnlocked
          ? '#262C36'
          : '#12161F',
        boxShadow: isCleared
          ? '0 0 16px rgba(61,139,102,0.15)'
          : isUnlocked
          ? '0 4px 12px rgba(0,0,0,0.4)'
          : 'none',
        opacity: isUnlocked ? 1 : 0.65,
      }}
    >
      {/* Top Status Strip */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b text-[10px] font-mono tracking-widest"
        style={{
          background: isCleared
            ? 'rgba(61,139,102,0.12)'
            : isUnlocked
            ? '#0E1013'
            : '#07080A',
          borderColor: isCleared ? 'rgba(61,139,102,0.3)' : '#1F242C',
        }}
      >
        <span style={{ color: isCleared ? '#3D8B66' : isUnlocked ? '#DE5C34' : '#4A5260' }}>
          G{gameId} {isBoss ? '· APEX BOSS' : ''}
        </span>
        <div className="flex items-center gap-1">
          {isCleared ? (
            <span className="flex items-center gap-0.5" style={{ color: '#3D8B66' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
              CLEARED
            </span>
          ) : isUnlocked ? (
            <span className="flex items-center gap-0.5" style={{ color: '#DE5C34' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock_open</span>
              UNLOCKED
            </span>
          ) : (
            <span className="flex items-center gap-0.5" style={{ color: '#4A5260' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
              LOCKED
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 space-y-2">
        <div>
          <h3
            className="text-xs font-bold tracking-tight font-display"
            style={{ color: isUnlocked ? '#E2E2E6' : '#6E788A' }}
          >
            {title}
          </h3>
          <p className="text-[11px] font-mono mt-0.5 leading-snug line-clamp-2" style={{ color: '#6E788A' }}>
            {topic}
          </p>
        </div>

        {/* XP Reward Badge */}
        <div className="flex items-center justify-between pt-1">
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(222,92,52,0.1)',
              color: '#DE5C34',
              border: '1px solid rgba(222,92,52,0.2)',
            }}
          >
            +{xpReward} XP
          </span>

          {/* Intel Video Briefing Button */}
          {isUnlocked && (
            <button
              onClick={onBriefing}
              className="flex items-center gap-1 text-[10px] font-mono hover:underline"
              style={{ color: '#3D8B66' }}
              title="Watch video briefing"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>play_circle</span>
              BRIEFING
            </button>
          )}
        </div>

        {/* Action Buttons */}
        {isUnlocked ? (
          <div className="pt-1.5 flex gap-1.5">
            <button
              onClick={onLaunch}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[11px] font-mono font-semibold transition-all"
              style={{
                background: isBoss ? '#DE5C34' : 'rgba(222,92,52,0.15)',
                color: isBoss ? '#fff' : '#DE5C34',
                border: isBoss ? '1px solid #DE5C34' : '1px solid rgba(222,92,52,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#DE5C34';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isBoss ? '#DE5C34' : 'rgba(222,92,52,0.15)';
                e.currentTarget.style.color = isBoss ? '#fff' : '#DE5C34';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>rocket_launch</span>
              LAUNCH
            </button>
            <button
              onClick={onEval}
              className="px-2 py-1.5 rounded text-[10px] font-mono transition-colors"
              style={{ background: '#0E1013', color: '#6E788A', border: '1px solid #1F242C' }}
              title="Simulate harness completion"
              onMouseEnter={e => (e.currentTarget.style.color = '#E2E2E6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6E788A')}
            >
              EVAL
            </button>
          </div>
        ) : (
          <div
            className="pt-1.5 text-center text-[10px] font-mono py-1 rounded"
            style={{ background: '#07080A', color: '#4A5260', border: '1px solid #12161F' }}
          >
            PREREQUISITE LOCKED
          </div>
        )}
      </div>
    </div>
  );
}
