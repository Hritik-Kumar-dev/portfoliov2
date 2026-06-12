import React, { useState, useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { MapPin, Video, Mail, Briefcase, Download } from 'lucide-react';
import { FiGithub} from 'react-icons/fi';
import { Card } from '../../ui';
import { BsTwitterX } from 'react-icons/bs';
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

const ctaButtons = [
  {
    label: 'Book a Call',
    icon: <Video size={15} />,
    href: null as string | null,
    cal: true,
    cls: 'border-surface bg-accent-dim text-accent hover:bg-accent-dim',
  },
  {
    label: 'Send Email',
    icon: <Mail size={15} />,
    href: '#contact',
    cal: false,
    cls: 'border-surface bg-accent-dim text-accent hover:bg-accent-dim',
  },
  {
    label: 'Hire Me',
    icon: <Briefcase size={15} />,
    href: '#contact',
    cal: false,
    cls: 'border-surface bg-accent-dim text-accent hover:bg-accent-dim',
  },
  {
    label: 'Resume',
    icon: <Download size={15} />,
    href: '/resume.pdf',
    cal: false,
    cls: 'border-surface bg-accent-dim text-accent hover:bg-accent-dim',
  },
];

export const Hero: React.FC<HeroProps> = ({ githubUsername }) => {
  const time = useClock();

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const clockStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
      <Card className="p-4 sm:p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 items-start">

          {/* Left: User Info */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={`https://github.com/${githubUsername}.png`}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-surface object-cover shadow-2xl"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-title">Hritik Kumar</h1>
              <p className="text-muted text-xs sm:text-sm">@{githubUsername}</p>
              <div className="flex items-center gap-2 mt-2 text-muted">
                <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer"
                  className="hover-text-title transition-colors">
                  <FiGithub size={16} />
                </a>
                <a href={`https://twitter.com/${githubUsername}`} target="_blank" rel="noopener noreferrer"
                  className="hover-text-title transition-colors">
                  <BsTwitterX size={16} />
                </a>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <MapPin size={14} />
                  <span>Azamgarh, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary + Clock + CTA */}
          <div className="flex-1 w-full flex flex-col gap-3">
            {/* Clock */}
            <div className="flex items-end gap-2 flex-wrap">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-title tracking-widest tabular-nums">
                {clockStr}
              </span>
              <span className="text-dim text-xs sm:text-sm mb-0.5 font-mono">{dateStr}</span>
            </div>

            {/* Summary */}
            <p className="text-bright text-xs sm:text-sm leading-relaxed">
              Full-stack developer building fast, accessible web experiences with{' '}
              <span className="text-accent font-medium">React</span>,{' '}
               <span className="text-accent font-medium">TypeScript</span>, and{' '}
               <span className="text-accent font-medium">Node.js</span>.
              Open to freelance, collabs, and full-time roles.
            </p>

            <div className="flex flex-wrap gap-2">
              {ctaButtons.map((btn) => {
                const cls = `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all duration-200 ${btn.cls}`;
                if (btn.cal) return (
                  <button key={btn.label} data-cal-namespace="30min" data-cal-link="hritik-kumar-dev77/30min"
                    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}' className={cls}>
                    {btn.icon}{btn.label}
                  </button>
                );
                if (btn.href?.startsWith('#')) return (
                  <button key={btn.label} onClick={() => document.querySelector(btn.href!)?.scrollIntoView({ behavior: 'smooth' })} className={cls}>
                    {btn.icon}{btn.label}
                  </button>
                );
                return (
                  <a key={btn.label} href={btn.href!} target="_blank" rel="noopener noreferrer" className={cls}>
                    {btn.icon}{btn.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};
