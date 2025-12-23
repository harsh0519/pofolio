'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { client, projectsQuery } from '@/lib/sanity/queries';
import { Project } from '../../types/project';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = ['All', 'Frontend & Animation', 'Full Stack', 'Company'] as const;
type Category = typeof categories[number];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await client.fetch<Project[]>(projectsQuery);
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) =>
          p.categories?.includes(activeCategory as 'Frontend & Animation' | 'Full Stack' | 'Company')
        )
      );
    }
  }, [activeCategory, projects]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.projects-hero', {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power4.out',
      });

      // Project cards animation
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 100,
          scale: 0.8,
          duration: 1,
          delay: i * 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, projectsRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      transformPerspective: 1000,
      ease: 'power2.out',
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <main ref={projectsRef} className="pt-20 bg-linear-to-b from-[#0A0A0F] via-[#13131A] to-[#1C1C24] min-h-screen">
      {/* Hero Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="projects-hero text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              My <span className="text-white">Work</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400">
              A collection of projects showcasing creativity, technical excellence, and
              attention to detail
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-white text-black scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">No projects found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="project-card group relative"
                  onMouseMove={handleCardHover}
                  onMouseLeave={handleCardLeave}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl overflow-hidden hover:border-white/50 transition-all">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden bg-linear-to-br from-white/10 to-white/0">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/10">
                          {project.order}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex gap-2">
                          {project.link && (
                            <a
                              href={project.link}
                              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiExternalLink size={18} />
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiGithub size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-400 mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {(project.tech ?? []).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Have a Project <span className="text-white">in Mind?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Let's collaborate and bring your ideas to life with cutting-edge technology
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Start a Conversation
          </a>
        </div>
      </section>
    </main>
  );
}
