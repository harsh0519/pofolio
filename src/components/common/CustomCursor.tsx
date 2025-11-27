'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  // --- stable hook order (all hooks declared up-front) ---
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [isClicking, setIsClicking] = useState(false);

  // refs for positions + DOM nodes
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const posRef = useRef({ x: -100, y: -100 });       // actual mouse
  const renderRef = useRef({ x: -100, y: -100 });    // rendered (smoothed)
  const rafRef = useRef<number | null>(null);

  // quick config (tweak numbers)
  const config = {
    dotSize: 6,
    ringSize: 44,
    ringHoverSize: 76,
    lerpSpeed: 0.18,        // smoothing factor (0..1) lower = more lag
    clickShrink: 0.6,
    rippleDuration: 750
  };

  // detect reduced motion / touch — run on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (isTouch || prefersReduced) return; // do nothing on touch or reduced-motion

    // helper: lerp
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    // mouse handlers
    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setVisible(true);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown = (e: PointerEvent) => {
      setIsClicking(true);
      window.setTimeout(() => setIsClicking(false), 140);

      // ripple element
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = '8px';
      ripple.style.height = '8px';
      ripple.style.borderRadius = '9999px';
      ripple.style.border = `1px solid rgba(255,255,255,0.92)`;
      ripple.style.transform = 'translate(-50%,-50%)';
      ripple.style.zIndex = '12000';
      ripple.style.pointerEvents = 'none';
      ripple.style.opacity = '0.6';
      ripple.style.transition = `width ${config.rippleDuration}ms ease, height ${config.rippleDuration}ms ease, opacity ${config.rippleDuration}ms ease`;
      document.body.appendChild(ripple);
      // trigger expansion
      requestAnimationFrame(() => {
        ripple.style.width = '220px';
        ripple.style.height = '220px';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), config.rippleDuration + 50);
    };

    // hover label logic (pointerover/pointerout)
    const onPointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const found = target.closest('[data-cursor="interactive"], a, button, [role="button"]') as HTMLElement | null;
      if (found) {
        const txt = found.getAttribute('data-cursor-label') ?? (found.tagName.toLowerCase() === 'a' ? 'Open' : 'Click');
        setLabel(txt);
      }
    };
    const onPointerOut = (e: Event) => {
      // if pointer moved outside interactive elements, clear label
      const target = e.target as HTMLElement | null;
      if (!target) { setLabel(null); return; }
      const still = (document.activeElement && (document.activeElement as HTMLElement).closest && (document.activeElement as HTMLElement).closest('[data-cursor="interactive"], a, button, [role="button"]'));
      if (!still) setLabel(null);
    };

    // render loop
    const loop = () => {
      // smooth the rendered position toward the real mouse
      renderRef.current.x = lerp(renderRef.current.x, posRef.current.x, config.lerpSpeed);
      renderRef.current.y = lerp(renderRef.current.y, posRef.current.y, config.lerpSpeed);

      const rx = renderRef.current.x;
      const ry = renderRef.current.y;

      // update DOM nodes (dot + ring)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${rx - config.dotSize / 2}px, ${ry - config.dotSize / 2}px, 0)`;
      }
      if (ringRef.current) {
        const ringSize = label ? config.ringHoverSize : (isClicking ? config.ringSize * config.clickShrink : config.ringSize);
        const offset = ringSize / 2;
        ringRef.current.style.width = `${ringSize}px`;
        ringRef.current.style.height = `${ringSize}px`;
        ringRef.current.style.transform = `translate3d(${rx - offset}px, ${ry - offset}px, 0)`;
      }
      if (labelRef.current) {
        // position label to the right of ring
        labelRef.current.style.left = `${rx + (config.ringSize)}px`;
        labelRef.current.style.top = `${ry - 12}px`;
        labelRef.current.style.opacity = label ? '1' : '0';
        labelRef.current.style.transform = label ? 'translateY(0)' : 'translateY(-6px)';
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // init nodes styles if not present
    // dot
    if (!dotRef.current) {
      const d = document.createElement('div');
      d.setAttribute('data-custom-cursor-dot', '1');
      d.style.position = 'fixed';
      d.style.left = '0';
      d.style.top = '0';
      d.style.width = `${config.dotSize}px`;
      d.style.height = `${config.dotSize}px`;
      d.style.borderRadius = '9999px';
      d.style.background = '#ffffff';
      d.style.boxShadow = '0 0 10px rgba(0,0,0,0.14)';
      d.style.pointerEvents = 'none';
      d.style.zIndex = '12000';
      d.style.transform = 'translate3d(-100px,-100px,0)';
      document.body.appendChild(d);
      dotRef.current = d;
    }
    // ring
    if (!ringRef.current) {
      const r = document.createElement('div');
      r.setAttribute('data-custom-cursor-ring', '1');
      r.style.position = 'fixed';
      r.style.left = '0';
      r.style.top = '0';
      r.style.width = `${config.ringSize}px`;
      r.style.height = `${config.ringSize}px`;
      r.style.borderRadius = '9999px';
      r.style.border = `1.4px solid rgba(255,255,255,0.92)`;
      r.style.boxSizing = 'border-box';
      r.style.pointerEvents = 'none';
      r.style.zIndex = '11999';
      r.style.transform = 'translate3d(-100px,-100px,0)';
      document.body.appendChild(r);
      ringRef.current = r;
    }
    // label
    if (!labelRef.current) {
      const l = document.createElement('div');
      l.setAttribute('data-custom-cursor-label', '1');
      l.style.position = 'fixed';
      l.style.left = '-9999px';
      l.style.top = '-9999px';
      l.style.pointerEvents = 'none';
      l.style.zIndex = '12001';
      l.style.padding = '6px 8px';
      l.style.borderRadius = '8px';
      l.style.fontSize = '12px';
      l.style.fontWeight = '700';
      l.style.background = '#0b1220';
      l.style.color = '#fff';
      l.style.boxShadow = '0 10px 30px rgba(3,6,23,0.6)';
      l.style.transition = 'opacity 160ms ease, transform 160ms ease';
      l.style.opacity = '0';
      document.body.appendChild(l);
      labelRef.current = l;
    }

    // wire events
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('mouseenter', onEnter);
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('pointerover', onPointerOver, true);
    document.addEventListener('pointerout', onPointerOut, true);

    // start loop
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop);

    return () => {
      // cleanup
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('pointerover', onPointerOver, true);
      document.removeEventListener('pointerout', onPointerOut, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      // remove nodes
      if (dotRef.current) { dotRef.current.remove(); dotRef.current = null; }
      if (ringRef.current) { ringRef.current.remove(); ringRef.current = null; }
      if (labelRef.current) { labelRef.current.remove(); labelRef.current = null; }
    };
  }, [mounted, label, isClicking]); 
  return null;
}
