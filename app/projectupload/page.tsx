'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectUploadPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/studio');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
        <p className="text-white text-xl">Redirecting to Project Studio...</p>
      </div>
    </div>
  );
}
