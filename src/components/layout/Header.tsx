import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  githubUsername: string;
}

export const Header: React.FC<HeaderProps> = ({ githubUsername }) => {
  return (
    <header className="border-b border-[#30363d] bg-[#050505]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-white">algora</div>

        <div className="flex items-center gap-3 bg-[#161b22] p-1 pr-3 rounded-full border border-[#30363d] cursor-pointer hover:border-[#58a6ff] transition-colors">
          <img
            src={`https://github.com/${githubUsername}.png`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-white">Your Name</span>
            <span className="text-[10px] text-gray-400">@{githubUsername}</span>
          </div>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </nav>
    </header>
  );
};
