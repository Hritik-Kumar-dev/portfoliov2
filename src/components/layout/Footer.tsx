import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface bg-page py-4">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Hritik Kumar. All rights reserved.</p>
          <div className="flex gap-6">
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
