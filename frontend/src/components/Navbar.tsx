"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Sparkles, Upload, FileText, CheckCircle2, BarChart3, BookOpen } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/upload", label: "Upload & Scan", icon: Upload },
    { href: "/review", label: "Review Studio", icon: CheckCircle2 },
    { href: "/guidelines", label: "Guidelines & KB", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="border-b border-indigo-500/20 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
              BrandSphere <span className="text-cyan-400 font-mono text-sm">AI</span>
            </span>
            <span className="block text-[10px] text-gray-400 font-mono tracking-wider uppercase">
              Pre-Publication Governance
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "text-gray-400 hover:text-gray-100 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / System Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-indigo-500/25 text-[11px] text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="font-mono text-gray-400">Policy Engine:</span>
            <span className="text-emerald-300 font-medium">Online</span>
          </div>

          <Link
            href="/upload"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:brightness-110 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            Scan Copy
          </Link>
        </div>
      </div>
    </header>
  );
}
