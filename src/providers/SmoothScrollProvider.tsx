'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isTouchpad, setIsTouchpad] = useState(false);

  useEffect(() => {
    // Detect if user is using trackpad/touchpad
    let lastWheelTime = 0;
    let wheelCount = 0;

    const detectTouchpad = (e: WheelEvent) => {
      const currentTime = Date.now();

      // Touchpads fire more frequent, smaller delta events
      if (currentTime - lastWheelTime < 50) {
        wheelCount++;
      } else {
        wheelCount = 0;
      }

      lastWheelTime = currentTime;

      // If we get many events in quick succession with small deltas, it's likely a touchpad
      if (wheelCount > 5 && Math.abs(e.deltaY) < 50) {
        setIsTouchpad(true);
        window.removeEventListener('wheel', detectTouchpad);
      }
    };

    window.addEventListener('wheel', detectTouchpad, { passive: true });

    // Initialize Lenis with settings optimized for touchpad
    const lenis = new Lenis({
      duration: 0.8, // Faster for touchpad
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.5, // Lighter for better touchpad response
      touchMultiplier: 1,
      infinite: false,
      lerp: 0.15, // Faster interpolation for less lag
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use requestAnimationFrame for better performance
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      window.removeEventListener('wheel', detectTouchpad);
    };
  }, []);

  return <>{children}</>;
}
