'use client';

import { useState } from 'react';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github?: string;
  demo?: string;
  featured: boolean;
}

const projectsData: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard.',
    image: '🛒',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Web App',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    title: 'AI Task Manager',
    description: 'Intelligent task management app with AI-powered priority suggestions and productivity analytics.',
    image: '🤖',
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'PostgreSQL'],
    category: 'Web App',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media managers with real-time metrics and automated reporting.',
    image: '📊',
    tags: ['React', 'D3.js', 'Node.js', 'Redis'],
    category: 'Dashboard',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    title: 'Mobile Fitness App',
    description: 'Cross-platform fitness tracking app with workout plans, nutrition tracking, and progress analytics.',
    image: '💪',
    tags: ['React Native', 'Firebase', 'Redux'],
    category: 'Mobile',
    github: 'https://github.com',
    featured: false,
  },
  {
    title: 'Video Streaming Platform',
    description: 'Netflix-like streaming platform with adaptive bitrate, user profiles, and recommendation engine.',
    image: '🎬',
    tags: ['Vue.js', 'AWS', 'Node.js', 'FFmpeg'],
    category: 'Web App',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: false,
  },
  {
    title: 'Real Estate Portal',
    description: 'Property listing platform with advanced search, virtual tours, and mortgage calculator.',
    image: '🏠',
    tags: ['Next.js', 'GraphQL', 'Prisma', 'Mapbox'],
    category: 'Web App',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: false,
  },
  {
    title: 'Design System Library',
    description: 'Comprehensive UI component library with documentation, theming, and accessibility features.',
    image: '🎨',
    tags: ['React', 'Storybook', 'TypeScript', 'CSS'],
    category: 'Library',
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: false,
  },
  {
    title: 'DevOps Pipeline',
    description: 'Automated CI/CD pipeline with containerization, testing, and deployment orchestration.',
    image: '⚙️',
    tags: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
    category: 'DevOps',
    github: 'https://github.com',
    featured: false,
  },
];

const categories = ['All', 'Web App', 'Mobile', 'Dashboard', 'Library', 'DevOps'];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects =
    activeFilter === 'All'
      ? projectsData
      : projectsData.filter((project) => project.category === activeFilter);

  return (
    <section id="projects" className="relative py-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06), transparent)', opacity: 0.5 }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04), transparent)', opacity: 0.45 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-(--text-tertiary) max-w-2xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category ? 'scale-105 glow-effect' : 'glass-effect hover:scale-105'
              }`}
              style={
                activeFilter === category
                  ? { background: 'var(--accent-primary)', color: 'var(--bg-primary)' }
                  : { border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              isHovered={hoveredProject === index}
              onHover={() => setHoveredProject(index)}
              onLeave={() => setHoveredProject(null)}
            />
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-16">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 glass-effect rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <span>View All Projects</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`group relative glass-effect rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in-up ${
        project.featured ? 'lg:col-span-1' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0, border: '1px solid var(--border-color)' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-highlight)', color: 'var(--bg-primary)' }}>
          Featured
        </div>
      )}

      {/* Project Image/Icon */}
      <div className="relative h-48 flex items-center justify-center text-6xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
        {project.image}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(180deg, var(--bg-secondary), transparent)' }}
        />
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-(--text-primary) group-hover:gradient-text transition-all">
          {project.title}
        </h3>
        <p className="text-sm text-(--text-tertiary) mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-(--bg-tertiary) text-(--text-secondary) rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass-effect rounded-lg text-sm font-medium text-(--text-secondary) transition-all"
              style={{ border: '1px solid var(--border-color)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all"
              style={{ background: 'var(--accent-highlight)', color: 'var(--bg-primary)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
