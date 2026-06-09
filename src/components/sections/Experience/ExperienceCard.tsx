import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import type { Experience } from '../../../data/experience';

const badgeColor: Record<string, string> = {
  'Self-employed': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Internship':    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Contributor':   'bg-sky-500/15 text-sky-400 border-sky-500/30',
  'Full-time':     'bg-green-500/15 text-green-400 border-green-500/30',
  'Freelance':     'bg-pink-500/15 text-pink-400 border-pink-500/30',
};

interface Props {
  exp: Experience;
  open: boolean;
  onToggle: () => void;
}

export const ExperienceCard: React.FC<Props> = ({ exp, open, onToggle }) => {
  const badge = badgeColor[exp.employmentType] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30';

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-2xl border bg-[#0f1117]/80 backdrop-blur-sm transition-all duration-300
        ${open
          ? 'border-[#58a6ff]/40 shadow-[0_0_28px_rgba(88,166,255,0.08)]'
          : 'border-[#21262d] hover:border-[#58a6ff]/30 hover:shadow-[0_0_20px_rgba(88,166,255,0.06)]'
        }`}
    >
      {/* Collapsed header */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        {/* Logo / initials */}
        <div className="w-11 h-11 rounded-xl bg-[#141920] border border-[#21262d] flex items-center justify-center shrink-0 overflow-hidden">
          {exp.logo
            ? <img src={exp.logo} alt={exp.company} className="w-8 h-8 object-contain" />
            : <span className="text-sm font-bold text-gray-300">{exp.company.slice(0, 2).toUpperCase()}</span>
          }
        </div>

        {/* Center info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{exp.company}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge}`}>
              {exp.employmentType}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{exp.role}</p>
        </div>

        {/* Right: date + location + chevron */}
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">{exp.duration}</span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <MapPin size={10} />{exp.location}
          </span>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="ml-2 shrink-0 text-gray-500">
          <ChevronDown size={18} />
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#21262d]">
              {/* Achievements */}
              <ul className="mt-3 space-y-2">
                {exp.achievements.map((a, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2 text-gray-300 text-sm"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#58a6ff] shrink-0" />
                    {a}
                  </motion.li>
                ))}
              </ul>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {exp.technologies.map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#141920] border border-[#21262d] text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
