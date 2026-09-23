import React, { useEffect } from 'react';
import { VideoBriefing } from '../data/constants';

interface BriefingModalProps {
  briefing: VideoBriefing | null;
  onClose: () => void;
  onLaunchQuest: (nodeKey: string) => void;
}

export function BriefingModal({ briefing, onClose, onLaunchQuest }: BriefingModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!briefing) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.82)' }}
      onClick={onClose}
    >
      {/* Backdrop blur layer */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-xl mx-4 rounded-2xl border overflow-hidden"
        style={{ background: '#11141A', borderColor: '#1A202A' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: '#1A202A', background: '#0E1013' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded"
              style={{ color: '#DE5C34', background: 'rgba(222,92,52,0.12)', border: '1px solid rgba(222,92,52,0.25)' }}
            >
              {briefing.gameLabel}
            </span>
            <span className="text-xs font-mono" style={{ color: '#6E788A' }}>INTEL BRIEFING</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
            style={{ color: '#6E788A' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E2E2E6')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6E788A')}
            aria-label="Close"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* YouTube embed */}
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${briefing.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={briefing.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ border: 'none', display: 'block' }}
          />
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <h2 className="text-base font-semibold leading-snug" style={{ color: '#E2E2E6' }}>
              {briefing.title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: '#8690A0' }}>{briefing.summary}</p>
          </div>

          {/* Schematic terminal lines */}
          <div
            className="rounded-lg px-3 py-2 font-mono text-xs space-y-0.5"
            style={{ background: '#0B0D11', border: '1px solid #1A202A' }}
          >
            {briefing.schematicLines.map((line, i) => (
              <div key={i} style={{ color: '#3D8B66' }}>{line}</div>
            ))}
          </div>

          {/* Takeaways */}
          <div>
            <div
              className="text-[10px] font-mono tracking-widest mb-2"
              style={{ color: '#6E788A' }}
            >
              KEY TAKEAWAYS
            </div>
            <ul className="space-y-1.5">
              {briefing.takeaways.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#ADB7C6' }}>
                  <span style={{ color: '#DE5C34', flexShrink: 0, marginTop: '2px' }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata Row: Duration & External YouTube Link */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5" style={{ color: '#6E788A' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
              <span className="text-xs font-mono">{briefing.duration}</span>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${briefing.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono transition-colors hover:underline"
              style={{ color: '#DE5C34' }}
            >
              ▶ Watch on YouTube
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
            </a>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: '#1A202A', background: '#0E1013' }}
        >
          <button
            onClick={onClose}
            className="text-xs font-mono tracking-wide px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#6E788A', border: '1px solid #1F242C' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ADB7C6')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6E788A')}
          >
            CLOSE BRIEFING
          </button>
          {briefing.nodeKey && (
            <button
              onClick={() => onLaunchQuest(briefing.nodeKey!)}
              className="flex items-center gap-2 text-xs font-semibold tracking-wide px-5 py-2 rounded-lg transition-all"
              style={{
                background: '#DE5C34',
                color: '#fff',
                border: '1px solid rgba(222,92,52,0.5)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e76c46')}
              onMouseLeave={e => (e.currentTarget.style.background = '#DE5C34')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rocket_launch</span>
              START QUEST NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
