const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3000';

export interface BackendProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    totalXp: number;
    level: number;
    hearts: number;
    streakCount: number;
  };
  earnedBadges: string[];
  skillNodes: string[];
  recentCompletions: string[];
  clearedQuestIds: string[];
}

export interface ProfileResponse {
  level: number;
  title: string;
  currentXp: number;
  targetXp: number;
  streakDays: number;
  lives: number;
  maxLives: number;
  unclaimedRewards: number;
  clearedQuestIds: string[];
  earnedBadgeIds: string[];
}

export interface HeartsResponse {
  lives: number;
  maxLives: number;
}

export interface SubmitQuestResponse {
  newXp: number;
  success?: boolean;
  xpEarned?: number;
  newTotalXp?: number;
  newLevel?: number;
  leveledUp?: boolean;
  badgeIds?: string[];
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export async function getProfile(): Promise<ProfileResponse> {
  const data = await request<BackendProfileResponse>('/api/profile');
  return {
    level: data.user.level,
    title: 'Code Knight',
    currentXp: data.user.totalXp,
    targetXp: data.user.level * 200,
    streakDays: data.user.streakCount,
    lives: data.user.hearts,
    maxLives: 5,
    unclaimedRewards: data.earnedBadges?.length > 0 ? 1 : 0,
    clearedQuestIds: data.clearedQuestIds ?? [],
    earnedBadgeIds: data.earnedBadges ?? [],
  };
}

export function getHearts(): Promise<HeartsResponse> {
  return request<HeartsResponse>('/api/hearts');
}

export function loseHeart(): Promise<HeartsResponse> {
  return request<HeartsResponse>('/api/hearts/lose', { method: 'POST' });
}

export function checkStreak(): Promise<{ streakDays: number }> {
  return request<{ streakDays: number }>('/api/streak/check', { method: 'POST' });
}

export function submitQuest(questId: string): Promise<SubmitQuestResponse> {
  return request<SubmitQuestResponse>('/api/quests/submit', {
    method: 'POST',
    body: JSON.stringify({ questId }),
  });
}
