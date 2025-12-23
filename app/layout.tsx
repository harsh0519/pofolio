import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

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
      <body className="antialiased custom-cursor bg-black">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
