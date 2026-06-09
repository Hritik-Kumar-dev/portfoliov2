import React, { useState, useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      <Card className="p-5 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">

          {/* Left: User Info */}
          <div className="flex items-center gap-4 shrink-0">
            <img
              src={`https://github.com/${githubUsername}.png`}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#30363d] object-cover shadow-2xl"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Hritik Kumar</h1>
              <p className="text-gray-400 text-xs sm:text-sm">@{githubUsername}</p>
              <div className="flex items-center gap-3 mt-2 text-gray-400">
                <Code size={16} className="hover:text-white cursor-pointer transition" />
                <ExternalLink size={16} className="hover:text-white cursor-pointer transition" />
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <MapPin size={14} />
                  <span>Azamgarh, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary + Clock + CTA */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {/* Clock */}
            <div className="flex items-end gap-2 flex-wrap">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-white tracking-widest tabular-nums">
                {clockStr}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm mb-0.5 font-mono">{dateStr}</span>
            </div>

            {/* Summary */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Full-stack developer building fast, accessible web experiences with{' '}
              <span className="text-green-400 font-medium">React</span>,{' '}
              <span className="text-green-400 font-medium">TypeScript</span>, and{' '}
              <span className="text-green-400 font-medium">Node.js</span>.
              Open to freelance, collabs, and full-time roles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2">
              {ctaButtons.map((btn) =>
                btn.label === 'Book a Call' ? (
                  <button
                    key="Book a Call"
                    data-cal-namespace="30min"
                    data-cal-link="hritik-kumar-dev77/30min"
                    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all duration-200 ${btn.cls}`}
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ) : (
                  <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all duration-200 ${btn.cls}`}>
                    {btn.icon}
                    {btn.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};
