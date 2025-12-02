'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiAward, FiCode, FiZap, FiHeart } from 'react-icons/fi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const skills = [
  { name: 'Frontend Development', level: 95, icon: FiCode },
  { name: '3D & WebGL', level: 90, icon: FiZap },
  { name: 'GSAP Animations', level: 92, icon: FiAward },
  { name: 'UI/UX Design', level: 88, icon: FiHeart },
];

const timeline = [
  {
    year: '2024',
    title: 'Senior Creative Developer',
    company: ' Agency',
    description: 'Leading frontend development for high-profile clients',
  },
  {
    year: '2022',
    title: 'Frontend Developer',
    company: 'Tech Startup',
    description: 'Built scalable web applications with modern frameworks',
  },
  {
    year: '2020',
    title: 'Junior Developer',
    company: 'Digital Agency',
    description: 'Developed responsive websites and learned best practices',
  },
  {
    year: '2019',
    title: 'Started Journey',
    company: 'Self-taught',
    description: 'Began learning web development and design',
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.about-hero', {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power4.out',
      });

      // Skills animation
      gsap.utils.toArray<HTMLElement>('.skill-item').forEach((skill, i) => {
        gsap.from(skill, {
          opacity: 0,
          x: -100,
          duration: 1,
          delay: i * 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: skill,
            start: 'top 80%',
            once: true,
          },
        });

        // Animate skill bars
        const bar = skill.querySelector('.skill-bar-fill');
        if (bar) {
          gsap.from(bar, {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 1.5,
            delay: i * 0.1 + 0.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: skill,
              start: 'top 80%',
              once: true,
            },
          });
        }
      });

      // Timeline animation
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
        const isEven = i % 2 === 0;
        gsap.from(item, {
          opacity: 0,
          x: isEven ? -100 : 100,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            once: true,
          },
        });
      });

      // Parallax effect on large text
      gsap.to('.parallax-text', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-text',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className="pt-20 bg-gradient-to-b from-[#0A0A0F] via-[#13131A] to-[#1C1C24]">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="parallax-text text-[20vw] font-bold text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            CREATIVE DEVELOPER
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex items-center justify-center w-full">
          <div className="about-hero max-w-4xl text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
              Hi, I'm <span className="text-white">Your Name</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 mb-8 leading-relaxed">
              A creative developer passionate about pushing the boundaries of web design with
              stunning 3D animations, immersive interactions, and pixel-perfect execution.
            </p>
            <div className="flex flex-wrap gap-6 text-lg justify-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">5+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#8B5CF6] mb-2">50+</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#8B5CF6] mb-2">10+</div>
                <div className="text-gray-400">Awards Won</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-32 bg-black/30">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center">
            What I <span className="text-white">Do Best</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill, i) => (
              <div key={i} className="skill-item">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center">
                    <skill.icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{skill.name}</h3>
                      <span className="text-white font-bold">{skill.level}%</span>
                    </div>
                    <div className="skill-bar h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="skill-bar-fill h-full bg-white"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-20 text-center text-white">
            My <span className="text-white">Journey</span>
          </h2>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white hidden md:block" />

            {timeline.map((item, i) => (
              <div
                key={i}
                className={`timeline-item relative mb-16 md:mb-24 ${
                  i % 2 === 0 ? 'md:text-right md:pr-[50%]' : 'md:pl-[50%]'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full hidden md:block" />

                <div
                  className={`bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 hover:border-white/50 transition-all ${
                    i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}
                >
                  <div className="text-white text-2xl font-bold mb-2">{item.year}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="text-gray-400 mb-3">{item.company}</div>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
            Let's Work <span className="text-white">Together</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let's create something extraordinary together.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
}
