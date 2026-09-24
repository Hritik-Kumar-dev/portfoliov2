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
    // Derived from the GitHub username the contribution graph already uses.
    github: 'https://github.com/Hritik-Kumar-dev',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/',
    email: `mailto:${EMAIL}`,
    resume: '/resume.pdf',
    // TODO: the paid instant-contact target (payment/booking link). While it is
    // null the "Instant Contact ₹10" buttons stay visible but inert everywhere.
    instantContact: null,
  },
  // Powers the compact form behind the sidebar's "Contact" button, plus the
  // "Schedule a call" and instant-contact actions.
  //
  // A sender is picked from the three below in this order — the first one that is
  // set wins. All of them are browser-safe: the credential each one uses is
  // public by design and can only post to the inbox it was issued for.
  //
  //   endpoint      any other browser-safe form endpoint, e.g.
  //                 https://formspree.io/f/<form-id>, or
  //                 https://api.web3forms.com/submit/<access-key>
  //   web3formsKey  an access key from https://web3forms.com (active below)
  //   emailjs       three ids from https://dashboard.emailjs.com
  //
  // A transactional email API key (Resend, SendGrid, …) is NOT public, so those
  // would need a backend to keep the secret off the client.
  //
  // With all three empty the form hands the message to the visitor's mail app.
  //
  //   to          where the mail-app fallback addresses its message
  //   scheduleUrl shows the "Schedule a call" action; null renders it inert
  //   instant     the paid fast lane, given top billing in the dialog.
  //               `url` is where the button points; null renders it inert.
  //   cal         optional Cal.com element-click embed: when set, the button
  //               opens the booking popup in place instead of navigating to
  //               scheduleUrl (which then becomes the no-JS fallback href)
  contact: {
    to: EMAIL,
    endpoint: null,
    // The active sender. Safe to commit: the key can only post to the inbox it
    // was issued for, and Web3Forms tell you to treat it as public.
    web3formsKey: 'a8a6bdf9-059c-4a8b-bcbe-1afcd399c7a2',
    emailjs: {
      // Inactive until both ids below are filled in — EmailJS cannot send with a
      // public key alone. Also safe to commit.
      publicKey: 'VWkyLE9wVjLKdCL29',
      // TODO: both live on the EmailJS dashboard.
      //   serviceId   Email Services -> your service       'service_xxxxxxx'
      //   templateId  Email Templates -> your template     'template_xxxxxxx'
      serviceId: null,
      templateId: null,
    },
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
