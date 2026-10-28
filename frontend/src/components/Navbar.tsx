"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  BarChart3,
  BookOpen,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/upload", label: "Upload & Scan", icon: Upload },
    { href: "/review", label: "Review Studio", icon: CheckCircle2 },
    { href: "/guidelines", label: "Guidelines & KB", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-3.5 bg-[#f1f2fa]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between clay-cushion !rounded-[28px] !bg-[#fffdf7]">
        {}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#fffdf7] shadow-[3px_5px_12px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-transform border border-[#e6e8f4] overflow-hidden p-1">
            <Image
              src="/BrandSphere-AI-Logo.png"
              alt="BrandSphere AI Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-black text-[#1f1823] tracking-tight">
              BrandSphere <span className="text-[#1f1823] px-2 py-0.5 rounded-full bg-[#ded0f9] text-xs font-black uppercase shadow-inner border border-[#caaef2]">AI</span>
            </span>
            <span className="block text-[10px] text-[#3b3240] font-bold tracking-wider uppercase">
              Pre-Publication Governance
            </span>
          </div>
        </Link>

        {}
        <nav className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-full bg-[#e6e8f4] shadow-[inset_2px_2px_5px_rgba(56,49,57,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.95)]">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all duration-200 ${
                  isActive
                    ? "bg-[#ded0f9] text-[#1f1823] font-black shadow-[2px_4px_10px_rgba(222,208,249,0.5),inset_2px_2px_3px_rgba(255,255,255,0.85),inset_-2px_-2px_3px_rgba(121,99,167,0.18)] border border-[#caaef2]"
                    : "text-[#3b3240] font-bold hover:text-[#1f1823] hover:bg-[#fffdf7]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#1f1823]" : "text-[#3b3240]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c0efdc] text-xs font-black text-[#0e3b27] shadow-[2px_3px_8px_rgba(192,239,220,0.45),inset_2px_2px_3px_rgba(255,255,255,0.9),inset_-2px_-2px_3px_rgba(71,153,120,0.18)] border border-[#9ee2c5]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0e3b27] animate-pulse" />
            <span>Policy Engine Active</span>
          </div>

          {}
          <Link
            href="/upload"
            className="hidden sm:inline-flex clay-pill-primary px-5 py-2.5 text-xs items-center gap-2 text-[#1f1823] font-black"
          >
            <Sparkles className="w-4 h-4 text-[#1f1823]" />
            <span>Scan Copy</span>
          </Link>

          {}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex xl:hidden items-center justify-center w-10 h-10 rounded-2xl bg-[#e6e8f4] text-[#1f1823] shadow-[3px_4px_10px_rgba(56,49,57,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_3px_rgba(56,49,57,0.1)] hover:bg-[#fffdf7] transition-all focus:outline-none focus:ring-2 focus:ring-[#f6a3ca] cursor-pointer active:scale-95 border border-[#d6d9ea]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[#1f1823]" />
            ) : (
              <Menu className="w-5 h-5 text-[#1f1823]" />
            )}
          </button>
        </div>
      </div>

      {}
      {isMenuOpen && (
        <div className="max-w-7xl mx-auto mt-2 px-2">
          <div className="clay-cushion !rounded-[32px] !bg-[#fffdf7] p-6 shadow-2xl transition-all space-y-4 border border-[#e2dfd5]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4] text-xs">
              <span className="text-[#3b3240] font-black uppercase tracking-wider text-[11px]">
                BrandSphere Navigation
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c0efdc] text-[#0e3b27] font-black text-xs shadow-inner border border-[#9ee2c5]">
                <span className="w-2 h-2 rounded-full bg-[#0e3b27] animate-pulse" />
                <span>Policy Engine Active</span>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      isActive
                        ? "clay-cushion-lavender !rounded-2xl border border-[#caaef2] text-[#1f1823]"
                        : "bg-[#e6e8f4] text-[#1f1823] hover:bg-[#ded0f9] rounded-2xl shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(56,49,57,0.08)] border border-[#d6d9ea]"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#fffdf7] text-[#1f1823] shadow-sm border border-[#e2dfd5]">
                      <Icon className="w-4 h-4 text-[#1f1823]" />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {}
            <div className="pt-3 border-t border-[#e6e8f4] flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/upload"
                onClick={() => setIsMenuOpen(false)}
                className="w-full sm:flex-1 py-3 px-5 clay-pill-primary text-center text-xs flex items-center justify-center gap-2 text-[#1f1823] font-black"
              >
                <Sparkles className="w-4 h-4 text-[#1f1823]" />
                <span>Scan New Content</span>
              </Link>
              <Link
                href="/review"
                onClick={() => setIsMenuOpen(false)}
                className="w-full sm:w-auto py-3 px-5 clay-pill-secondary text-center text-xs text-[#1f1823] font-black"
              >
                Open Review Studio
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}