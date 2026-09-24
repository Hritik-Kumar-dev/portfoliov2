import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-transparent py-4" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-muted text-sm">
          <p className="font-mono text-xs">&copy; {new Date().getFullYear()} Hritik Kumar. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-xs">
            <a href="#" className="hover-text-title transition-colors">
              GitHub
            </a>
            <a href="#" className="hover-text-title transition-colors">
              Twitter
            </a>
            <a href="#" className="hover-text-title transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
