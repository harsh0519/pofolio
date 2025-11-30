'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { FiMail, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

const socialLinks = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiMail, href: 'mailto:hello@example.com', label: 'Email' },
];

export default function GSAPNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navBarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Menu Animation
  useEffect(() => {
    if (isMenuOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Reset elements to initial state
      const menuItems = menuRef.current?.querySelectorAll('.menu-item');
      const socialIcons = menuRef.current?.querySelectorAll('.social-icon');
      const contactInfo = menuRef.current?.querySelector('.contact-info');

      // Set initial state
      if (menuItems && menuItems.length) {
        gsap.set(menuItems, { opacity: 1, y: 0, rotationX: 0 });
      }
      if (socialIcons && socialIcons.length) {
        gsap.set(socialIcons, { opacity: 1, scale: 1 });
      }
      if (contactInfo) {
        gsap.set(contactInfo, { opacity: 1, y: 0 });
      }

      const tl = gsap.timeline();

      // Animate overlay
      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }

      // Animate menu container
      if (menuRef.current) {
        tl.to(
          menuRef.current,
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.8,
            ease: 'power4.inOut',
          },
          '-=0.2'
        );
      }

      // Animate menu items
      if (menuItems && menuItems.length) {
        tl.from(
          menuItems,
          {
            opacity: 0,
            y: 100,
            rotationX: -90,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.4'
        );
      }

      // Animate social icons
      if (socialIcons && socialIcons.length) {
        tl.from(
          socialIcons,
          {
            opacity: 0,
            scale: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        );
      }

      // Animate contact info
      if (contactInfo) {
        tl.from(
          contactInfo,
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }
    } else {
      // Unlock body scroll
      document.body.style.overflow = 'unset';

      const tl = gsap.timeline();

      // Reverse animation
      const menuItems = menuRef.current?.querySelectorAll('.menu-item');
      if (menuItems && menuItems.length) {
        tl.to(menuItems, {
          opacity: 0,
          y: -50,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.in',
        });
      }

      if (menuRef.current) {
        tl.to(
          menuRef.current,
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            duration: 0.6,
            ease: 'power4.inOut',
          },
          '-=0.2'
        );
      }

      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          },
          '-=0.3'
        );
      }
    }
  }, [isMenuOpen]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        ref={navBarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold relative z-50 text-white hover:text-gray-300 transition-colors">
              Port<span className="text-white">folio</span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 w-16 h-16 flex items-center justify-center group hover:text-gray-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-8 h-6 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Overlay - Click to close */}
      <div
        ref={overlayRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 cursor-pointer"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      />

      {/* Fullscreen Navigation Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 overflow-hidden"
        style={{
          clipPath: isMenuOpen ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          display: isMenuOpen ? 'block' : 'none',
          visibility: isMenuOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="relative w-full h-full bg-black pointer-events-auto">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-5" />
          </div>

          {/* Menu Content - Navigation Section */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-6 pointer-events-auto z-50">
            {/* Navigation Links Section */}
            <nav className="mb-16 w-full relative z-50 pointer-events-auto">
              <ul className="space-y-6 text-center" style={{ perspective: '1000px' }}>
                {navLinks.map((link, i) => (
                  <li key={i} className="menu-item relative z-50 pointer-events-auto">
                    <Link
                      href={link.href}
                      onClick={handleNavClick}
                      className={`block text-6xl md:text-7xl font-bold transition-all duration-300 hover:scale-105 ${
                        pathname === link.href
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Media Links Section */}
            <div className="flex gap-8 mb-16 justify-center relative z-50 pointer-events-auto">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group relative w-14 h-14 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 cursor-pointer pointer-events-auto z-50"
                  style={{
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                  }}
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>

            {/* Contact Information Section */}
            <div className="contact-info text-center relative z-50 pointer-events-auto">
              <p className="text-gray-400 text-lg mb-3">Have a project?</p>
              <a
                href="mailto:hello@example.com"
                className="text-2xl font-semibold text-white hover:text-gray-400 transition-colors pointer-events-auto"
              >
                hello@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
