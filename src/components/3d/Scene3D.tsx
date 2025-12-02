'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface MousePosition {
  x: number;
  y: number;
}

function AnimatedSphere({ mousePosition }: { mousePosition: MousePosition }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Base rotation with time
      const baseRotationX = state.clock.getElapsedTime() * 0.2;
      const baseRotationY = state.clock.getElapsedTime() * 0.3;

      // Add mouse-influenced rotation (inverted for natural feel)
      const targetRotationX = baseRotationX + mousePosition.y * 0.5;
      const targetRotationY = baseRotationY + mousePosition.x * 0.5;

      // Smooth interpolation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.05
      );
    }

    // Pulsing glow effect
    if (glowRef.current) {
      const scale = 2.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      {/* Outer glow sphere */}
      <Sphere ref={glowRef} args={[1, 64, 64]} scale={2.8}>
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.15} />
      </Sphere>

      {/* Main sphere with enhanced materials */}
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
        <MeshDistortMaterial
          color="#A78BFA"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={1}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Sparkles around sphere */}
      <Sparkles
        count={100}
        scale={6}
        size={2}
        speed={0.4}
        opacity={0.6}
        color=" #EF4444"
      />
    </Float>
  );
}

function ParticleField() {
  const points = useMemo(() => {
    const p = new Array(500).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      color: Math.random() > 0.5 ? '#8B5CF6' : ' #EF4444',
    }));
    return p;
  }, []);

  return (
    <group>
      {points.map((point, i) => (
        <mesh key={i} position={point.position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={point.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#A78BFA" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color=" #EF4444" />
        <pointLight position={[0, 5, 5]} intensity={1} color="#8B5CF6" />

        <AnimatedSphere mousePosition={mousePosition} />
        <ParticleField />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
}
