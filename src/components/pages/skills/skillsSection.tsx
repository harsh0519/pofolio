'use client';

import { useState } from 'react';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillsData: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', level: 95, icon: '⚛️', color: 'linear-gradient(135deg, var(--accent-primary), var(--accent-soft))' },
      { name: 'Next.js', level: 90, icon: '▲', color: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))' },
      { name: 'TypeScript', level: 88, icon: 'TS', color: 'linear-gradient(135deg, var(--accent-primary), rgba(34,211,238,0.7))' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨', color: 'linear-gradient(135deg, var(--accent-soft), var(--accent-primary))' },
      { name: 'Vue.js', level: 85, icon: 'V', color: 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(16,185,129,0.85))' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 90, icon: '🟢', color: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(79,70,229,0.85))' },
      { name: 'Python', level: 85, icon: '🐍', color: 'linear-gradient(135deg, var(--accent-primary), var(--accent-highlight))' },
      { name: 'PostgreSQL', level: 82, icon: '🐘', color: 'linear-gradient(135deg, var(--accent-primary), rgba(59,130,246,0.9))' },
      { name: 'MongoDB', level: 88, icon: '🍃', color: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.85))' },
      { name: 'Redis', level: 80, icon: '⚡', color: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.85))' },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', level: 93, icon: '📦', color: 'linear-gradient(135deg, var(--accent-highlight), rgba(245,158,11,0.9))' },
      { name: 'Docker', level: 85, icon: '🐳', color: 'linear-gradient(135deg, rgba(59,130,246,0.9), var(--accent-primary))' },
      { name: 'AWS', level: 80, icon: '☁️', color: 'linear-gradient(135deg, var(--accent-highlight), rgba(245,158,11,0.8))' },
      { name: 'CI/CD', level: 82, icon: '🔄', color: 'linear-gradient(135deg, var(--accent-primary), var(--accent-soft))' },
      { name: 'Linux', level: 87, icon: '🐧', color: 'linear-gradient(135deg, rgba(250,204,21,0.9), rgba(245,158,11,0.85))' },
    ],
  },
  {
    category: 'Design & Other',
    skills: [
      { name: 'Figma', level: 88, icon: '🎨', color: 'linear-gradient(135deg, var(--accent-primary), var(--accent-soft))' },
      { name: 'UI/UX', level: 85, icon: '✨', color: 'linear-gradient(135deg, rgba(14,165,132,0.9), var(--accent-primary))' },
      { name: 'GraphQL', level: 83, icon: '◈', color: 'linear-gradient(135deg, rgba(236,72,153,0.9), rgba(244,63,94,0.85))' },
      { name: 'REST API', level: 90, icon: '🔌', color: 'linear-gradient(135deg, var(--accent-primary), rgba(59,130,246,0.9))' },
      { name: 'Testing', level: 86, icon: '🧪', color: 'linear-gradient(135deg, rgba(16,185,129,0.9), var(--accent-soft))' },
    ],
  },
];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="skills" className="relative py-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <p className="text-lg md:text-xl text-(--text-tertiary) max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillsData.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeCategory === index ? 'scale-105 glow-effect' : 'glass-effect hover:scale-105'
              }`}
              style={
                activeCategory === index
                  ? { background: 'var(--accent-primary)', color: 'var(--bg-primary)' }
                  : { border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
              }
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData[activeCategory].skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* All Skills Overview */}
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 gradient-text">
            Technology Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skillsData.flatMap(cat => cat.skills).map((skill, index) => (
              <div
                key={index}
                className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-(--text-secondary) transition-all duration-300 hover:scale-105"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <span className="mr-2">{skill.icon}</span>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group glass-effect rounded-xl p-6 transition-all duration-300 hover:scale-105 animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, opacity: 0, border: '1px solid var(--border-color)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg`} style={{ background: skill.color }}>
            {skill.icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-(--text-primary)">
              {skill.name}
            </h4>
            <p className="text-sm text-(--text-tertiary)">
              {skill.level}% Proficiency
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-(--bg-tertiary) rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out`}
          style={{
            width: isHovered ? `${skill.level}%` : '0%',
            background: skill.color,
          }}
        />
      </div>

      {/* Skill Level Indicator */}
      <div className="mt-4 flex gap-1">
        {[...Array(5)].map((_, i) => {
          const filled = i < Math.floor(skill.level / 20);
          return (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 bg-(--bg-tertiary)`}
              style={filled ? { background: skill.color } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
