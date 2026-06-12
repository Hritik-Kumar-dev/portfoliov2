import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Music } from 'lucide-react';
import bgMusic from '../../assets/precious.mp3';

export const Header: React.FC = () => {
  const [dark, setDark] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : true;
    setDark(isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('music');
    if (stored === 'playing') {
      setMusicPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (musicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [musicPlaying]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const toggleMusic = () => {
    setMusicPlaying(prev => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
      localStorage.setItem('music', next ? 'playing' : 'paused');
      return next;
    });
  };

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--header-border)' }}
    >
      <audio ref={audioRef} src={bgMusic} loop />
      <nav className="flex items-center justify-between px-6 py-3 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-2">
          <img
            src="/logo_portfolio.svg"
            alt="H"
            className={`h-7 w-7 transition-all duration-300 ${!dark ? 'invert' : ''}`}
          />
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            HritikKumar<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Music toggle */}
          <button
            onClick={toggleMusic}
            className="p-2 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: musicPlaying ? 'var(--accent)' : 'var(--text3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-h)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          >
            <Music size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: dark ? 'var(--text)' : 'var(--text)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-h)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
};
