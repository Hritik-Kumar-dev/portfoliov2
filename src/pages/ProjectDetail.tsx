import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '../data';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains('light'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg2)', color: 'var(--text)' }}>
      <div className="text-center">
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Project not found.</p>
        <button onClick={() => navigate(-1)} className="text-sm transition-colors"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)'; }}>
          ← Go back
        </button>
      </div>
    </div>
  );

  const statusMap: Record<string, { label: string; dot: string }> = {
    live: { label: 'Live', dot: 'bg-green-400' },
    building: { label: 'Building', dot: 'bg-yellow-400' },
    'coming-soon': { label: 'Coming Soon', dot: 'bg-orange-400' },
  };
  const status = project.status ? statusMap[project.status] : null;

  const imgSrc = project.images
    ? (isLight ? project.images.light : project.images.dark)
    : project.image;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg2)', color: 'var(--text)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Hero media - video or image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4"
          style={{ border: '1px solid var(--border)' }}>
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
          )}
          {status && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span style={{ color: 'var(--text-bright)' }}>{status.label}</span>
            </div>
          )}
        </div>

        {/* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{project.title}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-bright)' }}>
                <GitBranch size={14} /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Extra details */}
        {project.details && (
          <div className="mb-4 rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>About</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-bright)' }}>{project.details}</p>
          </div>
        )}

        {/* Tech stack */}
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', color: 'var(--text-bright)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
