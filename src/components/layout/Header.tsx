import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Home, Briefcase, FolderGit2, Layers, BookOpen, Mail, Sun, Moon } from 'lucide-react';

const NAV = [
  { label: 'Home',       href: '#home',       icon: <Home size={14} /> },
  { label: 'Experience', href: '#experience', icon: <Briefcase size={14} /> },
  { label: 'Projects',   href: '#projects',   icon: <FolderGit2 size={14} /> },
  { label: 'Skills',     href: '#skills',     icon: <Layers size={14} /> },
  { label: 'Blogs',      href: '#blogs',      icon: <BookOpen size={14} /> },
  { label: 'Contact',    href: '#contact',    icon: <Mail size={14} /> },
];

export const Header: React.FC<{ githubUsername: string }> = ({ githubUsername }) => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : true;
    setDark(isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

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
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--header-border)' }}
    >
      <nav className="flex items-center justify-between px-6 py-3 max-w-[1100px] mx-auto">
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          HritikKumar<span style={{ color: 'var(--accent)' }}>.</span>
        </span>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: dark ? '#fbbf24' : '#6366f1',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-h)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Profile dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full transition-all duration-200"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-h)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <img
                src={`https://github.com/${githubUsername}.png`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Hritik Kumar</span>
                <span className="text-[10px]" style={{ color: 'var(--text3)' }}>@{githubUsername}</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text3)' }} />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--dropdown-bg)',
                  border: '1px solid var(--dropdown-border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {NAV.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--text2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text2)'; }}
                  >
                    <span style={{ color: 'var(--text3)' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
