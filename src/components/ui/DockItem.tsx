import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  horizontal?: boolean;
}

export const DockItem: React.FC<DockItemProps> = ({ icon, label, href, active, horizontal }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative flex items-center justify-center focus:outline-none"
    >
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200
          ${active
            ? 'bg-[#58a6ff]/20 text-[#58a6ff] shadow-[0_0_12px_rgba(88,166,255,0.35)]'
            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
          }`}
      >
        {icon}
      </motion.div>

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, x: horizontal ? 0 : 8, y: horizontal ? -8 : 0 }}
          animate={{ opacity: 1, x: horizontal ? 0 : 0, y: horizontal ? -4 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-50 whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium bg-[#141920] border border-[#21262d] text-white pointer-events-none
            ${horizontal ? 'bottom-full mb-2' : 'right-full mr-3'}`}
        >
          {label}
        </motion.div>
      )}
    </a>
  );
};
