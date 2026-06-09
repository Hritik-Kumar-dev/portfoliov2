export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    id: '1',
    role: 'Frontend Developer',
    company: 'Freelance',
    period: '2024 – Present',
    description: 'Building modern web apps with React, TypeScript, and Tailwind CSS.',
  },
  {
    id: '2',
    role: 'Open Source Contributor',
    company: 'GitHub',
    period: '2023 – Present',
    description: 'Contributing to open-source projects and building personal tools.',
  },
  {
    id: '3',
    role: 'Web Developer Intern',
    company: 'Tech Startup',
    period: '2023',
    description: 'Developed responsive UIs and REST API integrations.',
  },
];
