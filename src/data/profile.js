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
    // TODO: the paid instant-contact target (payment/booking link). While it is
    // null the "Instant Contact ₹10" buttons stay visible but inert everywhere.
    instantContact: null,
  },
  // Powers the compact form behind the sidebar's "Contact" button.
  //   to         where messages are addressed
  //   emailjs    fills in the three ids from https://dashboard.emailjs.com and
  //              the form sends through EmailJS — no backend, and nothing secret
  //              in the bundle, because the public key only works for the
  //              service it belongs to.
  //   endpoint   full URL of any other browser-safe form endpoint, instead of
  //              EmailJS — e.g. https://formspree.io/f/<form-id>, or
  //              https://api.web3forms.com/submit/<access-key> (Web3Forms takes
  //              its key in the path, so a single URL is the whole setup).
  //
  // A transactional email API key (Resend, SendGrid, …) is NOT public, so those
  // still need a backend to keep the secret off the client.
  //
  // While EmailJS is incomplete and endpoint is null, the form hands the message
  // to the visitor's mail app.
  //   scheduleUrl shows the "Schedule a call" action; null renders it inert
  //   instant     the paid fast lane, given top billing in the dialog.
  //               `url` is where the button points; null renders it inert.
  //   cal         optional Cal.com element-click embed: when set, the button
  //               opens the booking popup in place instead of navigating to
  //               scheduleUrl (which then becomes the no-JS fallback href)
  contact: {
    to: EMAIL,
    emailjs: {
      // Safe to commit: a public key can only post through your own service.
      publicKey: 'VWkyLE9wVjLKdCL29',
      // TODO: the two ids left to fill in, both on the EmailJS dashboard.
      //   serviceId   Email Services -> your service        'service_xxxxxxx'
      //   templateId  Email Templates -> your template      'template_xxxxxxx'
      serviceId: null,
      templateId: null,
    },
    endpoint: null,
    scheduleUrl: 'https://cal.com/hritik-kumar-hifi0r/15min',
    instant: {
      url: null,
      price: '₹10',
    },
    cal: {
      link: 'hritik-kumar-hifi0r/15min',
      namespace: '15min',
    },
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
