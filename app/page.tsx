'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { revealElements, createParallax, splitTextReveal } from '@/lib/animations';
import PremiumButton from '@/components/common/PremiumButton';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation with enhanced effect
      if (titleRef.current) {
        splitTextReveal(titleRef.current, {
          type: 'chars',
          stagger: 0.05,
          delay: 0.5,
        });
      }

      // Subtitle fade in with blur
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 50,
          filter: 'blur(10px)',
          duration: 1.2,
          delay: 1.5,
          ease: 'power3.out',
        });
      }

      // CTA buttons with 3D effect
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          opacity: 0,
          y: 50,
          rotationX: -90,
          transformPerspective: 1000,
          stagger: 0.2,
          delay: 2,
          duration: 1,
          ease: 'power4.out',
        });
      }

      // Parallax sections with enhanced movement
      gsap.utils.toArray<HTMLElement>('.parallax-section').forEach((section) => {
        const content = section.querySelector('.parallax-content');
        if (content) {
          gsap.to(content, {
            y: -100,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          });
        }
      });

      // Featured work cards with enhanced 3D effect
      gsap.utils.toArray<HTMLElement>('.work-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 150,
          rotationY: -15,
          scale: 0.8,
          transformPerspective: 1000,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            scrub: 1,
          },
        });
      });

      // Add scroll-triggered animations for sections
      gsap.utils.toArray<HTMLElement>('.page-transition').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className="bg-gradient-to-b from-[#0A0A0F] via-[#13131A] to-[#1C1C24]">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-70">
          <Scene3D />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="mb-8">
            <h1
              ref={titleRef}
              className="text-7xl md:text-9xl font-bold mb-6 text-white"
              style={{ perspective: '1000px' }}
            >
              Creative Developer
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12"
            >
              Crafting digital experiences that blend innovation, artistry, and cutting-edge
              technology
            </p>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex gap-6 justify-center items-center flex-wrap">
            <PremiumButton href="/projects">
              View Projects
              <FiArrowRight className="w-5 h-5" />
            </PremiumButton>

            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-16 flex gap-6 justify-center">
            {[
              { icon: FiGithub, href: 'https://github.com' },
              { icon: FiLinkedin, href: 'https://linkedin.com' },
              { icon: FiMail, href: 'mailto:hello@example.com' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section className="parallax-section relative py-32 overflow-hidden">
        <div className="parallax-content container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="page-transition">
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Pushing <span className="text-white">Boundaries</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                With over 5 years of experience in web development, I specialize in creating
                immersive digital experiences that captivate and inspire. From 3D interactions
                to seamless animations, every project is a masterpiece in the making.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-white font-semibold text-lg hover:gap-4 transition-all hover:text-gray-300"
              >
                Learn More About Me
                <FiArrowRight />
              </Link>
            </div>

            <div className="page-transition relative">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/0 rounded-3xl backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">50+</div>
                  <div className="text-gray-400">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-32 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center">
            Featured <span className="text-white">Work</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'E-Commerce Platform',
                desc: '3D product visualization with WebGL',
                tech: 'Next.js, Three.js, GSAP',
              },
              {
                title: 'Creative Agency',
                desc: 'Award-winning portfolio site',
                tech: 'React, Framer Motion, Lenis',
              },
              {
                title: 'SaaS Dashboard',
                desc: 'Real-time analytics with smooth animations',
                tech: 'React, D3.js, TailwindCSS',
              },
              {
                title: 'Brand Website',
                desc: 'Immersive storytelling experience',
                tech: 'Next.js, GSAP, ScrollTrigger',
              },
            ].map((project, i) => (
              <div
                key={i}
                className="work-card group relative h-96 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-white/50 transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-3 group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-6">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.split(', ').map((tech, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white font-semibold">
                    View Project
                    <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all"
            >
              View All Projects
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="parallax-section relative py-32 overflow-hidden">
        <div className="parallax-content text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let's Create Something
            <br />
            <span className="text-white">Amazing Together</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Start a Project
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
