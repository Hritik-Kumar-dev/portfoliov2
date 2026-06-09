import React from 'react';
import Swal from 'sweetalert2';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/Hritik-Kumar-dev',     icon: <FaGithub size={18} /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hritik-kumar-dev', icon: <FaLinkedin size={18} /> },
  { label: 'Twitter',  href: 'https://twitter.com/hritik_dev',           icon: <BsTwitterX size={17} /> },
];

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  formData.append('access_key', '972197c3-dbcf-43c4-8af9-a59538aec7e4');
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  }).then(r => r.json());

  if (res.success) {
    Swal.fire({ title: 'Message Sent!', text: 'I\'ll get back to you shortly.', icon: 'success', background: '#0f1117', color: '#e6edf3', confirmButtonColor: '#58a6ff' });
    (e.target as HTMLFormElement).reset();
  } else {
    Swal.fire({ title: 'Error', text: 'Something went wrong. Try again.', icon: 'error', background: '#0f1117', color: '#e6edf3' });
  }
};

const inputCls = "bg-[#141920] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#58a6ff] transition-colors w-full";
const labelCls = "text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-1";

export const Contact: React.FC = () => (
  <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
    <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Get In Touch</h2>
    <p className="text-sm text-gray-500 mb-5">Have a project in mind or just want to say hi?</p>

    <div className="flex flex-col lg:flex-row gap-4">
      {/* Form */}
      <div className="flex-1 bg-[#0f1117] border border-[#21262d] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Mail size={16} className="text-[#58a6ff]" />
          <span className="text-xs font-medium text-gray-400 tracking-wide">Send me a message</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Name</label>
            <input required name="name" type="text" placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input required name="email" type="email" placeholder="your@email.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Message</label>
            <textarea required name="message" rows={4} placeholder="Your message..." className={`${inputCls} resize-none`} />
          </div>
          <button type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/25 hover:border-[#58a6ff] transition-all duration-200">
            Send Message
          </button>
        </form>
      </div>

      {/* Sidebar */}
      <div className="lg:w-52 bg-[#0f1117] border border-[#21262d] rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Find me on</p>
          <div className="flex flex-col gap-2">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#141920] border border-[#21262d] text-gray-300 text-sm font-medium hover:border-[#58a6ff]/40 hover:text-white transition-all">
                <span className="text-[#58a6ff]">{s.icon}</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[#21262d] pt-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Or schedule a call</p>
          <button
            data-cal-namespace="30min"
            data-cal-link="hritik-kumar-dev77/30min"
            data-cal-config='{"layout":"month_view","theme":"auto"}'
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/20 hover:border-violet-400 transition-all"
          >
            Book a Call
          </button>
        </div>
      </div>
    </div>
  </section>
);
