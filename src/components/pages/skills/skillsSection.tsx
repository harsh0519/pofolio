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
      { name: 'React', level: 95, icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
      { name: 'Next.js', level: 90, icon: '▲', color: 'from-gray-700 to-gray-900' },
      { name: 'TypeScript', level: 88, icon: 'TS', color: 'from-blue-600 to-blue-700' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨', color: 'from-cyan-400 to-teal-500' },
      { name: 'Vue.js', level: 85, icon: 'V', color: 'from-green-500 to-emerald-600' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 90, icon: '🟢', color: 'from-green-600 to-green-700' },
      { name: 'Python', level: 85, icon: '🐍', color: 'from-blue-500 to-yellow-400' },
      { name: 'PostgreSQL', level: 82, icon: '🐘', color: 'from-blue-600 to-indigo-700' },
      { name: 'MongoDB', level: 88, icon: '🍃', color: 'from-green-500 to-green-600' },
      { name: 'Redis', level: 80, icon: '⚡', color: 'from-red-500 to-red-600' },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', level: 93, icon: '📦', color: 'from-orange-500 to-red-500' },
      { name: 'Docker', level: 85, icon: '🐳', color: 'from-blue-500 to-cyan-500' },
      { name: 'AWS', level: 80, icon: '☁️', color: 'from-orange-400 to-yellow-500' },
      { name: 'CI/CD', level: 82, icon: '🔄', color: 'from-purple-500 to-pink-500' },
      { name: 'Linux', level: 87, icon: '🐧', color: 'from-yellow-400 to-orange-500' },
    ],
  },
  {
    category: 'Design & Other',
    skills: [
      { name: 'Figma', level: 88, icon: '🎨', color: 'from-purple-500 to-pink-500' },
      { name: 'UI/UX', level: 85, icon: '✨', color: 'from-indigo-500 to-purple-500' },
      { name: 'GraphQL', level: 83, icon: '◈', color: 'from-pink-500 to-rose-500' },
      { name: 'REST API', level: 90, icon: '🔌', color: 'from-blue-500 to-indigo-500' },
      { name: 'Testing', level: 86, icon: '🧪', color: 'from-green-500 to-teal-500' },
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
          <p className="text-lg md:text-xl text-[var(--text-tertiary)] max-w-2xl mx-auto">
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
                activeCategory === index
                  ? 'bg-white text-black scale-105 glow-effect'
                  : 'glass-effect text-[var(--text-secondary)] hover:scale-105 hover:border-[var(--accent-primary)]'
              }`}
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
                className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-300 hover:scale-105"
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
      className="group glass-effect rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
            {skill.icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">
              {skill.name}
            </h4>
            <p className="text-sm text-[var(--text-tertiary)]">
              {skill.level}% Proficiency
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
          style={{
            width: isHovered ? `${skill.level}%` : '0%',
          }}
        />
      </div>

      {/* Skill Level Indicator */}
      <div className="mt-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < Math.floor(skill.level / 20)
                ? `bg-gradient-to-r ${skill.color}`
                : 'bg-[var(--bg-tertiary)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
