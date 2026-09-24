import React from 'react';
import { Code } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  className = '',
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-2">
        <Code size={12} className="text-dim shrink-0" />
        {eyebrow}
      </p>
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-title">{title}</h2>
    </div>
  );
};