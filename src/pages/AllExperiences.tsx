import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { experiences } from '../data';
import { ExperienceCard } from '../components/sections/Experience/ExperienceCard';

export const AllExperiences: React.FC = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg2)', color: 'var(--text)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>All Experience</h1>
        <div className="flex flex-col gap-2">
          {experiences.map(exp => (
            <ExperienceCard key={exp.id} exp={exp}
              open={openId === exp.id}
              onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
              detailView={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
