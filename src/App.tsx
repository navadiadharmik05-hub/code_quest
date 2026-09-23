import React, { useState } from 'react';
import { useProgression } from './hooks/useProgression';
import { TopNavbar } from './components/TopNavbar';
import { DashboardScreen } from './screens/DashboardScreen';
import { AccoladesScreen } from './screens/AccoladesScreen';
import { IntelCodexScreen } from './screens/IntelCodexScreen';
import { SyntaxDungeon } from './screens/games/SyntaxDungeonGame';
import { ExecutionArena } from './screens/games/ExecutionArenaGame';
import { SortArena } from './screens/games/SortArenaGame';
import { TowerOfHanoi } from './screens/games/HanoiGame';
import { BstQuest } from './screens/games/BstQuestGame';
import { StackQueueBoss } from './screens/games/StackQueueGame';

type ScreenId = 'dashboard' | 'accolades' | 'codex' | 'arena';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [activeGameKey, setActiveGameKey] = useState<string | null>(null);

  const {
    clearedQuests,
    xp,
    hearts,
    sfxEnabled,
    node01Unlocked,
    node02Unlocked,
    node03Unlocked,
    node04Unlocked,
    node05Unlocked,
    node06Unlocked,
    completeQuest,
    updateHearts,
    toggleSfx,
  } = useProgression();

  const handleLaunchQuest = (nodeKey: string) => {
    setActiveGameKey(nodeKey);
    setCurrentScreen('arena');
  };

  const handleReturnToDashboard = () => {
    setActiveGameKey(null);
    setCurrentScreen('dashboard');
  };

  const renderActiveGame = () => {
    const handleDamage = () => {
      updateHearts((prev) => Math.max(0, prev - 1));
    };

    switch (activeGameKey) {
      case 'syntax-dungeon':
        return (
          <SyntaxDungeon
            onComplete={(_stars: number, xpReward = 150) => {
              completeQuest('syntax-dungeon', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 150);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      case 'execution-arena':
        return (
          <ExecutionArena
            onComplete={(_stars: number, xpReward = 280) => {
              completeQuest('execution-arena', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 280);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      case 'sort-arena':
        return (
          <SortArena
            onComplete={(_stars: number, xpReward = 320) => {
              completeQuest('sort-arena', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 320);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      case 'tower-of-hanoi':
        return (
          <TowerOfHanoi
            onComplete={(_stars: number, xpReward = 450) => {
              completeQuest('tower-of-hanoi', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 450);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      case 'bst-quest':
        return (
          <BstQuest
            onComplete={(_stars: number, xpReward = 500) => {
              completeQuest('bst-quest', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 500);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      case 'stack-queue-boss':
        return (
          <StackQueueBoss
            onComplete={(_stars: number, xpReward = 750) => {
              completeQuest('stack-queue-boss', typeof xpReward === 'number' && xpReward > 10 ? xpReward : 750);
              handleReturnToDashboard();
            }}
            onDamage={handleDamage}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-mono text-center">
            <div className="text-xl text-[#DE5C34]">NO ARENA SPECIFIED FOR "{activeGameKey}"</div>
            <button
              onClick={handleReturnToDashboard}
              className="px-4 py-2 rounded bg-[#11141A] border border-[#1A202A] text-xs text-[#E2E2E6]"
            >
              RETURN TO ROADMAP
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#E2E2E6] font-sans antialiased selection:bg-[#DE5C34] selection:text-white">
      {/* Top Navigation Bar */}
      <TopNavbar
        currentScreen={currentScreen}
        xp={xp}
        hearts={hearts}
        sfxEnabled={sfxEnabled}
        onNavigate={setCurrentScreen}
        onToggleSfx={toggleSfx}
      />

      {/* Screen Views */}
      <main>
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            clearedQuests={clearedQuests}
            xp={xp}
            hearts={hearts}
            node01Unlocked={node01Unlocked}
            node02Unlocked={node02Unlocked}
            node03Unlocked={node03Unlocked}
            node04Unlocked={node04Unlocked}
            node05Unlocked={node05Unlocked}
            node06Unlocked={node06Unlocked}
            onLaunchQuest={handleLaunchQuest}
            onCompleteQuest={completeQuest}
          />
        )}

        {currentScreen === 'accolades' && (
          <AccoladesScreen clearedQuests={clearedQuests} xp={xp} />
        )}

        {currentScreen === 'codex' && (
          <IntelCodexScreen onLaunchQuest={handleLaunchQuest} />
        )}

        {currentScreen === 'arena' && renderActiveGame()}
      </main>
    </div>
  );
}
