import React from 'react';

// Map skill names to devicons CDN slugs
const ICON: Record<string, string> = {
  'React':       'react',
  'TypeScript':  'typescript',
  'JavaScript':  'javascript',
  'HTML':        'html5',
  'CSS':         'css3',
  'Tailwind CSS':'tailwindcss',
  'Node.js':     'nodejs',
  'Express':     'express',
  'MongoDB':     'mongodb',
  'PostgreSQL':  'postgresql',
  'Git':         'git',
  'VSCode':      'vscode',
  'Vite':        'vitejs',
  'Docker':      'docker',
  'Vercel':      'vercel',
  'Next.js':     'nextjs',
  'AWS':         'amazonwebservices',
  'Figma':       'figma',
};

const iconUrl = (name: string) => {
  const slug = ICON[name];
  if (!slug) return null;
  // plain SVG variant (works for most; colored for brand icons)
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
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
              const url = iconUrl(skill);
              return (
                <div key={skill}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-tag border border-surface text-bright text-xs hover:border-[#58a6ff]/40 transition-colors">
                  {url
                    ? <img src={url} alt={skill} className="w-3.5 h-3.5 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    : <span className="w-3.5 h-3.5 rounded-full bg-gray-600 inline-block" />
                  }
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
