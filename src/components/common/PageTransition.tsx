'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) return;

    // Page enter animation
    const tl = gsap.timeline();

    tl.set(overlay, { scaleY: 1, transformOrigin: 'bottom' })
      .to(overlay, {
        scaleY: 0,
        duration: 1,
        ease: 'expo.inOut',
        transformOrigin: 'top',
      })
      .from(
        content,
        {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
        },
        '-=0.5'
      );
  }, [pathname]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none"
        style={{ transform: 'scaleY(0)' } as React.CSSProperties}
      />

      {/* Page content */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
