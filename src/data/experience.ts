export interface Experience {
  id: string;
  company: string;
  logo?: string;
  image?: string;
  employmentType: string;
  role: string;
  duration: string;
  location: string;
  achievements: string[];
  technologies: string[];
  // legacy fields kept for the timeline in Projects
  period?: string;
  description?: string;
}

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Freelance',
    employmentType: 'Self-employed',
    role: 'Full-Stack Engineer',
    duration: 'Mar 2024 – Present',
    location: 'India · Remote',
    period: '2024 – Present',
    description: 'Building modern web apps with React, TypeScript, and Tailwind CSS.',
    // image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    achievements: [
      'Delivered 5+ production web apps for international clients using React & Node.js.',
      'Reduced client load times by 40% through code splitting and lazy loading.',
      'Integrated OpenAI APIs to build AI-powered SaaS features.',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS'],
  },
  {
    id: '2',
    company: 'Open Source',
    employmentType: 'Contributor',
    role: 'Open Source Developer',
    duration: '2023 – Present',
    location: 'Remote · Global',
    period: '2023 – Present',
    description: 'Contributing to open-source projects and building personal tools.',
    // image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',
    achievements: [
      'Contributed bug fixes and features to popular React component libraries.',
      'Maintained personal CLI tools with 200+ GitHub stars.',
      'Reviewed PRs and mentored junior contributors in community projects.',
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Git', 'Node.js'],
  },
  {
    id: '3',
    company: 'Tech Startup',
    employmentType: 'Internship',
    role: 'Web Developer Intern',
    duration: 'Jun 2023 – Nov 2023',
    location: 'Lucknow, India',
    period: '2023',
    description: 'Developed responsive UIs and REST API integrations.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    achievements: [
      'Built and shipped 3 responsive dashboards used by 1,000+ users.',
      'Integrated REST APIs and handled state with React Query.',
      'Improved team workflow by introducing ESLint and Prettier configs.',
    ],
    technologies: ['React', 'JavaScript', 'REST APIs', 'CSS', 'Figma'],
  },
];
