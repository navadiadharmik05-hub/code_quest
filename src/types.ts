export type ScreenType = 'dashboard-quests' | 'skill-tree' | 'trophy-hall' | 'practice-arena';
export type TransitionType = 'none' | 'push' | 'push_back';

export interface PlayerState {
  level: number;
  title: string;
  currentXp: number;
  targetXp: number;
  streakDays: number;
  lives: number;
  maxLives: number;
  unclaimedRewards: number;
}
