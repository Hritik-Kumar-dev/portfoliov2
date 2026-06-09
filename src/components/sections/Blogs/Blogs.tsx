import React from 'react';
import type { BlogPost } from '../../../types';
import { Card } from '../../ui';
import { formatDate } from '../../../utils';

interface BlogsProps {
  blogs?: BlogPost[];
}

export const Blogs: React.FC<BlogsProps> = ({ blogs = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white mb-8">Latest Blog Posts</h2>

      <div className="space-y-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <a
              key={blog.id}
              href={blog.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card hover className="hover:bg-[#161b22]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{blog.excerpt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(blog.date)}</span>
                  {blog.readingTime && <span>{blog.readingTime} min read</span>}
                </div>
              </Card>
            </a>
          ))
        ) : (
          <p className="text-gray-400">No blog posts to display yet.</p>
        )}
      </div>
    </section>
  );
};
