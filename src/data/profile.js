import photo from '../assets/img/profile.webp'

// TODO: replace with your real inbox — used by the links and the contact form.
const EMAIL = 'hello@example.com'

export const profile = {
  name: 'Hritik Kumar',
  photo,
  // Feeds the live contribution graph (see components/GithubHeatmap.jsx).
  githubUsername: 'Hritik-Kumar-dev',
  // TODO: replace with your real links. Put resume.pdf in /public.
  links: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/',
    email: `mailto:${EMAIL}`,
    resume: '/resume.pdf',
  },
  // Powers the compact form behind the sidebar's "Contact" button.
  //   to          where messages are addressed
  //   endpoint    optional; null opens the visitor's mail app instead (no keys,
  //               no backend). Point it at a form endpoint that accepts browser
  //               submissions (Formspree, Web3Forms, …) to POST instead — those
  //               use a public form id, so no secret is exposed in the bundle.
  //   scheduleUrl shows the "Schedule a call" action; null renders it inert
  contact: {
    to: EMAIL,
    endpoint: null,
    scheduleUrl: null,
  },
  bio: [
    'I’m a passionate developer who loves coding, problem-solving, and building things with unique ideas. I work with modern web technologies and explore Web3, AI/ML, and full-stack development, always looking to learn, experiment, and turn ideas into real-world solutions.',
    'Open to freelance, collabs, and full-time roles.',
  ],
  experience: {
    label: '2+ years Experience Includes:',
    certificateUrl: '#', // TODO: link to the IBM certificate
  },
}
