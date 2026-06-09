import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '../data';
import type { Project } from '../types';

const statusConfig = {
  live:          { label: 'Live',        cls: 'bg-accent-dim text-accent border-surface' },
  building:      { label: 'Building',    cls: 'bg-accent-dim text-accent border-surface' },
  'coming-soon': { label: 'Coming Soon', cls: 'bg-accent-dim text-accent border-surface'  },
};

const Card: React.FC<{ project: Project }> = ({ project }) => {
  const [h, setH] = useState(false);
  const navigate = useNavigate();
  const status = project.status ? statusConfig[project.status] : null;
  return (
    <div onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="group relative bg-surface border border-surface rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover-border-accent hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]">
      <div className="relative w-full aspect-video overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {status && <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${status.cls}`}>{status.label}</span>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-title mb-1">{project.title}</h3>
        <p className="text-dim text-xs line-clamp-2 mb-3">{project.description}</p>
        <div className={`flex flex-wrap gap-1.5 transition-all duration-200 ${h ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {project.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-px rounded-full bg-tag border border-surface text-dim">{t}</span>)}
        </div>
        <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-200 ${h ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-accent-dim border border-surface text-accent hover:bg-accent-dim transition-colors">
            <ExternalLink size={11} /> Live</a>}
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-bright)' }}>
            <GitBranch size={11} /> GitHub</a>}
        </div>
      </div>
    </div>
  );
};

export const AllProjects: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-page text-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover-text-title text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-title mb-4">All Projects</h1>
        <div className="grid grid-cols-2 gap-5">
          {projects.map(p => <Card key={p.id} project={p} />)}
        </div>
      </div>
    </div>
  );
};
