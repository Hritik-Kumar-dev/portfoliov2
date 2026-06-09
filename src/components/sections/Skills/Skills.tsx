import React from 'react';
import type { Skill } from '../../../types';
import { Badge } from '../../ui';

interface SkillsProps {
  skills?: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white mb-8">Skills & Tech Stack</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.length > 0 ? (
          skills.map((skillGroup) => (
            <div key={skillGroup.category}>
              <h3 className="text-lg font-semibold text-white mb-4">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <Badge key={skill} variant="success">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No skills to display yet.</p>
        )}
      </div>
    </section>
  );
};
