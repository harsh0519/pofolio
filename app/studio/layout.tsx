import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio - Content Management",
  description: "Content management system for portfolio",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
