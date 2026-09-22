import React, { useState } from 'react';
import { ScreenType, TransitionType, PlayerState } from '../types';

interface TrophyHallScreenProps {
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
}

interface BadgeItem {
  id: string;
  title: string;
  category: 'algorithmic' | 'data-structures' | 'speedrun' | 'boss' | 'secret';
  rarity: number;
  dateScore: number;
  dateText: string;
  xpValue: number;
  tier: string;
  tierColor: string;
  icon: string;
  iconBg: string;
  description: string;
  unlocked: boolean;
  progressText?: string;
  progressPercent?: number;
  tag: string;
  isSecret?: boolean;
}

export const TrophyHallScreen: React.FC<TrophyHallScreenProps> = ({
  onNavigate,
  playerState,
  setPlayerState,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rarity' | 'date' | 'xp'>('rarity');
  const [claimed, setClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const initialBadges: BadgeItem[] = [
    {
      id: 'b1',
      title: 'Syntax Virtuoso',
      category: 'algorithmic',
      rarity: 4,
      dateScore: 3,
      dateText: 'Earned 3 days ago',
      xpValue: 150,
      tier: 'Gold Tier',
      tierColor: 'bg-tertiary/15 text-tertiary',
      icon: 'terminal',
      iconBg: 'from-tertiary-container/30 to-secondary-container/20 text-tertiary',
      description: 'Fixed 100 syntax errors without running tests. Zero runtime compilation exceptions recorded.',
      unlocked: true,
      tag: 'ALGORITHMIC',
    },
    {
      id: 'b2',
      title: 'Recursion Whisperer',
      category: 'algorithmic',
      rarity: 5,
      dateScore: 1,
      dateText: 'Earned yesterday',
      xpValue: 300,
      tier: 'Amethyst Tier',
      tierColor: 'bg-primary-container/20 text-primary',
      icon: 'all_inclusive',
      iconBg: 'from-primary-container/40 to-primary/20 text-primary',
      description: 'Solved Tower of Hanoi with minimum mathematical moves and zero stack spillages.',
      unlocked: true,
      tag: 'EPIC',
    },
    {
      id: 'b3',
      title: 'Sort Titan',
      category: 'algorithmic',
      rarity: 5,
      dateScore: 7,
      dateText: 'Earned 1 week ago',
      xpValue: 250,
      tier: 'Diamond Tier',
      tierColor: 'bg-secondary-container/20 text-secondary',
      icon: 'bar_chart',
      iconBg: 'from-secondary-container/40 to-secondary/30 text-secondary',
      description: 'Completed QuickSort dual-pivot partition in under 30 seconds with optimal in-place memory.',
      unlocked: true,
      tag: 'SPEEDRUN',
    },
    {
      id: 'b4',
      title: 'Iron Streak: 7 Days',
      category: 'speedrun',
      rarity: 3,
      dateScore: 5,
      dateText: 'Earned 5 days ago',
      xpValue: 200,
      tier: 'Ruby Tier',
      tierColor: 'bg-tertiary/20 text-tertiary',
      icon: 'local_fire_department',
      iconBg: 'from-tertiary/30 to-error-container/40 text-tertiary',
      description: 'Maintained continuous daily practice for 7 days without triggering freeze tokens.',
      unlocked: true,
      tag: 'STREAK',
    },
    {
      id: 'b5',
      title: 'Stack Guardian',
      category: 'data-structures',
      rarity: 3,
      dateScore: 14,
      dateText: 'Earned 2 weeks ago',
      xpValue: 180,
      tier: 'Emerald Tier',
      tierColor: 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim',
      icon: 'security',
      iconBg: 'from-secondary/30 to-surface-bright text-secondary-fixed-dim',
      description: 'Prevented 50 stack overflow errors in low-level byte and memory challenge suites.',
      unlocked: true,
      tag: 'DATA STRUCT',
    },
    {
      id: 'b6',
      title: 'Clean Coder',
      category: 'algorithmic',
      rarity: 2,
      dateScore: 20,
      dateText: 'Earned',
      xpValue: 120,
      tier: 'Sapphire Tier',
      tierColor: 'bg-primary-fixed-dim/20 text-primary-fixed-dim',
      icon: 'code',
      iconBg: 'from-primary-fixed-dim/30 to-surface-bright text-primary-fixed-dim',
      description: 'Submitted 20 algorithmic solutions passing strict linter audits with zero warnings.',
      unlocked: true,
      tag: 'ROUTINE',
    },
    {
      id: 'b7',
      title: 'BST Overlord',
      category: 'data-structures',
      rarity: 3,
      dateScore: 999,
      dateText: '',
      xpValue: 220,
      tier: 'In Progress',
      tierColor: 'bg-surface-container text-outline',
      icon: 'account_tree',
      iconBg: 'bg-surface-container text-outline',
      description: 'Traverse 100 binary tree nodes in-order without backtracking or auxiliary memory.',
      unlocked: false,
      progressText: '38 / 100 nodes',
      progressPercent: 38,
      tag: 'DATA STRUCT',
    },
    {
      id: 'b8',
      title: 'Boss Exterminator',
      category: 'boss',
      rarity: 5,
      dateScore: 999,
      dateText: '',
      xpValue: 500,
      tier: 'Boss Raid',
      tierColor: 'bg-error-container/20 text-error',
      icon: 'swords',
      iconBg: 'bg-surface-container text-outline',
      description: 'Defeat the Stack & Queue Boss Raid in hard mode without utilizing tactical restarts.',
      unlocked: false,
      progressText: 'Locked: Complete BST Quest Tree first',
      tag: 'BOSS RAID',
    },
    {
      id: 'b9',
      title: 'Marathon Runner: 30 Days',
      category: 'speedrun',
      rarity: 4,
      dateScore: 999,
      dateText: '',
      xpValue: 350,
      tier: 'Streak Target',
      tierColor: 'bg-surface-container text-outline',
      icon: 'timer',
      iconBg: 'bg-surface-container text-outline',
      description: 'Reach a continuous 30-day coding streak on algorithmic challenges.',
      unlocked: false,
      progressText: '12 / 30 days (40%)',
      progressPercent: 40,
      tag: 'STREAK',
    },
    {
      id: 'b10',
      title: 'Big-O Optimizer',
      category: 'algorithmic',
      rarity: 4,
      dateScore: 999,
      dateText: '',
      xpValue: 280,
      tier: 'Mastery',
      tierColor: 'bg-surface-container text-outline',
      icon: 'speed',
      iconBg: 'bg-surface-container text-outline',
      description: 'Achieve O(n log n) or better algorithmic efficiency on 15 complex sorting puzzles.',
      unlocked: false,
      progressText: '7 / 15 puzzles',
      progressPercent: 46.6,
      tag: 'ALGORITHMIC',
    },
    {
      id: 'b11',
      title: 'Queue Conductor',
      category: 'data-structures',
      rarity: 2,
      dateScore: 999,
      dateText: '',
      xpValue: 160,
      tier: 'Pipeline',
      tierColor: 'bg-surface-container text-outline',
      icon: 'hub',
      iconBg: 'bg-surface-container text-outline',
      description: 'Process 500 stream packets in FIFO mode under peak congestion without dropping a packet.',
      unlocked: false,
      progressText: '0 / 500 packets',
      progressPercent: 0,
      tag: 'PIPELINE',
    },
    {
      id: 'b12',
      title: 'Master of the Void',
      category: 'secret',
      rarity: 5,
      dateScore: 999,
      dateText: '',
      xpValue: 750,
      tier: 'Secret Accolade',
      tierColor: 'bg-primary-container/10 text-primary',
      icon: 'visibility_off',
      iconBg: 'bg-surface-container-lowest text-outline-variant',
      description: '"Complete a high-level boss duel with exactly 1 HP remaining while under active penalty."',
      unlocked: false,
      isSecret: true,
      tag: 'LEGENDARY',
    },
  ];

  const handleClaim = () => {
    if (claimed || isClaiming) return;
    setIsClaiming(true);
    setTimeout(() => {
      setClaimed(true);
      setIsClaiming(false);
      setPlayerState((prev) => ({
        ...prev,
        currentXp: prev.currentXp + 350,
        lives: Math.min(prev.lives + 1, prev.maxLives),
        unclaimedRewards: 0,
      }));
    }, 800);
  };

  const filteredBadges = initialBadges
    .filter((b) => {
      const matchesCat = activeCategory === 'all' || b.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rarity') return b.rarity - a.rarity;
      if (sortBy === 'date') return a.dateScore - b.dateScore;
      if (sortBy === 'xp') return b.xpValue - a.xpValue;
      return 0;
    });

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full px-gutter py-space-xl overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
          {/* Header / Summary Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="px-space-sm py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm text-label-sm tracking-widest uppercase">
                  Vault of Honors
                </span>
                <span className="text-outline-variant text-[12px] font-code-inline">// REGISTRY 0x48A</span>
              </div>
              <h1 className="font-display text-display text-on-surface tracking-tight">Trophy Hall &amp; Accolades</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Codified milestones of computational mastery, algorithmic warfare, and persistent development discipline.
              </p>
            </div>

            {/* Claimable Rewards Pill Banner */}
            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md p-space-md rounded-xl shadow-lg transition-all ${
                claimed
                  ? 'bg-surface-container-low'
                  : 'bg-gradient-to-r from-tertiary-container/20 via-surface-container-high to-surface-container-high'
              }`}
              id="reward-banner"
            >
              {claimed ? (
                <div className="flex items-center gap-space-md py-space-xs">
                  <span className="material-symbols-outlined text-primary text-[28px]">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Rewards Successfully Claimed!</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">+350 XP credited • 1 Extra Life added to Inventory</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-space-md">
                    <div className="relative w-11 h-11 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary shrink-0 shadow-[0_0_14px_rgba(202,129,0,0.35)]">
                      <span className="material-symbols-outlined text-[24px]">redeem</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full animate-ping"></span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full"></span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-headline-sm text-headline-sm text-on-surface">2 Accolades Ready!</span>
                        <span className="px-space-xs py-0.2 rounded bg-tertiary/20 text-tertiary font-label-sm text-label-sm uppercase">Unclaimed</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Bug Hunter Elite • Speed Demon</span>
                    </div>
                  </div>
                  <button
                    className="px-space-lg py-space-sm bg-tertiary-container hover:bg-tertiary text-on-tertiary-container hover:text-on-tertiary rounded-lg font-headline-sm text-headline-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-space-xs cursor-pointer"
                    id="claim-btn"
                    onClick={handleClaim}
                    disabled={isClaiming}
                  >
                    {isClaiming ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        <span>Transmitting XP...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span>Claim +350 XP &amp; +1 Life</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Player Trophy Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[26px]">military_tech</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Total Badges</span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">14</span>
                  <span className="font-body-sm text-body-sm text-outline">/ 32</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '43.75%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Prestige Score</span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold">2,850</span>
                <span className="font-label-sm text-label-sm text-secondary font-code-inline">+420 this week</span>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-tertiary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[26px]">diamond</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Rare Accolades</span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">4</span>
                  <span className="font-label-sm text-label-sm text-tertiary">Legendary</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">Top 3.8% of Knights</span>
              </div>
            </div>

            <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm hover:bg-surface-container transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-error shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[26px]">notifications_active</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Unclaimed Rewards</span>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-tertiary font-bold" id="unclaimed-count">
                    {claimed ? '0' : '2'}
                  </span>
                  <span className="px-space-xs py-0.5 rounded-full bg-tertiary/20 text-tertiary font-label-sm text-label-sm font-code-inline">+350 XP</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Click banner above</span>
              </div>
            </div>
          </div>

          {/* Controls & Filter Toolbar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pt-space-xs">
            <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs xl:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Accolades (32)' },
                { id: 'algorithmic', label: 'Algorithmic (8)' },
                { id: 'data-structures', label: 'Data Structures (8)' },
                { id: 'speedrun', label: 'Speedrun & Streaks (6)' },
                { id: 'boss', label: 'Boss Slayer (4)' },
                { id: 'secret', label: 'Secret / Hidden (6)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`cat-btn px-space-md py-space-xs rounded-lg font-headline-sm text-headline-sm shadow-sm transition-colors whitespace-nowrap cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                  onClick={() => setActiveCategory(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-space-sm shrink-0">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[18px]">search</span>
                <input
                  className="pl-9 pr-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm focus:outline-none focus:bg-surface-container w-64 transition-all"
                  id="badge-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, tag, or perk..."
                  type="text"
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none pl-space-md pr-8 py-space-xs rounded-lg bg-surface-container-low text-on-surface text-body-sm font-headline-sm focus:outline-none focus:bg-surface-container cursor-pointer transition-all"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rarity' | 'date' | 'xp')}
                >
                  <option value="rarity">Sort by: Rarity (High to Low)</option>
                  <option value="date">Sort by: Completion Date</option>
                  <option value="xp">Sort by: XP Value</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Badges Section Indicator */}
          <div className="flex items-center justify-between pt-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Active Accolade Matrix</span>
              <span className="text-label-sm font-label-sm font-code-inline text-outline-variant">[6 UNLOCKED / 6 PENDING DISPLAYED]</span>
            </div>
            <span className="font-label-sm text-label-sm text-outline-variant font-code-inline">SYNCED WITH COMPILER RUNNER</span>
          </div>

          {/* Badge Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg" id="badges-grid">
            {filteredBadges.map((badge) => {
              if (badge.isSecret) {
                return (
                  <div
                    key={badge.id}
                    className="badge-card flex flex-col justify-between p-space-lg bg-surface-container-lowest/60 rounded-xl shadow-inner group opacity-70 hover:opacity-90 transition-all"
                    data-category={badge.category}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-space-sm">
                        <div className="relative w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center text-outline-variant shadow-inner">
                          <span className="material-symbols-outlined text-[34px] opacity-30">visibility_off</span>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-code-inline text-headline-md text-outline font-bold tracking-widest">???</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-space-xs py-0.5 rounded bg-primary-container/10 text-primary font-label-sm text-label-sm uppercase font-code-inline">
                            Secret Accolade
                          </span>
                          <span className="font-label-sm text-label-sm text-tertiary font-code-inline">+{badge.xpValue} XP</span>
                        </div>
                      </div>
                      <div className="mt-space-md">
                        <div className="flex items-center gap-space-xs">
                          <h3 className="font-headline-sm text-headline-sm text-outline-variant font-code-inline">
                            {badge.title}
                          </h3>
                          <span className="material-symbols-outlined text-outline-variant text-[16px]">lock</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-outline-variant mt-space-xs italic font-code-inline">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-space-lg pt-space-sm p-space-xs rounded bg-surface-container/40 flex items-center justify-between text-outline-variant font-label-sm text-label-sm font-code-inline">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">psychology</span> CLASSIFIED ENCRYPTION
                      </span>
                      <span className="text-tertiary font-bold">LEGENDARY</span>
                    </div>
                  </div>
                );
              }

              if (!badge.unlocked) {
                return (
                  <div
                    key={badge.id}
                    className="badge-card flex flex-col justify-between p-space-lg bg-surface-container-lowest/80 rounded-xl shadow-inner group opacity-85 hover:opacity-100 transition-all"
                    data-category={badge.category}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-space-sm">
                        <div className="relative w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-outline shadow-inner">
                          <span className="material-symbols-outlined text-[34px] grayscale opacity-40">{badge.icon}</span>
                          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/60 rounded-xl backdrop-blur-[1px]">
                            <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm uppercase font-code-inline ${badge.tierColor}`}>
                            {badge.tier}
                          </span>
                          <span className="font-label-sm text-label-sm text-outline font-code-inline">+{badge.xpValue} XP</span>
                        </div>
                      </div>
                      <div className="mt-space-md">
                        <div className="flex items-center gap-space-xs">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">{badge.title}</h3>
                          <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-outline mt-space-xs">{badge.description}</p>
                      </div>
                    </div>

                    {badge.progressPercent !== undefined ? (
                      <div className="mt-space-lg pt-space-sm flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-label-sm font-label-sm font-code-inline">
                          <span className="text-on-surface-variant">PROGRESS</span>
                          <span className="text-primary font-bold">{badge.progressText}</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${badge.progressPercent}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-space-lg pt-space-sm p-space-xs rounded bg-surface-container-high/60 flex items-center gap-space-xs text-error font-label-sm text-label-sm font-code-inline">
                        <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                        <span>{badge.progressText}</span>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={badge.id}
                  className="badge-card flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
                  data-category={badge.category}
                >
                  <div>
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${badge.iconBg} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform`}>
                        <span className="material-symbols-outlined text-[34px]">{badge.icon}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm uppercase font-code-inline ${badge.tierColor}`}>
                          {badge.tier}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary font-code-inline">+{badge.xpValue} XP</span>
                      </div>
                    </div>
                    <div className="mt-space-md">
                      <div className="flex items-center gap-space-xs">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                          {badge.title}
                        </h3>
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">{badge.description}</p>
                    </div>
                  </div>
                  <div className="mt-space-lg pt-space-sm flex items-center justify-between text-outline-variant font-label-sm text-label-sm font-code-inline">
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">event_available</span> {badge.dateText}
                    </span>
                    <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface">{badge.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Prestige & Tier Breakdown Section */}
          <div className="mt-space-lg p-space-lg bg-surface-container-low rounded-xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-md">
            <div className="flex items-center gap-space-lg">
              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Knight Commander Prestige Rank</h2>
                  <span className="px-space-xs py-0.5 rounded bg-primary-container/20 text-primary font-label-sm text-label-sm font-code-inline">TIER IV</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                  Unlock 4 more Gold or Amethyst tier accolades to advance to Sovereign Coder status and unlock terminal compiler customizers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-md shrink-0 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-code-inline">NEXT PRESTIGE UNLOCK</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-code-inline">3,500 XP Milestone</span>
              </div>
              <a
                className="px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm rounded-lg transition-colors flex items-center gap-space-xs cursor-pointer"
                href="#skill-tree"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('skill-tree', 'push_back');
                }}
              >
                <span>View Skill Tree</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
