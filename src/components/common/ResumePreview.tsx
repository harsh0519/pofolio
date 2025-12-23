"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense } from "react";
import { createPortal } from "react-dom";
const ThreePopupLazy = React.lazy(() => import("./ThreePopup"));
import gsap from "gsap";
import * as THREE from "three";

type Props = {
  src?: string;
  fileName?: string;
  className?: string;
};

export default function ResumePreview({
  src = "/ResumeHarshKumarMehta.pdf",
  fileName = "Harsh_Resume.pdf",
  className = "w-full max-w-xl h-6",
}: Props) {
  const [showPopover, setShowPopover] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  /* ---------------- GSAP + THREE HOVER ---------------- */

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const bounds = new THREE.Vector2();
    const mouse = new THREE.Vector2();

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();

      bounds.set(rect.width, rect.height);
      mouse.set(
        (e.clientX - rect.left) / bounds.x - 0.5,
        (e.clientY - rect.top) / bounds.y - 0.5
      );

      gsap.to(btn, {
        rotationX: -mouse.y * 12,
        rotationY: mouse.x * 16,
        transformPerspective: 800,
        ease: "power3.out",
        duration: 0.4,
      });

      gsap.to(btn, {
        boxShadow: "0 20px 40px rgba(255,255,255,0.15)",
        duration: 0.3,
      });
    };

    const onEnter = () => {
      gsap.to(btn, { scale: 1.06, duration: 0.3, ease: "power3.out" });
    };

    const onLeave = () => {
      gsap.to(btn, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
        duration: 0.6,
        ease: "power4.out",
      });
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ---------------- POPOVER LOGIC ---------------- */

  const handleEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowPopover(true);
  };

  const handleLeave = () => {
    hideTimer.current = window.setTimeout(() => setShowPopover(false), 150);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);
    setProgress(0);
    setDownloadComplete(false);

    try {
      const res = await fetch(src);
      if (!res.body) {
        // fallback: navigate to src
        window.location.href = src;
        setDownloading(false);
        return;
      }

      const contentLength = Number(res.headers.get("content-length") || "0");
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (contentLength) {
            setProgress(Math.round((received / contentLength) * 100));
          } else {
            // approximate progress when content-length not provided
            setProgress((p) => Math.min(99, p + 5));
          }
        }
      }

      // concat Uint8Array chunks into single Uint8Array for Blob
      const combined = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      const blob = new Blob([combined], { type: res.headers.get("content-type") || "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setProgress(100);
      setDownloadComplete(true);
    } catch (err) {
      console.error(err);
      // fallback
      window.location.href = src;
    } finally {
      setTimeout(() => setDownloading(false), 700);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* base preview */}
      <div className="w-full overflow-hidden" />

      {/* Download button (centered) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleDownload}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onFocus={handleEnter}
          onBlur={handleLeave}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg shadow-xl will-change-transform"
          style={{ pointerEvents: 'auto' }}
          aria-label="Download resume"
        >
          <span className="relative z-10 flex items-center gap-2">
            {downloadComplete ? (
              <span className="text-green-600 font-bold">✓</span>
            ) : null}
            <span>{downloadComplete ? "Downloaded" : downloading ? `${progress}%` : "Download Resume"}</span>
          </span>

          {/* progress bar */}
          <span className="absolute left-0 bottom-0 h-1 bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </button>
      </div>

      {/* Popover: rendered into a portal so it isn't clipped and appears above other content */}
      {showPopover && (
        <ThreePopupPortal anchorRef={buttonRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave} src={src} />
      )}
    </div>
  );
}

function ThreePopup({ src }: { src: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const frameId = React.useRef<number | null>(null);
  const meshRef = React.useRef<THREE.Mesh | null>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 5);
    scene.add(light);

    const geo = new THREE.PlaneGeometry(1.6, 2.2, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0b0b0f, roughness: 0.4, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(0.001, 0.001, 0.001);
    scene.add(mesh);
    meshRef.current = mesh;

    // simple render loop
    const render = () => {
      renderer.render(scene, camera);
      frameId.current = requestAnimationFrame(render);
    };
    render();

    setMounted(true);

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // animate open once mounted
  useEffect(() => {
    if (!mounted || !meshRef.current) return;
    const mesh = meshRef.current;
    gsap.fromTo(
      mesh.scale,
      { x: 0.001, y: 0.001, z: 0.001 },
      { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power3.out' }
    );

    gsap.fromTo(
      mesh.rotation,
      { x: -0.2, y: 0.2, z: 0 },
      { x: 0, y: 0, z: 0, duration: 0.6, ease: 'power4.out' }
    );

    return () => {
      // animate close quickly
      if (mesh) gsap.to(mesh.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.25 });
    };
  }, [mounted]);

  return (
    <div ref={containerRef} className="relative w-80 h-96 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Overlay iframe to display actual PDF content; pointer events enabled */}
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
        className="absolute left-1 top-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] bg-white border rounded-md"
        title="Resume Preview 3D"
      />
    </div>
  );
}

function ThreePopupPortal({
  anchorRef,
  src,
  onMouseEnter,
  onMouseLeave,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  src: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const popW = 320; // w-80
  const popH = 384; // h-96

  useLayoutEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const rightSpace = window.innerWidth - rect.right;
    const leftSpace = rect.left;
    let left = 0;
    let top = 0;

    // Prefer placing popup to the right of the button when there's space
    if (rightSpace >= popW + 8) {
      left = rect.right + 8;
      // center vertically relative to button
      top = rect.top + rect.height / 2 - popH / 2;
    } else if (leftSpace >= popW + 8) {
      // place to the left
      left = rect.left - popW - 8;
      top = rect.top + rect.height / 2 - popH / 2;
    } else {
      // fallback: center below the button
      left = rect.left + rect.width / 2 - popW / 2;
      top = rect.bottom + 8;
    }

    // clamp inside viewport with small padding
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - popH - 8));
    setPos({ left, top });

    const onResize = () => {
      const r = el.getBoundingClientRect();
      const rRightSpace = window.innerWidth - r.right;
      const rLeftSpace = r.left;
      let l = 0;
      let t = 0;

      if (rRightSpace >= popW + 8) {
        l = r.right + 8;
        t = r.top + r.height / 2 - popH / 2;
      } else if (rLeftSpace >= popW + 8) {
        l = r.left - popW - 8;
        t = r.top + r.height / 2 - popH / 2;
      } else {
        l = r.left + r.width / 2 - popW / 2;
        t = r.bottom + 8;
      }

      l = Math.max(8, Math.min(l, window.innerWidth - popW - 8));
      t = Math.max(8, Math.min(t, window.innerHeight - popH - 8));
      setPos({ left: l, top: t });
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [anchorRef]);

  if (!pos) return null;

  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: popW, height: popH, zIndex: 99999 }}
    >
      <div className="w-full h-full bg-transparent rounded-lg shadow-2xl overflow-hidden">
        <Suspense fallback={<div className="w-full h-full bg-black/80 flex items-center justify-center text-white">Loading...</div>}>
          <ThreePopupLazy src={src} />
        </Suspense>
      </div>
    </div>,
    document.body
  );
}
