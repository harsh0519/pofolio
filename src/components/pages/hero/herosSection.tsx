'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(y, [0, 800], [5, -5]);
  const rotateY = useTransform(x, [0, 1200], [-5, 5]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-texture"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      {/* Floating Orbs with Framer Motion */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '10%', top: '20%' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ right: '10%', bottom: '20%' }}
      />

      {/* Content with Perspective */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center perspective-container"
        style={{ rotateX, rotateY }}
      >
        <div className="space-y-8">
          {/* Greeting with Reveal Animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] font-light tracking-wider"
          >
            WELCOME, I&apos;M
          </motion.p>

          {/* Name with Stagger Animation */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {['YOUR', 'NAME'].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block gradient-text"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {word}{i === 0 && ' '}
              </motion.span>
            ))}
          </motion.h1>

          {/* Animated Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-4xl lg:text-5xl font-light text-[var(--text-secondary)]"
          >
            <TypeWriter
              texts={[
                'Full Stack Developer',
                'Creative Designer',
                'Problem Solver',
                'Tech Enthusiast'
              ]}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-tertiary)] font-light leading-relaxed"
          >
            Crafting elegant digital experiences through code and design.
            <br />
            Turning complex problems into simple, beautiful solutions.
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
          >
            <MagneticButton href="#projects">
              <span className="relative z-10">View My Work</span>
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              <span className="relative z-10">Get In Touch</span>
            </MagneticButton>
          </motion.div>

          {/* Social Links with Stagger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex gap-6 justify-center mt-12"
          >
            {[
              { icon: FaGithub, href: 'https://github.com' },
              { icon: FaLinkedin, href: 'https://linkedin.com' },
              { icon: FaTwitter, href: 'https://twitter.com' },
              { icon: FaEnvelope, href: 'mailto:your@email.com' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-effect rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[var(--text-tertiary)] rounded-full flex justify-center p-2">
            <motion.div
              className="w-1 h-3 bg-[var(--text-tertiary)] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// TypeWriter Component
function TypeWriter({ texts }: { texts: string[] }) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(text.substring(0, currentText.length + 1));
        if (currentText === text) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(text.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts]);

  return (
    <span className="inline-block min-h-[1.2em]">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1 h-[1em] bg-white ml-1 align-middle"
      />
    </span>
  );
}

// Magnetic Button Component
function MagneticButton({
  children,
  href,
  variant = 'filled'
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'filled' | 'outline';
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      href={href}
      className={`
        group relative px-8 py-4 rounded-lg font-medium overflow-hidden
        ${variant === 'filled'
          ? 'bg-white text-black'
          : 'glass-effect text-white border-2 border-white'
        }
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {variant === 'filled' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-500"
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {children}
    </motion.a>
  );
}
