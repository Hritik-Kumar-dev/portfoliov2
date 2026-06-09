import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Clock, Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../../types';
import { formatDate } from '../../../utils';

interface BlogsProps { blogs?: BlogPost[]; }

const BlogCard: React.FC<{ blog: BlogPost; open: boolean; onToggle: () => void }> = ({ blog, open, onToggle }) => (
  <div
    onClick={onToggle}
    className={`cursor-pointer rounded-2xl border bg-surface/80 backdrop-blur-sm transition-all duration-300
      ${open
        ? 'border-accent shadow-[0_0_28px_rgba(255,255,255,0.06)]'
        : 'border-surface hover-border-accent hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]'
      }`}
  >
    {/* Header */}
    <div className="flex items-center gap-3 p-4 sm:p-5">
      {/* Date badge */}
      <div className="w-11 h-11 rounded-xl bg-tag border border-surface flex flex-col items-center justify-center shrink-0">
        <Calendar size={14} className="text-accent mb-0.5" />
        <span className="text-[9px] text-muted font-mono leading-none">
          {new Date(blog.date).getFullYear()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-title leading-tight truncate">{blog.title}</p>
        <p className="text-dim text-[11px] mt-0.5 truncate">{blog.excerpt}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
        <span className="text-[11px] text-muted">{formatDate(blog.date)}</span>
        {blog.readingTime && (
          <span className="flex items-center gap-1 text-[10px] text-dim">
            <Clock size={10} />{blog.readingTime} min
          </span>
        )}
      </div>

      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="ml-2 shrink-0 text-dim">
        <ChevronDown size={18} />
      </motion.div>
    </div>

    {/* Expanded */}
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-surface">
            <p className="text-bright text-sm leading-relaxed mt-3">{blog.excerpt}</p>
            <a
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-accent hover-text-title transition-colors"
            >
              <ExternalLink size={12} /> Read on Medium
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const Blogs: React.FC<BlogsProps> = ({ blogs = [] }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <section id="blogs" className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
      <h2 className="text-2xl font-bold text-title mb-5">Latest Blog Posts</h2>
      <div className="flex flex-col gap-2">
        {blogs.slice(0, 3).map((blog, i) => (
          <motion.div key={blog.id}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.3 }}>
            <BlogCard
              blog={blog}
              open={openId === blog.id}
              onToggle={() => setOpenId(openId === blog.id ? null : blog.id)}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={() => navigate('/blogs')}
          className="flex items-center gap-1.5 text-sm text-accent hover-text-title transition-colors border border-surface hover-border-accent px-4 py-1.5 rounded-full">
          See all posts <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};
