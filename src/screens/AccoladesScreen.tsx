import React, { useState } from 'react';
import { ACCOLADES, AccoladeItem } from '../data/constants';
import { playTactileTick } from '../utils/audio';

interface AccoladesScreenProps {
  clearedQuests: string[];
  xp: number;
}

export function AccoladesScreen({ clearedQuests, xp }: AccoladesScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'gate' | 'mastery'>('all');

  const filtered = ACCOLADES.filter(a => {
    if (activeTab === 'gate') return a.category === 'gate';
    if (activeTab === 'mastery') return a.category === 'mastery';
    return true;
  });

  const isBadgeUnlocked = (badge: AccoladeItem): boolean => {
    if (badge.nodeKey) {
      return clearedQuests.includes(badge.nodeKey);
    }
    // Mastery trophies unlocked if all quests cleared or high XP
    return clearedQuests.length >= 6;
  };

  const unlockedCount = ACCOLADES.filter(isBadgeUnlocked).length;

  return (
    <div className="relative w-full min-h-screen pb-16" style={{ background: '#07080A' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative pt-8 pb-4 text-center px-4 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest mb-3"
          style={{ background: 'rgba(61,139,102,0.1)', color: '#3D8B66', border: '1px solid rgba(61,139,102,0.25)' }}
        >
          <span className="material-symbols-outlined text-xs">military_tech</span>
          ACCOLADES & MILESTONES // DAY-0 VAULT
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display" style={{ color: '#E2E2E6' }}>
          TROPHY & ACCREDITATION VAULT
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-mono max-w-lg mx-auto" style={{ color: '#6E788A' }}>
          {unlockedCount} of {ACCOLADES.length} badges unlocked. Complete curriculum nodes to earn accreditation tokens.
        </p>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {(['all', 'gate', 'mastery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                playTactileTick();
                setActiveTab(tab);
              }}
              className="px-4 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all uppercase"
              style={{
                background: activeTab === tab ? '#15181E' : 'transparent',
                color: activeTab === tab ? '#E2E2E6' : '#6E788A',
                border: activeTab === tab ? '1px solid #262C36' : '1px solid transparent',
              }}
            >
              {tab === 'all' ? `ALL BADGES (${ACCOLADES.length})` : tab === 'gate' ? 'GATE MILESTONES' : 'MASTERY TROPHIES'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Accolades Cards */}
      <div className="relative max-w-5xl mx-auto px-4 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const unlocked = isBadgeUnlocked(item);
          return (
            <div
              key={item.id}
              className="rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              style={{
                background: unlocked ? '#11141A' : '#0B0D11',
                borderColor: unlocked ? '#3D8B66' : '#1F242C',
                boxShadow: unlocked ? '0 0 12px rgba(61,139,102,0.1)' : 'none',
                opacity: unlocked ? 1 : 0.7,
              }}
            >
              {/* Scanline overlay for locked */}
              {!unlocked && <div className="absolute inset-0 locked-scanlines pointer-events-none opacity-40" />}

              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: unlocked ? 'rgba(61,139,102,0.15)' : '#07080A',
                        color: unlocked ? '#3D8B66' : '#4A5260',
                        border: unlocked ? '1px solid rgba(61,139,102,0.3)' : '1px solid #1F242C',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold font-display" style={{ color: unlocked ? '#E2E2E6' : '#6E788A' }}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-mono" style={{ color: '#4A5260' }}>
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      background: unlocked ? 'rgba(61,139,102,0.12)' : '#07080A',
                      color: unlocked ? '#3D8B66' : '#4A5260',
                      border: unlocked ? '1px solid rgba(61,139,102,0.25)' : '1px solid #1F242C',
                    }}
                  >
                    {item.xp}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs font-mono mb-3 leading-relaxed" style={{ color: unlocked ? '#ADB7C6' : '#4A5260' }}>
                  {item.criteria}
                </p>
              </div>

              {/* Footer status */}
              <div
                className="pt-2 border-t flex items-center justify-between text-[10px] font-mono"
                style={{ borderColor: '#1F242C' }}
              >
                <span className="flex items-center gap-1" style={{ color: unlocked ? '#3D8B66' : '#4A5260' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    {unlocked ? item.footerLeft.icon : 'lock'}
                  </span>
                  {unlocked ? item.footerLeft.text : 'LOCKED'}
                </span>
                <span style={{ color: '#4A5260' }}>{item.badgeChip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
