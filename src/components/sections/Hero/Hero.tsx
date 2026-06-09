import React, { useState, useEffect } from 'react';
import { Code, ExternalLink, MapPin, Video, Mail, Briefcase, Download } from 'lucide-react';
import { Card } from '../../ui';

interface HeroProps {
  githubUsername: string;
  repoName: string;
}

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const glassBtn =
  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border backdrop-blur-md transition-all duration-200 cursor-pointer select-none';

const ctaButtons = [
  {
    label: 'Book a Call',
    icon: <Video size={15} />,
    href: 'https://calendly.com',
    cls: 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/25 hover:border-violet-400',
  },
  {
    label: 'Send Email',
    icon: <Mail size={15} />,
    href: 'mailto:hritik@example.com',
    cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/25 hover:border-sky-400',
  },
  {
    label: 'Hire Me',
    icon: <Briefcase size={15} />,
    href: 'mailto:hritik@example.com?subject=Hiring',
    cls: 'border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/25 hover:border-green-400',
  },
  {
    label: 'Resume',
    icon: <Download size={15} />,
    href: '/resume.pdf',
    cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400',
  },
];

export const Hero: React.FC<HeroProps> = ({ githubUsername }) => {
  const time = useClock();

  const pad = (n: number) => String(n).padStart(2, '0');
  const clockStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <main className="max-w-7xl mx-auto px-6 mt-12">
      <Card className="p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-12 items-start">

          {/* Left: User Info */}
          <div className="flex items-center gap-5 shrink-0">
            <img
              src={`https://github.com/${githubUsername}.png`}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-[#30363d] object-cover shadow-2xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Hritik Kumar</h1>
              <p className="text-gray-400 text-sm">@{githubUsername}</p>
              <div className="flex items-center gap-4 mt-3 text-gray-400">
                <Code size={18} className="hover:text-white cursor-pointer transition" />
                <ExternalLink size={18} className="hover:text-white cursor-pointer transition" />
                <div className="flex items-center gap-1 text-sm">
                  <MapPin size={16} />
                  <span>Azamgarh, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary + Clock + CTA Buttons */}
          <div className="flex-1 w-full flex flex-col gap-6">

            {/* Clock */}
            <div className="flex items-end gap-3">
              <span className="font-mono text-4xl font-bold text-white tracking-widest tabular-nums">
                {clockStr}
              </span>
              <span className="text-gray-500 text-sm mb-1 font-mono">{dateStr}</span>
            </div>

            {/* Professional Summary */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
              Full-stack developer focused on building fast, accessible, and visually refined web
              experiences. I work primarily with <span className="text-green-400 font-medium">React</span>,{' '}
              <span className="text-green-400 font-medium">TypeScript</span>, and{' '}
              <span className="text-green-400 font-medium">Node.js</span> — from pixel-perfect UIs to
              scalable APIs. Open to freelance projects, collaborations, and full-time roles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {ctaButtons.map((btn) => (
                <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                  className={`${glassBtn} ${btn.cls}`}>
                  {btn.icon}
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};
