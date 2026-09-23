import React from 'react';
import { playTactileTick } from '../utils/audio';

type ScreenId = 'dashboard' | 'accolades' | 'codex' | 'arena';

interface TopNavbarProps {
  currentScreen: ScreenId;
  xp: number;
  hearts: number;
  sfxEnabled: boolean;
  onNavigate: (screen: ScreenId) => void;
  onToggleSfx: () => void;
}

const XP_CAP = 500;

const RANK_LABEL = 'LVL 01 // CADET INITIATE';

const NAV_ITEMS: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'ROADMAP TREE', icon: 'account_tree' },
  { id: 'accolades', label: 'ACCOLADES VAULT', icon: 'military_tech' },
  { id: 'codex', label: 'INTEL CODEX', icon: 'book_5' },
];

export function TopNavbar({
  currentScreen,
  xp,
  hearts,
  sfxEnabled,
  onNavigate,
  onToggleSfx,
}: TopNavbarProps) {
  const handleNav = (screen: ScreenId) => {
    playTactileTick();
    onNavigate(screen);
  };

  const xpPct = Math.min(100, Math.round((xp / XP_CAP) * 100));

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ background: '#0E1013', borderBottom: '1px solid #1F242C' }}
    >
      <div className="flex items-center justify-between px-4 h-[52px] max-w-[1400px] mx-auto gap-3">
        {/* Brand lockup */}
        <div className="flex items-center gap-2 flex-shrink-0 select-none">
          <span
            className="font-mono font-bold text-[15px] tracking-tight"
            style={{ color: '#DE5C34' }}
          >
            {'>_'}
          </span>
          <div className="leading-none">
            <span
              className="font-mono font-bold text-[13px] tracking-widest"
              style={{ color: '#E2E2E6' }}
            >
              CODEQUEST
            </span>
            <span className="font-mono text-[11px] ml-1.5" style={{ color: '#4A5260' }}>
              // ARCHIVAL LAB
            </span>
          </div>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono tracking-widest transition-all"
                style={{
                  background: active ? 'rgba(222,92,52,0.15)' : 'transparent',
                  color: active ? '#DE5C34' : '#6E788A',
                  border: active ? '1px solid rgba(222,92,52,0.3)' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.color = '#ADB7C6';
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.color = '#6E788A';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right HUD */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* SFX toggle */}
          <button
            onClick={onToggleSfx}
            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
            style={{ color: sfxEnabled ? '#3D8B66' : '#4A5260' }}
            onMouseEnter={e => (e.currentTarget.style.color = sfxEnabled ? '#4CAF82' : '#6E788A')}
            onMouseLeave={e => (e.currentTarget.style.color = sfxEnabled ? '#3D8B66' : '#4A5260')}
            title={sfxEnabled ? 'SFX On' : 'SFX Off'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {sfxEnabled ? 'music_note' : 'music_off'}
            </span>
          </button>

          {/* Rank pill */}
          <div
            className="hidden sm:flex items-center px-2 py-0.5 rounded font-mono text-[10px] tracking-widest"
            style={{ background: 'rgba(61,139,102,0.12)', color: '#3D8B66', border: '1px solid rgba(61,139,102,0.25)' }}
          >
            {RANK_LABEL}
          </div>

          {/* XP tracker */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <div
                className="w-[72px] h-[4px] rounded-full overflow-hidden"
                style={{ background: '#1A202A' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPct}%`, background: '#DE5C34' }}
                />
              </div>
              <div className="text-[9px] font-mono text-right mt-0.5" style={{ color: '#4A5260' }}>
                {xp}/{XP_CAP} XP
              </div>
            </div>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined"
                style={{
                  fontSize: '16px',
                  color: i < hearts ? '#3D8B66' : 'rgba(127,29,29,0.4)',
                  fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20",
                }}
              >
                favorite
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
