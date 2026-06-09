import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, GitBranch, ArrowRight } from 'lucide-react';
import type { Project } from '../../../types';

const statusConfig = {
  live:          { label: 'Live',         cls: 'bg-accent-dim text-accent border-surface' },
  building:      { label: 'Building',     cls: 'bg-accent-dim text-accent border-surface' },
  'coming-soon': { label: 'Coming Soon',  cls: 'bg-accent-dim text-accent border-surface'  },
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
      className="group relative bg-surface border border-surface rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover-border-accent hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
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
        <h3 className="text-sm font-semibold text-title mb-1">{project.title}</h3>
        <p className="text-dim text-xs leading-snug line-clamp-2 mb-2.5">{project.description}</p>

        {/* Tags (hidden on hover) */}
        <div className={`flex flex-wrap gap-1.5 transition-all duration-200 ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-px rounded-full bg-tag border border-surface text-dim">
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
                bg-accent-dim border border-surface text-accent hover:bg-accent-dim transition-colors">
              <ExternalLink size={11} /> Live
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-bright)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
      <h2 className="text-2xl font-bold text-title mb-5">Featured Projects</h2>
      <div className="grid grid-cols-2 gap-3">
        {projects.slice(0, 4).map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-sm text-accent hover-text-title transition-colors border border-surface hover-border-accent px-4 py-1.5 rounded-full">
          See all projects <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};
