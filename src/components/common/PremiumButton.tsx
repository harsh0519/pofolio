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

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const overlay = button.querySelector('.button-text-overlay');

    const enter = () => {
      gsap.to(textRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      gsap.fromTo(
        overlay,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.inOut' }
      );
    };

    const leave = () => {
      gsap.to(overlay, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      gsap.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    };

    button.addEventListener('mouseenter', enter);
    button.addEventListener('mouseleave', leave);

    return () => {
      button.removeEventListener('mouseenter', enter);
      button.removeEventListener('mouseleave', leave);
    };
  }, []);

  const baseClasses = `
    relative z-20 bg-white text-black font-bold rounded-lg overflow-hidden 
    transition-all hover:shadow-xl shadow-lg group ${className}
  `;

  const ContentWrapper = (
    <div className="relative w-full h-full  flex items-center justify-center"> 
      {/* Default text */}
      <div ref={textRef} className="relative z-10 flex items-center gap-2">
        {children}
      </div>

      {/* Hover text */}
      <div className="button-text-overlay absolute inset-0 flex items-center justify-center pointer-events-none font-bold opacity-0">
        <span className="flex items-center gap-2">
          {children}
          <span className="inline-block w-0.5 h-6 bg-black animate-blink ml-1" />
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <a ref={buttonRef as any} href={href} className={baseClasses}>
        {ContentWrapper}
      </a>
    );
  }

  return (
    <button ref={buttonRef as any} onClick={onClick} className={baseClasses}>
      {ContentWrapper}
    </button>
  );
}
