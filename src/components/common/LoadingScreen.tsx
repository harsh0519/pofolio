'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      },
    });

    // Counter animation
    tl.to(
      {},
      {
        duration: 2,
        onUpdate: function () {
          const progress = Math.round(this.progress() * 100);
          if (counterRef.current) {
            counterRef.current.textContent = progress + '%';
          }
        },
      }
    );

    // Bars animation
    const bars = barsRef.current?.querySelectorAll('.loading-bar');
    if (bars) {
      tl.to(
        bars,
        {
          scaleY: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power2.in',
        },
        '-=0.4'
      );
    }

    // Fade out loader
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    tl.to(loaderRef.current, {
      display: 'none',
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Minimal background */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-black/80" />

      <div className="relative z-50 text-center">
        {/* Loading Percentage Counter */}
        <div
          ref={counterRef}
          className="text-8xl md:text-9xl font-bold text-white mb-12 font-mono"
        >
          0%
        </div>

        {/* Loading Progress Bar */}
        <div className="flex items-end gap-1.5 justify-center h-24">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="loading-bar w-1.5 bg-white rounded-sm"
              style={{
                height: `${20 + i * 15}px`,
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Loading Status Text */}
        <p className="mt-12 text-lg text-gray-400 tracking-widest font-light">INITIALIZING</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scaleY(0.6); }
          50% { opacity: 0.5; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
