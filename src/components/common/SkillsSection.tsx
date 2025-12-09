'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillCategory {
  title: string;
  color: string;
  icon: string;
  skills: string[];
  level: number;
}

const skillsData: SkillCategory[] = [
  {
    title: 'Frontend Development',
    color: 'from-blue-400 to-blue-600',
    icon: '🎨',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'ShadCN/UI', 'HTML5', 'CSS3', 'SCSS', 'Responsive Design', 'Dark Mode Systems', 'Component Architecture', 'CSR/SSR/SSG'],
    level: 9
  },
  {
    title: 'Animation & Interaction',
    color: 'from-purple-400 to-purple-600',
    icon: '✨',
    skills: ['GSAP', 'GSAP ScrollTrigger', 'Framer Motion', 'Locomotive Scroll', 'Lenis Smooth Scroll', 'Lottie', 'Intersection Observer', '3D Animations', 'Micro-interactions'],
    level: 8
  },
  {
    title: 'Backend Development',
    color: 'from-green-400 to-green-600',
    icon: '⚙️',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Mongoose', 'Prisma ORM', 'CRUD Architecture', 'Authorization & Roles'],
    level: 8
  },
  {
    title: 'Authentication / Security',
    color: 'from-yellow-400 to-yellow-600',
    icon: '🔐',
    skills: ['JWT', 'Bcrypt', 'Access Tokens', 'Refresh Tokens', 'Middleware Auth', 'Secure API Integration'],
    level: 7
  },
  {
    title: 'Dev Tools',
    color: 'from-indigo-400 to-indigo-600',
    icon: '🛠️',
    skills: ['Vite', 'Webpack Basics', 'ESLint', 'Prettier', 'PostCSS', 'Git & GitHub', 'NPM/Yarn', 'Environment Handling (.env)', 'Build Optimization'],
    level: 8
  },
  {
    title: 'API Integrations',
    color: 'from-cyan-400 to-cyan-600',
    icon: '🔌',
    skills: ['Spotify Web Playback SDK', 'Third-party REST APIs', 'Fetch API', 'Email sending with NodeMailer'],
    level: 8
  },
  {
    title: 'Databases',
    color: 'from-pink-400 to-pink-600',
    icon: '💾',
    skills: ['MongoDB', 'Mongo Atlas', 'Prisma Models', 'Schema Design'],
    level: 7
  },
  {
    title: 'Design & Product Skills',
    color: 'from-violet-400 to-violet-600',
    icon: '🎭',
    skills: ['Figma', 'Canva', 'UI/UX Design', 'Wireframing', 'Visual Layouts', 'Color Systems', 'Component-Driven Design', 'Portfolio UI'],
    level: 8
  },
  {
    title: 'Other Useful Skills',
    color: 'from-teal-400 to-teal-600',
    icon: '⭐',
    skills: ['Performance Optimization', 'SEO (Next-SEO)', 'Metadata', 'Accessibility Basics', 'Animation Timing & Easing', 'Responsive Grid Systems'],
    level: 8
  }
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [cardMousePos, setCardMousePos] = useState({ x: 0, y: 0 });
  const [ballPositions, setBallPositions] = useState(
    skillsData.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }))
  );
  const ballsRef = useRef(ballPositions);
  const [draggedBallIdx, setDraggedBallIdx] = useState<number | null>(null);
  const [isOverviewVisible, setIsOverviewVisible] = useState(false);
  const [hoveredBallIdx, setHoveredBallIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredCardIdx === null) return;
      
      const card = cardsRef.current[hoveredCardIdx];
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      setCardMousePos({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredCardIdx]);

  // Detect when Overview section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverviewVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const overviewElement = sectionRef.current?.querySelector('.overview-container');
    if (overviewElement) {
      observer.observe(overviewElement);
    }

    return () => observer.disconnect();
  }, []);

  // Physics simulation for balls
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOverviewVisible) return;

    const animate = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const ballRadius = 32;

      ballsRef.current = ballsRef.current.map((ball, idx) => {
        // If ball is being dragged, skip physics
        if (draggedBallIdx === idx) {
          return ball;
        }

        let x = ball.x;
        let y = ball.y;
        let vx = ball.vx;
        let vy = ball.vy;

        // Very light gravity
        vy -= 0.5;

        // Update position
        x += vx;
        y += vy;

        // Bounce off walls with good energy retention
        if (x - ballRadius < 0) {
          x = ballRadius;
          vx *= -0.9;
        }
        if (x + ballRadius > width) {
          x = width - ballRadius;
          vx *= -0.9;
        }
        if (y - ballRadius < 0) {
          y = ballRadius;
          vy *= -0.9;
        }
        if (y + ballRadius > height) {
          y = height - ballRadius;
          vy = 0;
          vx = 0;
        }

        // Light friction
        vx *= 0.995;
        vy *= 0.995;

        return { x, y, vx, vy };
      });

      setBallPositions([...ballsRef.current]);
    };

    const interval = setInterval(animate, 30);
    return () => clearInterval(interval);
  }, [isOverviewVisible, draggedBallIdx]);

  const handleBallMouseDown = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedBallIdx(idx);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedBallIdx === null) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.max(40, Math.min(e.clientX - rect.left, rect.width - 40));
    const y = Math.max(40, Math.min(e.clientY - rect.top, rect.height - 40));

    ballsRef.current[draggedBallIdx] = {
      ...ballsRef.current[draggedBallIdx],
      x,
      y,
      vx: 0,
      vy: 0,
    };

    setBallPositions([...ballsRef.current]);
  };

  const handleMouseUp = () => {
    setDraggedBallIdx(null);
  };

  // Initialize ball positions when container mounts
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const ballRadius = 32;

    const initialPositions = skillsData.map(() => ({
      x: Math.random() * (width - 2 * ballRadius) + ballRadius,
      y: Math.random() * (height - 2 * ballRadius) + ballRadius,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    }));

    ballsRef.current = initialPositions;
    setBallPositions(initialPositions);
  }, []);

  return (
    <div ref={sectionRef} className="w-full relative bg-transparent py-20 px-6 sm:px-10" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="max-w-7xl mx-auto mb-20 justify-center text-center"
      >
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4">
          What I  <span className="bg-gradient-to-r from-gray-400 via-gray-400 to-white bg-clip-text text-transparent">Can Do</span>
        </h2>
      </motion.div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((category, idx) => (
            <motion.div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              initial={{ opacity: 0, y: 60, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.08, type: 'spring', stiffness: 100, damping: 20 }}
              viewport={{ once: false }}
              whileHover={{ y: -16, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredCardIdx(idx)}
              onMouseLeave={() => setHoveredCardIdx(null)}
              className="skill-card group perspective"
            >
              {/* Card Container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col transition-all duration-300"
                style={{
                  transform: hoveredCardIdx === idx
                    ? `perspective(1000px) rotateX(${cardMousePos.y * 0.03}deg) rotateY(${cardMousePos.x * -0.03}deg)`
                    : 'perspective(1000px)',
                  transformStyle: 'preserve-3d',
                }}>
                
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-20`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white transition-colors">
                    {category.title}
                  </h3>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-white/20 to-transparent mb-4" />

                {/* Skills List - Scatter/Area Style */}
                <div className="flex-1 flex flex-wrap gap-3 content-start">
                  {category.skills.slice(0, 5).map((skill, skillIdx) => (
                    <motion.div
                      key={skillIdx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: skillIdx * 0.05 }}
                      viewport={{ once: false }}
                      className="skill-item px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 transition-all hover:scale-110"
                    >
                      {skill}
                    </motion.div>
                  ))}
                  {category.skills.length > 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: false }}
                      className="px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-full text-xs text-gray-400 font-semibold"
                    >
                      +{category.skills.length - 5} more
                    </motion.div>
                  )}
                </div>

                {/* Footer Badge with Proficiency */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Proficiency</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-white/20 to-white/10 px-2 py-1 rounded text-white">{category.level}/10</span>
                  </div>
                  {/* Proficiency Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${category.level * 10}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: false }}
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scattering Area Overview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: false }}
        className="max-w-7xl mx-auto mt-24 mb-20"
      >
        <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-30 -z-10" />

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Overview</h3>

          {/* Scattering Visualization with Physics */}
          <div ref={containerRef} className="overview-container relative h-80 md:h-64 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Physics-based Skill Balls */}
            {skillsData.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: false }}
                className="absolute group cursor-grab active:cursor-grabbing"
                style={{
                  left: `${ballPositions[idx].x}px`,
                  top: `${ballPositions[idx].y}px`,
                  transform: 'translate(-50%, -50%)',
                  userSelect: 'none',
                }}
                onMouseDown={(e) => handleBallMouseDown(idx, e)}
                onMouseEnter={() => setHoveredBallIdx(idx)}
                onMouseLeave={() => setHoveredBallIdx(null)}
              >
                {/* Ball with 3D effect */}
                <div className={`relative w-16 md:w-20 h-16 md:h-20 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl md:text-3xl shadow-xl border-2 border-white/40 transition-all hover:scale-125 hover:shadow-2xl hover:border-white/60 group-hover:z-50 ${draggedBallIdx === idx ? 'scale-125 shadow-2xl' : ''}`}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {category.icon}
                </div>

                {/* Tooltip on Hover */}
                <motion.div
                  animate={{
                    opacity: hoveredBallIdx === idx ? 1 : 0,
                    y: hoveredBallIdx === idx ? -60 : 10,
                    scale: hoveredBallIdx === idx ? 1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-br from-black/90 to-black/70 border border-white/30 rounded-lg px-3 py-2 text-xs text-white pointer-events-none z-50 backdrop-blur-sm shadow-xl"
                >
                  <div className="font-semibold">{category.title}</div>
                  <div className="text-white/70 text-xs">Level {category.level}/10</div>
                </motion.div>
              </motion.div>
            ))}

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {skillsData.length}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-sm">Skill Areas</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
