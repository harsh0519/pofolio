'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navItems.map(item => item.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-effect shadow-lg py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
            >
              Portfolio
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`font-medium transition-all duration-300 hover:text-[var(--accent-primary)] ${
                    activeSection === item.href.substring(1)
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="px-6 py-2 bg-white text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105 glow-effect"
              >
                Let&apos;s Talk
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-20 right-6 left-6 glass-effect rounded-2xl p-6 transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-[var(--bg-tertiary)] ${
                  activeSection === item.href.substring(1)
                    ? 'text-[var(--accent-primary)] bg-[var(--bg-tertiary)]'
                    : 'text-[var(--text-secondary)]'
                }`}
                style={{
                  animation: isMobileMenuOpen
                    ? `fadeInUp 0.3s ease-out ${index * 0.1}s forwards`
                    : 'none',
                  opacity: 0,
                }}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="px-4 py-3 bg-white text-black rounded-lg font-semibold text-center glow-effect"
              style={{
                animation: isMobileMenuOpen
                  ? `fadeInUp 0.3s ease-out ${navItems.length * 0.1}s forwards`
                  : 'none',
                opacity: 0,
              }}
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
