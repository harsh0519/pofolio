'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCode, FiServer, FiShield, FiLayout } from 'react-icons/fi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import ResumePreview from '@/components/common/ResumePreview';

const skills = [
  { name: 'Frontend Development', level: 95, icon: FiCode },
  { name: 'Backend Development', level: 90, icon: FiServer },
  { name: 'Networking & Security', level: 62, icon: FiShield },
  { name: 'UI/UX Design', level: 78, icon: FiLayout },
];

const timeline = [
  {
    year: 'April 2025 – Present',
    title: 'Full-Stack Developer (Angular)',
    company: 'AGBE India',
    description: 'Developing and maintaining e-commerce admin & CMS platforms with Angular, Node.js, and MongoDB.',
  },
  {
    year: 'January 2024 – March 2025',
    title: 'Full-Stack Developer (Next.js)',
    company: 'Cosmoon Media',
    description: 'Built a production-ready travel booking platform using Next.js and Sanity CMS.',
  },
  {
    year: 'August 2023 – October 2023',
    title: 'Designer Intern (Canva & Figma)',
    company: 'BrandLadder',
    description: 'Designed marketing posters, social media creatives, and UI layouts using Figma and Canva.',
  },
  {
    year: '2021–2023',
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    description: 'Delivered responsive websites and web apps using React, Next.js, and modern UI/UX practices.',
  },
  {
    year: '2019-Present',
    title: 'Self-Learning',
    company: 'Independent',
    description: 'Learning Never Stops! Continuously enhancing skills in web development, 3D design, and modern frameworks.',
  },
];


export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayText, setDisplayText] = useState(["H"]);

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

    // Particle background animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 500; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx2d.beginPath();
        ctx2d.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx2d.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White
        ctx2d.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx2d.beginPath();
            ctx2d.moveTo(p1.x, p1.y);
            ctx2d.lineTo(p2.x, p2.y);
            ctx2d.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`; // White
            ctx2d.lineWidth = 0.5;
            ctx2d.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Continuous typewriter animation for HARSH, keeping H always visible
    const fullWord = 'HARSH';
    let currentIndex = 1; // Start with H already visible
    let isTyping = true;
    let pauseCounter = 0;
    let typewriterId: any;

    const typewriter = () => {
      if (pauseCounter > 0) {
        pauseCounter--;
        return;
      }

      if (isTyping) {
        if (currentIndex < fullWord.length) {
          const newText = fullWord.slice(0, currentIndex + 1);
          setDisplayText(newText.split(''));
          currentIndex++;
        } else {
          isTyping = false;
          pauseCounter = 5;
        }
      } else {
        if (currentIndex > 1) { 
          const newText = fullWord.slice(0, currentIndex - 1);
          setDisplayText(newText.split(''));
          currentIndex--;
        } else {
          isTyping = true;
          pauseCounter = 3;
        }
      }
    };

    typewriterId = setInterval(typewriter, 100);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(typewriterId);
    };
  }, []);

  return (
    <main ref={heroRef} className="pt-20 relative bg-linear-to-b from-[#0A0A0F] via-[#13131A] to-[#1C1C24] overflow-hidden">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">

        </div>

        <div className="container mx-auto px-6 relative z-9999 flex items-center justify-center w-auto">
          <div className="about-hero max-w-4xl text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
              Hi, I'm <span
                className="
    inline-block
    font-mono
    tracking-widest
    text-white
    drop-shadow-[0_0_14px_rgba(255,255,255,0.6)]
  "
                style={{
                  width: '5ch',      // EXACT length of HARSH
                  textAlign: 'left'
                }}
              >
                {displayText.join('')}
              </span>

            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 mb-8 leading-relaxed">
              Full-Stack Engineer skilled in React.js & Next.js, building responsive, high-performance UIs with modern UI/UX, Tailwind CSS, and animations using GSAP/Framer Motion. Experienced in REST APIs, state management, Git, and Agile workflows.
            </p>
            <div className="flex flex-wrap gap-6 text-lg justify-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">2.5+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#8B5CF6] mb-2">20+</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <ResumePreview />
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
                  <div className="w-12 h-12 bg-linear-to-br from-white to-gray-200 rounded-lg flex items-center justify-center">
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
                className={`timeline-item relative mb-16 md:mb-24 ${i % 2 === 0 ? 'md:text-right md:pr-[50%]' : 'md:pl-[50%]'
                  }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full hidden md:block" />

                <div
                  className={`bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 hover:border-white/50 transition-all ${i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
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
      <section className="py-32 bg-linear-to-b from-transparent to-black/50">
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
      {/* Particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      />
    </main>
  );
}
