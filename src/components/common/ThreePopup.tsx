"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function ThreePopup({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameId = useRef<number | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [mounted, setMounted] = useState(false);

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
      { x: 1, y: 1, z: 1, duration: 0.45, ease: "power3.out" }
    );

    gsap.fromTo(
      mesh.rotation,
      { x: -0.2, y: 0.2, z: 0 },
      { x: 0, y: 0, z: 0, duration: 0.6, ease: "power4.out" }
    );

    return () => {
      if (mesh) gsap.to(mesh.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.25 });
    };
  }, [mounted]);

  return (
    <div ref={containerRef} className="relative w-80 h-96 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
        className="absolute left-1 top-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] bg-white border rounded-md"
        title="Resume Preview 3D"
      />
    </div>
  );
}
