import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '../data';
import type { Project } from '../types';

const statusConfig = {
  live:          { label: 'Live',        cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  building:      { label: 'Building',    cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'coming-soon': { label: 'Coming Soon', cls: 'bg-blue-500/20  text-blue-400  border-blue-500/30'  },
};

const Card: React.FC<{ project: Project }> = ({ project }) => {
  const [h, setH] = useState(false);
  const navigate = useNavigate();
  const status = project.status ? statusConfig[project.status] : null;
  return (
    <div onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="group relative bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover:border-[#58a6ff] hover:shadow-[0_0_24px_rgba(88,166,255,0.1)]">
      <div className="relative w-full aspect-video overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {status && <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${status.cls}`}>{status.label}</span>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{project.description}</p>
        <div className={`flex flex-wrap gap-1.5 transition-all duration-200 ${h ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {project.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-2 py-px rounded-full bg-[#161b22] border border-[#30363d] text-gray-500">{t}</span>)}
        </div>
        <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-200 ${h ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 transition-colors">
            <ExternalLink size={11} /> Live</a>}
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-[#30363d]/60 border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors">
            <GitBranch size={11} /> GitHub</a>}
        </div>
      </div>
    </div>
  );
};

export const AllProjects: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-8">All Projects</h1>
        <div className="grid grid-cols-2 gap-5">
          {projects.map(p => <Card key={p.id} project={p} />)}
        </div>
      </div>
    </div>
  );
};
