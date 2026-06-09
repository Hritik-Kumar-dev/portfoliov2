import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '../data';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Project not found.</p>
        <button onClick={() => navigate(-1)} className="text-[#58a6ff] hover:text-white text-sm">← Go back</button>
      </div>
    </div>
  );

  const statusMap = { live: { label: 'Live', cls: 'bg-green-500/20 text-green-400 border-green-500/30' }, building: { label: 'Building', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }, 'coming-soon': { label: 'Coming Soon', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' } };
  const status = project.status ? statusMap[project.status] : null;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Hero image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-[#21262d]">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          {status && <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${status.cls}`}>{status.label}</span>}
        </div>

        {/* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 transition-colors">
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#30363d]/60 border border-[#21262d] text-gray-300 hover:bg-[#30363d] transition-colors">
                <GitBranch size={14} /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-[#0f1117] border border-[#21262d] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#141920] border border-[#21262d] text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
