import React, { useState, useEffect } from 'react';
import { ScreenType, TransitionType } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  onStartGame?: (questId: string) => void;
  clearedQuestIds?: string[];
  profileLoading?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onStartGame,
  clearedQuestIds = [],
  profileLoading = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'data-structures' | 'algorithms' | 'syntax-mastery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(4 * 3600 + 11 * 60 + 39);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const handleLaunch = (questId: string) => {
    if (onStartGame) {
      onStartGame(questId);
    } else {
      onNavigate('practice-arena', 'push');
    }
  };

  const quests = [
    {
      id: 'syntax-dungeon',
      category: 'syntax-mastery' as const,
      difficulty: 'Beginner',
      difficultyBadgeClass: 'bg-secondary-container/20 text-secondary',
      stars: 3,
      icon: 'terminal',
      iconColor: 'text-secondary',
      domain: 'Syntax & Expressions',
      title: 'Syntax Dungeon',
      description: 'Traverse labyrinth corridors by fixing syntax errors, broken semicolons, and malformed statements.',
      xp: '+30 XP',
      status: 'Completed',
      hasReplay: true,
    },
    {
      id: 'execution-arena',
      category: 'algorithms' as const,
      difficulty: 'Intermediate',
      difficultyBadgeClass: 'bg-secondary/15 text-secondary-fixed',
      stars: 2,
      icon: 'bolt',
      iconColor: 'text-primary',
      domain: 'Control Flow & Loops',
      title: 'Execution Arena',
      description: 'Predict program step execution order and memory stack states across nested loops and branching logic.',
      xp: '+20 XP',
      status: 'Active Stack',
      hasReplay: false,
    },
    {
      id: 'sort-arena',
      category: 'algorithms' as const,
      difficulty: 'Intermediate',
      difficultyBadgeClass: 'bg-secondary/15 text-secondary-fixed',
      stars: 1,
      icon: 'bar_chart',
      iconColor: 'text-tertiary',
      domain: 'Sorting Algorithms',
      title: 'Sort Arena',
      description: 'Manually swap array pointers and optimize swaps to defeat QuickSort and MergeSort benchmarks.',
      xp: '+40 XP',
      status: 'Stage 2 / 5',
      hasReplay: false,
    },
    {
      id: 'tower-of-hanoi',
      category: 'data-structures' as const,
      difficulty: 'Advanced',
      difficultyBadgeClass: 'bg-error-container/30 text-error',
      stars: 0,
      icon: 'cyclone',
      iconColor: 'text-primary-container',
      domain: 'Recursion & Induction',
      title: 'Tower of Hanoi',
      description: 'Master recursive call stacks and base conditions to move sacred algorithmic disks without stacking larger on smaller.',
      xp: '+50 XP',
      status: 'Unattempted',
      hasReplay: false,
    },
    {
      id: 'bst-quest',
      category: 'data-structures' as const,
      difficulty: 'Advanced',
      difficultyBadgeClass: 'bg-error-container/30 text-error',
      stars: 0,
      icon: 'account_tree',
      iconColor: 'text-secondary-container',
      domain: 'Binary Trees & Traversals',
      title: 'BST Quest',
      description: 'Insert, rebalance (AVL/Red-Black), and traverse trees (In-order, Pre-order, Post-order) through dungeon rooms.',
      xp: '+60 XP',
      status: 'Unlocked',
      hasReplay: false,
    },
    {
      id: 'stack-queue-boss',
      category: 'data-structures' as const,
      difficulty: 'Boss Raid',
      difficultyBadgeClass: 'bg-error-container text-on-error-container font-semibold',
      stars: 0,
      icon: 'coronavirus',
      iconColor: 'text-error',
      domain: 'LIFO VS FIFO BUFFERS',
      title: 'Stack & Queue Boss',
      description: 'Defeat the memory buffer overflow demon by routing network packets through strict LIFO and FIFO pipelines in real-time.',
      xp: '+35 XP',
      status: 'Raid',
      isBoss: true,
    },
  ];

  const questsWithRealStatus = quests.map((q) =>
    clearedQuestIds.includes(q.id) ? { ...q, status: 'Completed' } : q
  );

  const filteredQuests = questsWithRealStatus.filter((q) => {
    const matchesCategory = activeFilter === 'all' || q.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full px-margin-mobile xl:px-margin py-space-md max-w-[1680px] mx-auto flex flex-col gap-space-lg">
        {/* Sub-bar: Filter Tabs, Search & Search Meta */}
        <section className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md bg-surface-container-low p-space-sm rounded-xl shadow-sm">
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs xl:pb-0 scrollbar-none">
            <button
              className={`filter-tab px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-space-xs whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={() => setActiveFilter('all')}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">view_kanban</span>
              <span>All Quests</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary-container/30 text-primary font-code-inline text-[10px]">6</span>
            </button>

            <button
              className={`filter-tab px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-space-xs whitespace-nowrap cursor-pointer ${
                activeFilter === 'data-structures'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={() => setActiveFilter('data-structures')}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">account_tree</span>
              <span>Data Structures</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-code-inline text-[10px]">3</span>
            </button>

            <button
              className={`filter-tab px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-space-xs whitespace-nowrap cursor-pointer ${
                activeFilter === 'algorithms'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={() => setActiveFilter('algorithms')}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary">tune</span>
              <span>Algorithms</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-code-inline text-[10px]">2</span>
            </button>

            <button
              className={`filter-tab px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all flex items-center gap-space-xs whitespace-nowrap cursor-pointer ${
                activeFilter === 'syntax-mastery'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={() => setActiveFilter('syntax-mastery')}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">code_blocks</span>
              <span>Syntax Mastery</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-code-inline text-[10px]">1</span>
            </button>
          </div>

          <div className="relative w-full xl:w-80 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-space-sm flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
            <input
              className="w-full pl-9 pr-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-code-inline text-code-inline focus:outline-none focus:bg-surface-container transition-all"
              placeholder="Search challenges or concepts..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Daily Protocol Banner */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md lg:p-space-lg shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center shrink-0 text-tertiary">
                <span className="material-symbols-outlined text-[26px]">timer</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Invert a Binary Tree in under 5 minutes</span>
                  <span className="inline-flex items-center text-tertiary font-code-inline text-code-inline font-semibold">+60 XP</span>
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Build and navigate BST nodes before memory buffer overflows.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end shrink-0">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg">
                <span className="material-symbols-outlined text-[18px] text-tertiary">hourglass_bottom</span>
                <span className="font-code-inline text-code-inline text-on-surface font-semibold">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
              <button
                className="px-space-lg py-space-sm bg-primary hover:bg-primary-fixed text-on-primary-fixed font-headline-sm text-headline-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-space-xs cursor-pointer"
                type="button"
                onClick={() => handleLaunch('bst-quest')}
              >
                <span>Accept Run</span>
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-space-md">
          {profileLoading && (
            <div className="col-span-full flex items-center justify-center py-space-lg text-on-surface-variant font-label-sm">
              Loading your quests…
            </div>
          )}
          {!profileLoading && filteredQuests.map((quest) => (
            <article
              key={quest.id}
              className="quest-card group relative flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md hover:bg-surface-container"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between gap-space-xs">
                  <span className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider ${quest.difficultyBadgeClass}`}>
                    {quest.isBoss ? 'Boss Raid' : quest.difficulty}
                  </span>
                  <div className="flex items-center gap-0.5 text-tertiary">
                    {[1, 2, 3].map((starIdx) => (
                      <span key={starIdx} className="material-symbols-outlined text-[16px]">
                        {starIdx <= quest.stars ? 'star' : 'star_border'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-space-sm mt-space-xs">
                  <div className={`w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0 ${quest.iconColor}`}>
                    <span className="material-symbols-outlined text-[24px]">{quest.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">
                      {quest.domain}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {quest.title}
                    </h3>
                  </div>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                  {quest.description}
                </p>
              </div>

              <div className="mt-space-md pt-space-sm flex flex-col gap-space-sm">
                <div className="flex items-center justify-between font-code-inline text-code-inline">
                  <span className="text-tertiary font-semibold">{quest.xp}</span>
                  {quest.status === 'Completed' ? (
                    <span className="text-secondary bg-surface-container-high px-2 py-0.5 rounded-full text-label-sm">
                      Completed
                    </span>
                  ) : (
                    <span className="text-outline text-label-sm">{quest.status}</span>
                  )}
                </div>

                <button
                  className={`w-full py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer ${
                    quest.isBoss
                      ? 'bg-tertiary-container hover:bg-tertiary text-on-tertiary'
                      : 'bg-primary hover:bg-primary-fixed text-on-primary-fixed'
                  }`}
                  type="button"
                  onClick={() => handleLaunch(quest.id)}
                >
                  <span>{quest.status === 'Completed' ? 'Replay' : 'Start'}</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};