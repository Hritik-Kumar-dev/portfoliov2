import React, { useEffect, useState } from 'react';
import { Home, Briefcase, FolderGit2, Layers, BookOpen, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { label: 'Home',       href: '#home',       icon: <Home size={16} /> },
  { label: 'Experience', href: '#experience', icon: <Briefcase size={16} /> },
  { label: 'Projects',   href: '#projects',   icon: <FolderGit2 size={16} /> },
  { label: 'Skills',     href: '#skills',     icon: <Layers size={16} /> },
  { label: 'Blogs',      href: '#blogs',      icon: <BookOpen size={16} /> },
  { label: 'Contact',    href: '#contact',    icon: <Mail size={16} /> },
];

const DockBtn: React.FC<{ item: typeof NAV[0]; active: boolean }> = ({ item, active }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a href={item.href} onClick={handleClick} aria-label={item.label}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center">
      <motion.div
        whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200
          ${active
            ? 'bg-[#58a6ff]/20 text-[#58a6ff] shadow-[0_0_10px_rgba(88,166,255,0.3)]'
            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
      >
        {item.icon}
      </motion.div>

      {/* Tooltip — RIGHT side */}
      {hovered && (
        <motion.span
          initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2.5 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] font-medium bg-[#141920] border border-[#21262d] text-white pointer-events-none z-50">
          {item.label}
        </motion.span>
      )}
    </a>
  );
};

export const FloatingDock: React.FC = () => {
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(href); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* Desktop: right side, close to content, tooltip appears to the right of icon */}
      <nav aria-label="Page navigation"
        className="hidden md:flex fixed right-[max(0.75rem,calc((100vw-64rem)/2-3rem))] top-1/2 -translate-y-1/2 z-50
          flex-col gap-1 p-1.5 rounded-2xl
          bg-[#0f1117]/80 border border-[#21262d] backdrop-blur-xl
          shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {NAV.map((item) => <DockBtn key={item.href} item={item} active={active === item.href} />)}
      </nav>

      {/* Mobile: bottom center horizontal */}
      <nav aria-label="Page navigation"
        className="flex md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50
          flex-row gap-1 p-1.5 rounded-2xl
          bg-[#0f1117]/85 border border-[#21262d] backdrop-blur-xl
          shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {NAV.map((item) => {
          const [h, setH] = useState(false);
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
          };
          return (
            <a key={item.href} href={item.href} onClick={handleClick} aria-label={item.label}
              onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
              className="relative flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200
                  ${active === item.href ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}>
                {item.icon}
              </motion.div>
              {h && (
                <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] font-medium bg-[#141920] border border-[#21262d] text-white pointer-events-none z-50">
                  {item.label}
                </motion.span>
              )}
            </a>
          );
        })}
      </nav>
    </>
  );
};
