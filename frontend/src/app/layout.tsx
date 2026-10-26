import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandSphere AI — Intelligent Pre-Publication Brand Governance",
  description: "AI-powered brand governance, policy scanning, and collaborative review workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
