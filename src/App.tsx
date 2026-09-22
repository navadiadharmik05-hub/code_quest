import React, { useState, useEffect } from 'react';
import { ScreenType, TransitionType, PlayerState } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardScreen } from './screens/DashboardScreen';
import { SkillTreeScreen } from './screens/SkillTreeScreen';
import { TrophyHallScreen } from './screens/TrophyHallScreen';
import { GameArenaScreen } from './screens/games/GameArenaScreen';
import { getProfile, ApiError } from './api/client';

const FALLBACK_PLAYER_STATE: PlayerState = {
  level: 1,
  title: 'Code Squire',
  currentXp: 0,
  targetXp: 100,
  streakDays: 0,
  lives: 5,
  maxLives: 5,
  unclaimedRewards: 0,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard-quests');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [transitionKey, setTransitionKey] = useState<number>(0);

  const [playerState, setPlayerState] = useState<PlayerState>(FALLBACK_PLAYER_STATE);
  const [clearedQuestIds, setClearedQuestIds] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const profile = await getProfile();
        if (cancelled) return;
        setPlayerState({
          level: profile.level,
          title: profile.title,
          currentXp: profile.currentXp,
          targetXp: profile.targetXp,
          streakDays: profile.streakDays,
          lives: profile.lives,
          maxLives: profile.maxLives,
          unclaimedRewards: profile.unclaimedRewards,
        });
        setClearedQuestIds(profile.clearedQuestIds ?? []);
        setEarnedBadges(profile.earnedBadgeIds ?? []);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : 'Failed to load profile.';
        setProfileError(message);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigate = (targetScreen: ScreenType, transition: TransitionType = 'none') => {
    setTransitionType(transition);
    setTransitionKey((prev) => prev + 1);
    setCurrentScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleStartGame = (questId: string) => {
    setActiveQuestId(questId);
    handleNavigate('practice-arena', 'push');
  };

  const getTransitionClass = () => {
    if (transitionType === 'push') return 'transition-push';
    if (transitionType === 'push_back') return 'transition-push-back';
    return '';
  };

  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface font-body-md flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        playerState={playerState}
      />

      {profileError && (
        <div className="w-full bg-error-container/20 text-error text-center text-label-sm font-label-sm py-1.5 mt-16">
          Couldn't reach the server — showing offline data. {profileError}
        </div>
      )}

      <main className={`w-full ${profileError ? 'pt-0' : 'pt-16'} bg-surface-container-lowest flex-1 flex flex-col`}>
        <div key={`${currentScreen}-${transitionKey}`} className={`w-full flex-1 flex flex-col ${getTransitionClass()}`}>
          {currentScreen === 'dashboard-quests' && (
            <DashboardScreen
              onNavigate={handleNavigate}
              onStartGame={handleStartGame}
              clearedQuestIds={clearedQuestIds}
              profileLoading={profileLoading}
            />
          )}
          {currentScreen === 'skill-tree' && (
            <SkillTreeScreen
              onNavigate={handleNavigate}
              onStartGame={handleStartGame}
              clearedQuestIds={clearedQuestIds}
              playerState={playerState}
            />
          )}
          {currentScreen === 'trophy-hall' && (
            <TrophyHallScreen
              onNavigate={handleNavigate}
              playerState={playerState}
              setPlayerState={setPlayerState}
            />
          )}
          {currentScreen === 'practice-arena' && (
            <GameArenaScreen
              questId={activeQuestId}
              onNavigate={handleNavigate}
              playerState={playerState}
              setPlayerState={setPlayerState}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}