import type { Metadata } from "next";
import "./globals.css";
import CursorProvider from "@/components/common/CursorProvider";

export const metadata: Metadata = {
  title: "Portfolio | Modern Developer",
  description: "A sleek black and white portfolio showcasing modern frontend development with elegant animations and minimalist design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased custom-cursor">
        <CursorProvider />
        {children}
      </body>
    </html>
  );
}
