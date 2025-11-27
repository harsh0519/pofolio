'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { gsap } from 'gsap';
import PremiumButton from '@/components/common/PremiumButton';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);
  const orbRef3 = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsLoaded(true);

    // Multi-layered GSAP orb animations with different speeds
    const orb1Tl = gsap.timeline({ repeat: -1 });
    const orb2Tl = gsap.timeline({ repeat: -1 });
    const orb3Tl = gsap.timeline({ repeat: -1 });

    // Orb 1 - Large, slow motion
    orb1Tl
      .to(orbRef1.current, {
        x: 200,
        y: -200,
        duration: 12,
        ease: 'sine.inOut',
      })
      .to(
        orbRef1.current,
        { x: -200, y: 200, duration: 12, ease: 'sine.inOut' },
        0
      )
      .to(
        orbRef1.current,
        { x: 150, y: -150, duration: 12, ease: 'sine.inOut' },
        0
      );

    // Orb 2 - Medium speed
    orb2Tl
      .to(orbRef2.current, {
        x: -180,
        y: 180,
        duration: 10,
        ease: 'sine.inOut',
      })
      .to(
        orbRef2.current,
        { x: 180, y: -180, duration: 10, ease: 'sine.inOut' },
        0
      );

    // Orb 3 - Fast, accent color
    orb3Tl
      .to(orbRef3.current, {
        x: 100,
        y: 100,
        duration: 8,
        ease: 'sine.inOut',
      })
      .to(
        orbRef3.current,
        { x: -100, y: -100, duration: 8, ease: 'sine.inOut' },
        0
      );

    // Floating elements animation
    floatingElementsRef.current.forEach((el, i) => {
      gsap.to(el, {
        y: -30 + i * 10,
        duration: 3 + i * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Enhanced parallax with depth layers
      if (orbRef1.current && orbRef2.current && orbRef3.current) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.08;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.08;
        
        gsap.to(orbRef1.current, { x: moveX * 0.5, y: moveY * 0.5, duration: 0.6, overwrite: 'auto' });
        gsap.to(orbRef2.current, { x: moveX, y: moveY, duration: 0.5, overwrite: 'auto' });
        gsap.to(orbRef3.current, { x: moveX * 1.5, y: moveY * 1.5, duration: 0.4, overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      orb1Tl.kill();
      orb2Tl.kill();
      orb3Tl.kill();
    };
  }, [mouseX, mouseY]);

  const rotateX = useTransform(y, [0, 800], [4, -4]);
  const rotateY = useTransform(x, [0, 1200], [-4, 4]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Advanced Background Layers */}
      <div className="absolute inset-0">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-background opacity-5" />

        {/* Radial Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03), transparent 40%, var(--bg-primary) 100%)',
            opacity: 0.6,
          }}
        />

        {/* Premium Animated Orbs - Layer 1 */}
        <div
          ref={orbRef1}
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-40 mix-blend-screen"
          style={{
            left: '-200px',
            top: '-200px',
            background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15), rgba(255,255,255,0.05), transparent 60%)',
          }}
        />

        {/* Premium Animated Orbs - Layer 2 */}
        <div
          ref={orbRef2}
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-30 mix-blend-screen"
          style={{
            right: '-150px',
            bottom: '-150px',
            background: 'radial-gradient(circle at 75% 75%, rgba(34,211,238,0.18), rgba(0,229,255,0.08), transparent 60%)',
          }}
        />

        {/* Accent Orb - Layer 3 */}
        <div
          ref={orbRef3}
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-25 mix-blend-screen"
          style={{
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 50% 50%, rgba(0,229,255,0.15), transparent 65%)',
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              ref={(el) => {
                if (el) floatingElementsRef.current[i] = el;
              }}
              className="absolute w-6 h-6 rounded-full"
              style={{ background: 'var(--accent-primary)' }}
              initial={{
                opacity: Math.random() * 0.4 + 0.1,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                opacity: [Math.random() * 0.2, Math.random() * 0.6, Math.random() * 0.2],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full justify-center flex items-center">
        <motion.div
          ref={contentRef}
          className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Top Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', backdropFilter: 'blur(8px)' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
            <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Welcome to my portfolio</span>
          </motion.div>

          {/* Hero Heading - Award Winning Style */}
          <div ref={titleRef} className="mb-8 overflow-hidden">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-white tracking-tighter leading-none bg-clip-text text-transparent"
              initial={{ y: 120, opacity: 0, filter: 'blur(20px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              YOUR NAME
            </motion.h1>
          </div>

          {/* Subtitle with Dynamic Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="inline-block">
              <div className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-primary)' }}>Creative</span> Developer & Designer
              </div>
              <motion.div
                className="h-1 rounded-full mt-4"
                style={{ background: 'linear-gradient(90deg, var(--accent-primary) 0%, transparent 100%)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Description with Stagger */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-12 font-light"
            style={{ color: 'var(--text-secondary)' }}
          >
            Crafting premium digital experiences with cutting-edge design and innovative code.
            <span className="block mt-2" style={{ color: 'var(--text-tertiary)' }}>From concept to deployment, I build experiences that matter.</span>
          </motion.p>

          {/* CTA Buttons - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 flex-wrap"
          >
            <PremiumButton as="a" href="#projects" variant="primary" size="lg">
              <span className="flex items-center gap-2">
                Explore My Work
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </PremiumButton>
            <PremiumButton as="a" href="#contact" variant="outline" size="lg">
              <span className="flex items-center gap-2">
                <FiPlay className="w-5 h-5" />
                Get in Touch
              </span>
            </PremiumButton>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto mb-16 py-8 border-t border-white/10"
          >
            {[{ num: '50+', label: 'Projects' }, { num: '5+', label: 'Years Exp' }, { num: '100%', label: 'Client Satisfaction' }].map((stat, i) => (
              <div key={i} className="text-center">
                <motion.div
                  className="text-3xl md:text-4xl font-black text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 + i * 0.1 }}
                >
                  {stat.num}
                </motion.div>
                <p className="text-sm text-white/50 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Social Links - Redesigned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex gap-4 justify-center mb-12"
          >
            {[
              { icon: FaGithub, label: 'GitHub', href: '#' },
              { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
              { icon: FaTwitter, label: 'Twitter', href: '#' },
              { icon: FaEnvelope, label: 'Email', href: '#' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                className="group relative w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.6 + i * 0.1 }}
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)', opacity: 0, transition: 'opacity 200ms' }} />
                <social.icon className="w-5 h-5 relative z-10" style={{ color: 'var(--text-primary)' }} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Enhanced */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/50 font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2 backdrop-blur-sm">
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
