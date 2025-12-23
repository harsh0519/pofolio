'use client';

import { usePathname } from 'next/navigation';
import CursorProvider from "@/components/common/CursorProvider";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import GSAPNav from "@/components/layout/GSAPNav";
import PageTransition from "@/components/common/PageTransition";
import LoadingScreen from "@/components/common/LoadingScreen";
import BackgroundScene from "@/components/common/BackgroundScene";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');

  // For studio routes, render without animations
  if (isStudioRoute) {
    return <>{children}</>;
  }

  // For all other routes, render with full animations
  return (
    <>
      <BackgroundScene />
      <LoadingScreen />
      <SmoothScrollProvider>
        <CursorProvider />
        <GSAPNav />
        <PageTransition>{children}</PageTransition>
      </SmoothScrollProvider>
    </>
  );
}
