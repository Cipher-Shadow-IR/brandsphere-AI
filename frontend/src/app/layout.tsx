import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandSphere AI — Intelligent Pre-Publication Brand Governance",
  description: "AI-powered brand governance, policy scanning, and collaborative review workflows",
  icons: {
    icon: [
      { url: "/BrandSphere-AI-Logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: ["/BrandSphere-AI-Logo.png"],
    apple: ["/BrandSphere-AI-Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[#f1f2fa] text-[#1f1823] selection:bg-[#f6a3ca] selection:text-[#1f1823]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
