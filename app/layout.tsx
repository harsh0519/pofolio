import type { Metadata } from "next";
import "./globals.css";
import CursorProvider from "@/components/common/CursorProvider";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import GSAPNav from "@/components/layout/GSAPNav";
import PageTransation from "@/components/common/PageTransition";
import LoadingScreen from "@/components/common/LoadingScreen";

export const metadata: Metadata = {
  title: "Harsh Kumar - Web Developer & 3D Enthusiast",
  description: "Immersive portfolio showcasing cutting-edge web development with 3D animations, GSAP, and modern design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased custom-cursor">
        <LoadingScreen />
        <SmoothScrollProvider>
          <CursorProvider />
          <GSAPNav />
          <PageTransation>{children}</PageTransation>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
