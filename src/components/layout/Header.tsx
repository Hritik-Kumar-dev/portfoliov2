import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Home, Briefcase, FolderGit2, Layers, BookOpen } from 'lucide-react';

const NAV = [
  { label: 'Home',       href: '#home',       icon: <Home size={14} /> },
  { label: 'Experience', href: '#experience', icon: <Briefcase size={14} /> },
  { label: 'Projects',   href: '#projects',   icon: <FolderGit2 size={14} /> },
  { label: 'Skills',     href: '#skills',     icon: <Layers size={14} /> },
  { label: 'Blogs',      href: '#blogs',      icon: <BookOpen size={14} /> },
];

export const Header: React.FC<{ githubUsername: string }> = ({ githubUsername }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="border-b border-[#21262d] bg-[#080808] sticky top-0 z-40">
      <nav className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
        <div className="text-xl font-bold tracking-tight text-white">HritikKumar</div>

        {/* Profile dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-[#141920] p-1 pr-3 rounded-full border border-[#21262d] hover:border-[#58a6ff] transition-colors"
          >
            <img
              src={`https://github.com/${githubUsername}.png`}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col leading-tight text-left">
              <span className="text-xs font-semibold text-white">Hritik Kumar</span>
              <span className="text-[10px] text-gray-400">@{githubUsername}</span>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-[#141920] border border-[#21262d] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
              {NAV.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#0f1117] hover:text-white transition-colors"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
