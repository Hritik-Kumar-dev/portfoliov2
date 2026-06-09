import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data';
import { formatDate } from '../utils';

export const AllBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-8">All Blog Posts</h1>
        <div className="flex flex-col gap-3">
          {blogPosts.map(blog => {
            const open = openId === blog.id;
            return (
              <div key={blog.id} onClick={() => setOpenId(open ? null : blog.id)}
                className={`cursor-pointer rounded-2xl border bg-[#0d1117]/80 transition-all duration-300
                  ${open ? 'border-[#58a6ff]/40 shadow-[0_0_28px_rgba(88,166,255,0.08)]' : 'border-[#30363d] hover:border-[#58a6ff]/30'}`}>
                <div className="flex items-center gap-4 p-5">
                  <div className="w-11 h-11 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col items-center justify-center shrink-0">
                    <Calendar size={14} className="text-[#58a6ff] mb-0.5" />
                    <span className="text-[9px] text-gray-400 font-mono">{new Date(blog.date).getFullYear()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{blog.title}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5 truncate">{blog.excerpt}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-gray-400">{formatDate(blog.date)}</span>
                    {blog.readingTime && <span className="flex items-center gap-1 text-[10px] text-gray-500"><Clock size={10} />{blog.readingTime} min</span>}
                  </div>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="ml-2 shrink-0 text-gray-500">
                    <ChevronDown size={18} />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 border-t border-[#30363d]">
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">{blog.excerpt}</p>
                        <a href={blog.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#58a6ff] hover:text-white transition-colors">
                          <ExternalLink size={12} /> Read on Medium
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
