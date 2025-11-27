"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiMenu, FiX } from "react-icons/fi";
import PremiumButton from "@/components/common/PremiumButton";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { name: "LinkedIn", icon: "in", href: "#" },
  { name: "GitHub", icon: "gh", href: "#" },
  { name: "Twitter", icon: "tw", href: "#" },
];

export default function FullScreenGSAPNav() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contactCTARef = useRef<HTMLAnchorElement | null>(null);
  const burgerTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Set initial states for premium animation
    gsap.set(overlayRef.current, { autoAlpha: 0, visibility: "hidden" });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(orb1Ref.current, { opacity: 0, scale: 0.5 });
    gsap.set(orb2Ref.current, { opacity: 0, scale: 0.5 });
    gsap.set(contentRef.current, { scale: 0.9, opacity: 0, y: 50 });
    gsap.set(headingRef.current, { y: 40, opacity: 0 });
    gsap.set(itemsRef.current, { y: 40, opacity: 0, x: -30 });
    gsap.set(socialIconsRef.current, { scale: 0, opacity: 0 });
    gsap.set(contactCTARef.current, { y: 30, opacity: 0 });

    // Create master timeline with award-winning easing
    burgerTl.current = gsap.timeline({ paused: true })
      // Stage 1: Backdrop entrance (0s - 0.4s)
      .to(
        overlayRef.current,
        { autoAlpha: 1, visibility: "visible", duration: 0.2, ease: "power1.inOut" },
        0
      )
      .to(
        backdropRef.current,
        { opacity: 1, duration: 0.6, ease: "power2.inOut" },
        0
      )

      // Stage 2: Orb animations (0.1s - 0.8s)
      .to(
        orb1Ref.current,
        {
          opacity: 1,
          scale: 1,
          x: 100,
          y: -100,
          duration: 1.2,
          ease: "elastic.out(1.2, 0.75)",
        },
        0.1
      )
      .to(
        orb2Ref.current,
        {
          opacity: 1,
          scale: 1,
          x: -100,
          y: 100,
          duration: 1.2,
          ease: "elastic.out(1.2, 0.75)",
        },
        0.15
      )

      // Stage 3: Content entrance (0.3s - 1.0s)
      .to(
        contentRef.current,
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
        0.3
      )

      // Stage 4: Heading (0.5s - 1.1s)
      .to(
        headingRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.5
      )

      // Stage 5: Navigation items stagger (0.6s - 1.4s)
      .to(
        itemsRef.current,
        { y: 0, x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        0.6
      )

      // Stage 6: Social icons pop (0.9s - 1.4s)
      .to(
        socialIconsRef.current,
        { scale: 1, opacity: 1, duration: 0.45, stagger: 0.12, ease: "back.out(1.5)" },
        0.9
      )

      // Stage 7: CTA button (1.1s - 1.5s)
      .to(
        contactCTARef.current,
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        1.1
      );

    return () => {
      burgerTl.current?.kill();
    };
  }, []);

  useEffect(() => {
    // Play or reverse timeline
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      burgerTl.current?.play();
      itemsRef.current[0]?.focus?.();
    } else {
      document.documentElement.style.overflow = "";
      burgerTl.current?.reverse();
    }
  }, [isOpen]);

  // Smooth scroll helper
  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Keyboard escape handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Top Navigation Bar - Minimal & Premium */}
      <nav className="fixed inset-x-0 top-0 z-50" style={{ background: 'rgba(15,15,16,0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="text-2xl font-black select-none bg-clip-text text-transparent tracking-tight"
            style={{ background: 'linear-gradient(90deg, var(--text-primary), rgba(255,255,255,0.85))' }}
          >
            ⚡
          </a>

          {/* Menu Button - Premium Icon */}
          <button
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((s) => !s)}
            className="w-12 h-12 flex items-center justify-center relative z-50 text-white hover:text-gray-300 transition-colors group"
          >
            <div className="relative w-6 h-6">
              {isOpen ? (
                <FiX size={28} className="transition-transform duration-300" />
              ) : (
                <FiMenu size={28} className="transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Overlay - Award-Winning Design */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 pointer-events-auto overflow-hidden"
        aria-hidden={!isOpen}
      >
        {/* Premium Backdrop with Multiple Layers */}
        <div
          ref={backdropRef}
          className="absolute inset-0"
          onClick={() => setIsOpen(false)}
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.9))' }}
        />

        {/* Gradient Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(15,15,16,0.8), rgba(15,15,16,0.95))' }} />

        {/* Animated Orbs - Premium Visual Effect */}
        <div
          ref={orb1Ref}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none mix-blend-overlay"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(0,229,255,0.12), rgba(34,211,238,0.06), transparent 60%)' }}
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none mix-blend-overlay"
          style={{ background: 'radial-gradient(circle at 70% 70%, rgba(245,158,11,0.10), rgba(0,229,255,0.06), transparent 60%)' }}
        />

        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Main Content - Centered & Full Screen */}
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
          <div
            ref={contentRef}
            className="w-full h-full max-w-full md:max-w-7xl flex flex-col justify-center"
          >
            {/* Main Navigation Section */}
            <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center md:items-start justify-between">
              {/* Left Content - 60% */}
              <div className="flex-1 w-full md:w-auto">
                {/* Heading */}
                <h2
                  ref={headingRef}
                  className="text-6xl md:text-8xl lg:text-9xl font-black mb-16 bg-clip-text text-transparent leading-tight tracking-tight"
                  style={{ background: 'linear-gradient(90deg, var(--text-primary), rgba(255,255,255,0.9))' }}
                >
                  Menu
                </h2>

                {/* Navigation Items - Large & Spaced */}
                <nav aria-label="Primary navigation" className="space-y-6 md:space-y-8">
                  {navItems.map((item, idx) => (
                    <a
                      key={item.name}
                      ref={(el) => {
                        itemsRef.current[idx] = el;
                      }}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="block group focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg p-2 md:p-4 transition-all duration-300"
                    >
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="w-0 h-1 md:h-1.5 bg-(--accent-primary) group-hover:w-8 md:group-hover:w-12 transition-all duration-500 ease-out" style={{ background: 'var(--accent-primary)' }} />
                        <span className="text-5xl md:text-6xl lg:text-7xl font-black group-hover:transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
                          {item.name}
                        </span>
                      </div>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Right Content - 40% */}
              <div className="flex-1 w-full md:w-auto md:pt-24">
                {/* CTA Section */}
                <div className="space-y-8">
                  <div>
                    <p className="text-xs md:text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-tertiary)' }}>
                      Ready to work together?
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
                      Let&apos;s create something <span style={{ color: 'var(--text-tertiary)' }}>extraordinary</span>
                    </h3>
                    <PremiumButton
                      ref={contactCTARef}
                      as="a"
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick("#contact");
                      }}
                      variant="primary"
                      size="lg"
                    >
                      Start a Project
                    </PremiumButton>
                  </div>

                  {/* Social Links */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-tertiary)' }}>
                      Connect with me
                    </p>
                    <div className="flex gap-6">
                      {socialLinks.map((link, idx) => (
                        <a
                          key={link.name}
                          ref={(el) => {
                            socialIconsRef.current[idx] = el;
                          }}
                          href={link.href}
                          aria-label={link.name}
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group"
                          style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}
                        >
                          <span className="text-sm font-bold">{link.icon}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
