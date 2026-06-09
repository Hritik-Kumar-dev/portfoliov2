import React, { useState } from 'react';
import { ExternalLink, GitBranch } from 'lucide-react';
import type { Project } from '../../../types';
import type { Experience } from '../../../data/experience';

interface ProjectsProps {
  projects?: Project[];
  experiences?: Experience[];
}

const statusConfig = {
  live: { label: 'Live', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  building: { label: 'Building', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'coming-soon': { label: 'Coming Soon', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const status = project.status ? statusConfig[project.status] : null;

  return (
    <div
      className="group relative bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#58a6ff] hover:shadow-[0_0_20px_rgba(88,166,255,0.1)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 16:9 image */}
      <div className="relative w-full aspect-video overflow-hidden">
        {project.image && (
          <img src={project.image} alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        {status && (
          <span className={`absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${status.cls}`}>
            {status.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5">
        <h3 className="text-xs font-semibold text-white leading-tight mb-0.5">{project.title}</h3>
        <p className="text-gray-500 text-[10px] leading-snug line-clamp-2 mb-1.5">{project.description}</p>

        {/* Tags */}
        <div className={`flex flex-wrap gap-1 transition-all duration-200 ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-px rounded-full bg-[#161b22] border border-[#30363d] text-gray-500">
              {tag}
            </span>
          ))}
        </div>

        {/* Hover buttons */}
        <div className={`absolute bottom-2.5 left-2.5 right-2.5 flex gap-1.5 transition-all duration-200 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 transition-colors">
              <ExternalLink size={10} /> Live
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium bg-[#30363d]/60 border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors">
              <GitBranch size={10} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC<ProjectsProps> = ({ projects = [], experiences = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Projects */}
        <div className="w-full lg:w-[55%]">
          <h2 className="text-2xl font-bold text-white mb-5">Featured Projects</h2>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>

        {/* Experience */}
        <div className="w-full lg:flex-1">
          <h2 className="text-2xl font-bold text-white mb-5">Experience</h2>
          <div className="flex flex-col-reverse relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[#30363d]" />
            {experiences.map((exp, i) => (
              <div key={exp.id} className="relative pl-6 pb-7 last:pb-0">
                <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-green-500 ${i === experiences.length - 1 ? 'bg-green-500' : 'bg-[#0d1117]'}`} />
                <span className="text-xs text-gray-500 font-mono">{exp.period}</span>
                <p className="text-white font-semibold text-base mt-0.5">{exp.role}</p>
                <p className="text-green-400 text-sm mb-1">{exp.company}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
