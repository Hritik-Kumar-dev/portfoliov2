import React from 'react';
import {
  SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss,
  SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiGit, SiVite, SiDocker, SiVercel, SiNextdotjs, SiFigma,
} from 'react-icons/si';
import { TbBrandVscode } from 'react-icons/tb';
import { FaAws } from 'react-icons/fa';

const ICON: Record<string, React.ReactNode> = {
  'React':       <SiReact />,
  'TypeScript':  <SiTypescript />,
  'JavaScript':  <SiJavascript />,
  'HTML':        <SiHtml5 />,
  'CSS':         <SiCss />,
  'Tailwind CSS':<SiTailwindcss />,
  'Node.js':     <SiNodedotjs />,
  'Express':     <SiExpress />,
  'MongoDB':     <SiMongodb />,
  'PostgreSQL':  <SiPostgresql />,
  'Git':         <SiGit />,
  'VSCode':      <TbBrandVscode />,
  'Vite':        <SiVite />,
  'Docker':      <SiDocker />,
  'Vercel':      <SiVercel />,
  'Next.js':     <SiNextdotjs />,
  'AWS':         <FaAws />,
  'Figma':       <SiFigma />,
};

interface Skill { category: string; items: string[]; }
interface SkillsProps { skills?: Skill[]; }

export const Skills: React.FC<SkillsProps> = ({ skills = [] }) => (
  <section id="skills" className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
    <h2 className="text-2xl font-bold text-title mb-5">Skills &amp; Tech Stack</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {skills.map((group) => (
        <div key={group.category} className="bg-surface border border-surface rounded-xl p-4">
          <h3 className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">{group.category}</h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((skill) => {
              const icon = ICON[skill];
              return (
                <div key={skill}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-tag border border-surface text-bright text-xs hover-border-accent transition-colors">
                  {icon ? (
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-current shrink-0">
                      {icon}
                    </span>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-600 inline-block" />
                  )}
                  {skill}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </section>
);
