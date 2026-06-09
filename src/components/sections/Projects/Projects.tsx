import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, GitBranch, ArrowRight } from 'lucide-react';
import type { Project } from '../../../types';

const statusConfig = {
  live:          { label: 'Live',         cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  building:      { label: 'Building',     cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'coming-soon': { label: 'Coming Soon',  cls: 'bg-blue-500/20  text-blue-400  border-blue-500/30'  },
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const status = project.status ? statusConfig[project.status] : null;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover:border-[#58a6ff] hover:shadow-[0_0_24px_rgba(88,166,255,0.12)]"
    >
      {/* 16:9 image */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img src={project.image} alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {status && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${status.cls}`}>
            {status.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-gray-500 text-xs leading-snug line-clamp-2 mb-2.5">{project.description}</p>

        {/* Tags (hidden on hover) */}
        <div className={`flex flex-wrap gap-1.5 transition-all duration-200 ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-px rounded-full bg-[#161b22] border border-[#30363d] text-gray-500">
              {tag}
            </span>
          ))}
        </div>

        {/* Hover buttons */}
        <div className={`absolute bottom-3.5 left-3.5 right-3.5 flex gap-2 transition-all duration-200
          ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium
                bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 transition-colors">
              <ExternalLink size={11} /> Live
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium
                bg-[#30363d]/60 border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors">
              <GitBranch size={11} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC<{ projects?: Project[] }> = ({ projects = [] }) => {
  const navigate = useNavigate();
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
        <button onClick={() => navigate('/projects')}
          className="flex items-center gap-1 text-xs text-[#58a6ff] hover:text-white transition-colors">
          See all <ArrowRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.slice(0, 4).map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
};
