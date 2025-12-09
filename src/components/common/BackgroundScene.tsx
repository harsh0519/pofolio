'use client';

import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false });

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-screen -z-10 opacity-60">
      <Scene3D />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
    </div>
  );
}
