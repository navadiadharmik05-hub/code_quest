import React from 'react';
import { ScreenType, TransitionType, PlayerState } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  playerState: PlayerState;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, playerState }) => {
  const navItems: { path: ScreenType; label: string }[] = [
    { path: 'dashboard-quests', label: 'Dashboard / Quests' },
    { path: 'skill-tree', label: 'Skill Tree' },
    { path: 'trophy-hall', label: 'Trophy Hall' },
    { path: 'practice-arena', label: 'Practice Arena' },
  ];

  const xpPercent = Math.round((playerState.currentXp / playerState.targetXp) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-low/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-16 w-full px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg shrink-0">
          <div
            className="flex items-center gap-space-sm cursor-pointer"
            onClick={() => onNavigate('dashboard-quests', 'none')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-surface-container-lowest font-bold text-sm shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-surface-dim">terminal</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              CodeQuest
            </span>
          </div>

          <nav
            className="flex items-center gap-space-xs overflow-x-auto scrollbar-none"
            data-active-classes="bg-surface-container text-primary font-headline-sm"
          >
            {navItems.map((item) => {
              const isActive = currentScreen === item.path;
              return (
                <a
                  key={item.path}
                  data-path={item.path}
                  href={`#${item.path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path, 'none');
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-space-md py-space-xs rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-surface-container text-primary font-headline-sm shadow-sm'
                      : 'font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden md:flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-xs rounded-xl">
            <div className="flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary-container/20 text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Lvl {playerState.level} • {playerState.title}</span>
            </div>

            <div className="hidden 2xl:flex items-center gap-space-xs">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
                  <span>{playerState.currentXp.toLocaleString()} / {playerState.targetXp.toLocaleString()} XP</span>
                </div>
                <div className="w-28 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(xpPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="h-4 w-px bg-surface-container-highest"></div>
            <div className="flex items-center gap-space-xs text-tertiary font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>{playerState.streakDays} Days</span>
            </div>

            <div className="h-4 w-px bg-surface-container-highest"></div>
            <div className="flex items-center gap-space-xs text-error font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px]">favorite</span>
              <span>{playerState.lives} / {playerState.maxLives}</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm pl-space-xs">
            <button
              className="flex items-center gap-space-xs p-space-xs rounded-xl hover:bg-surface-container-high transition-colors"
              type="button"
              title="Player Profile"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-surface-dim font-bold text-xs shadow-inner">
                  <span>CQ</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_rgba(3,181,211,0.8)]"></span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
