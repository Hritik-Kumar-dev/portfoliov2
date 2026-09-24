import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { projects } from '../data';
import type { Project } from '../types';

const statusConfig: Record<string, { label: string; dot: string }> = {
  live:          { label: 'Live',         dot: 'bg-green-400' },
  building:      { label: 'Building',     dot: 'bg-yellow-400' },
  'coming-soon': { label: 'Coming Soon',  dot: 'bg-orange-400' },
};

const Card: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();
  const status = project.status ? statusConfig[project.status] : null;
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains('light'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const imgSrc = project.images
    ? (isLight ? project.images.light : project.images.dark)
    : project.image;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group relative w-full rounded-md border p-5 text-title transition-all duration-500 cursor-pointer border-[var(--border)] hover:border-[var(--border-h)]"
      style={{
        background: 'var(--card)',
      }}
    >
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {status && (
            <>
              <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
              <span className="text-sm font-medium text-muted">{status.label}</span>
            </>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); project.live && window.open(project.live, '_blank'); }}
          className="text-xl text-muted transition hover:scale-110 hover:text-title"
        >
          <FiExternalLink />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-title">
          {project.title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          {project.description}
        </p>
      </div>

      {/* Preview Image */}
      <div className="mt-6 overflow-hidden rounded-md border border-[var(--border)] transition-colors duration-500 group-hover:border-[var(--border-h)]">
        <div className="aspect-video">
          <img src={imgSrc} alt={project.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110" />
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px" style={{ background: 'var(--border)' }} />

      {/* Default State - Tags */}
      <div className="flex flex-wrap gap-2 transition-all duration-300 group-hover:opacity-0">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[11px] px-2.5 py-1 rounded-sm border transition-colors duration-300 group-hover:opacity-0"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover Buttons */}
      <div className="absolute bottom-5 left-5 right-5 flex gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold transition-colors text-title hover:bg-white/10"
            style={{ borderColor: 'var(--border-h)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <FiExternalLink /> Live Demo
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold text-title transition-colors hover:bg-white/10"
            style={{ borderColor: 'var(--border-h)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <FiGithub /> GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export const AllProjects: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg2)', color: 'var(--text)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-4" style={{ color: 'var(--text)' }}>All Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map(p => <Card key={p.id} project={p} />)}
        </div>
      </div>
    </div>
  );
};
