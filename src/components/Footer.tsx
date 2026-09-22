import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low py-space-lg mt-space-xl border-t border-surface-container-highest/20">
      <div className="w-full px-gutter flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
        <div className="flex items-center gap-space-md">
          <span className="font-code-inline text-code-inline text-primary">CODEQUEST // CORE v2.4.8</span>
          <span>Disciplined Gamified Learning Engine</span>
        </div>
        <div className="flex items-center gap-space-lg">
          <a className="hover:text-on-surface transition-colors cursor-pointer" href="#docs">
            Terminal Docs
          </a>
          <a className="hover:text-on-surface transition-colors cursor-pointer" href="#changelog">
            Changelog
          </a>
          <a className="hover:text-on-surface transition-colors cursor-pointer" href="#status">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
};
