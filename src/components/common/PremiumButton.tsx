'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function PremiumButton({
  children,
  href,
  onClick,
  className = '',
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      setIsHovering(true);

      // Animate text out upward
      gsap.to(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      // Animate new text in from bottom
      gsap.from(button.querySelector('.button-text-overlay'), {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);

      // Animate overlay text out downward
      gsap.to(button.querySelector('.button-text-overlay'), {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      // Animate original text back in
      gsap.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const baseClasses = `relative px-8 py-4 bg-white text-black font-bold rounded-lg overflow-hidden transition-all hover:shadow-xl shadow-lg group ${className}`;

  const commonContent = (
    <>
      {/* Original Text */}
      <div ref={textRef} className="relative z-10 flex items-center gap-2">
        {children}
      </div>

      {/* Overlay Text - Slides in from bottom */}
      <div className="button-text-overlay absolute inset-0 flex items-center justify-center text-black font-bold opacity-0">
        <span className="flex items-center gap-2">
          {children}
          <span className="inline-block w-0.5 h-6 bg-black animate-blink ml-1" />
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
      >
        {commonContent}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      className={baseClasses}
    >
      {commonContent}
    </button>
  );
}
