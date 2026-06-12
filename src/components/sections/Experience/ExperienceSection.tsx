import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '../../../data/experience';

export const ExperienceSection: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
      <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Experience</h2>
      <div className="flex flex-col gap-2">
        {experiences.slice(0, 3).map((exp, i) => (
          <motion.div key={exp.id}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.35 }}>
            <ExperienceCard
              exp={exp}
              open={openId === exp.id}
              onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
              detailView={false}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={() => navigate('/experience')}
          className="flex items-center gap-1.5 text-sm transition-colors border px-4 py-1.5 rounded-full"
          style={{ color: 'var(--accent)', borderColor: 'var(--surface-border)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; }}>
          See all experience <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};
