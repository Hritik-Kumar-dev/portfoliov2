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
      className="group relative bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-[#58a6ff] hover:shadow-[0_0_24px_rgba(88,166,255,0.12)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 16:9 Image */}
      <div className="relative w-full aspect-video overflow-hidden">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Status badge */}
        {status && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${status.cls}`}>
            {status.label}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{project.description}</p>

        {/* Tags — re-assemble on hover */}
        <div className={`flex flex-wrap gap-1.5 mb-3 transition-all duration-300 ${hovered ? 'opacity-0 -translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#161b22] border border-[#30363d] text-gray-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons — appear on hover */}
        <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 transition-colors"
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-[#30363d]/60 border border-[#30363d] text-gray-300 hover:bg-[#30363d] transition-colors"
            >
              <GitBranch size={12} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC<ProjectsProps> = ({ projects = [], experiences = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex gap-10 items-start">
        {/* Left: Projects Grid */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-5">
            {projects.length > 0 ? (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <p className="text-gray-400">No projects to display yet.</p>
            )}
          </div>
        </div>

        {/* Right: Experience Timeline (bottom to top) */}
        <div className="w-72 shrink-0">
          <h2 className="text-3xl font-bold text-white mb-8">Experience</h2>
          <div className="flex flex-col-reverse relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[#30363d]" />
            {experiences.map((exp, i) => (
              <div key={exp.id} className="relative pl-6 pb-8 last:pb-0">
                <div
                  className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-green-500 ${
                    i === experiences.length - 1 ? 'bg-green-500' : 'bg-[#0d1117]'
                  }`}
                />
                <span className="text-xs text-gray-500 font-mono">{exp.period}</span>
                <p className="text-white font-semibold text-sm mt-0.5">{exp.role}</p>
                <p className="text-green-400 text-xs mb-1">{exp.company}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
