import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <div
      className={`bg-[#0f1117] border border-[#21262d] rounded-xl p-6 ${
        hover ? 'hover:border-[#58a6ff] transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
