import React, { useState } from 'react';
import { VIDEO_BRIEFINGS, VideoBriefing } from '../data/constants';
import { BriefingModal } from '../components/BriefingModal';
import { playTactileTick } from '../utils/audio';

interface IntelCodexScreenProps {
  onLaunchQuest: (nodeKey: string) => void;
}

export function IntelCodexScreen({ onLaunchQuest }: IntelCodexScreenProps) {
  const [selectedBriefing, setSelectedBriefing] = useState<VideoBriefing | null>(null);

  const handleOpenBriefing = (briefing: VideoBriefing) => {
    playTactileTick();
    setSelectedBriefing(briefing);
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
          <span className="material-symbols-outlined text-xs">book_5</span>
          ARCHIVAL KNOWLEDGE BASE // VIDEO LECTURES
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display" style={{ color: '#E2E2E6' }}>
          INTEL CODEX & LECTURE REPOSITORY
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-mono max-w-lg mx-auto" style={{ color: '#6E788A' }}>
          Deep-dive video briefings explaining core computer science foundations, algorithm ASTs, recursion proofs, and data structures.
        </p>
      </div>

      {/* 2x3 or 3x2 Video Lecture Grid */}
      <div className="relative max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIDEO_BRIEFINGS.map(item => (
          <div
            key={item.id}
            className="rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#DE5C34]"
            style={{ background: '#11141A', borderColor: '#1F242C' }}
          >
            {/* Video Thumbnail Container */}
            <div
              className="relative w-full cursor-pointer group"
              style={{ aspectRatio: '16/9', background: '#07080A' }}
              onClick={() => handleOpenBriefing(item)}
            >
              <img
                src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                alt={item.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(222,92,52,0.9)', color: '#fff' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>play_arrow</span>
                </div>
              </div>

              {/* Duration badge */}
              <div
                className="absolute bottom-2 right-2 px-2 py-0.5 rounded font-mono text-[10px]"
                style={{ background: 'rgba(0,0,0,0.8)', color: '#E2E2E6' }}
              >
                {item.duration}
              </div>

              {/* Game Label chip */}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded font-mono text-[10px] tracking-widest"
                style={{ background: 'rgba(222,92,52,0.85)', color: '#fff' }}
              >
                {item.gameLabel}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold font-display leading-snug line-clamp-2" style={{ color: '#E2E2E6' }}>
                  {item.title}
                </h3>
                <p className="mt-1 text-xs font-mono line-clamp-2" style={{ color: '#6E788A' }}>
                  {item.summary}
                </p>
              </div>

              {/* Schematic snippet */}
              <div
                className="p-2 rounded font-mono text-[10px] space-y-0.5"
                style={{ background: '#07080A', border: '1px solid #1A202A', color: '#3D8B66' }}
              >
                {item.schematicLines.slice(0, 2).map((line, i) => (
                  <div key={i} className="truncate">{line}</div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleOpenBriefing(item)}
                  className="flex items-center gap-1 text-xs font-mono hover:underline"
                  style={{ color: '#3D8B66' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_circle</span>
                  WATCH IN-APP
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-mono hover:underline"
                  style={{ color: '#DE5C34' }}
                >
                  Watch on YouTube
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Briefing Modal */}
      <BriefingModal
        briefing={selectedBriefing}
        onClose={() => setSelectedBriefing(null)}
        onLaunchQuest={onLaunchQuest}
      />
    </div>
  );
}
