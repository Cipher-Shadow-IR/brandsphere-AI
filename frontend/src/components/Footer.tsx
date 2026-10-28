"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[#d8dae8] bg-[#f7f8fd] text-[#1f1823] transition-colors" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#e2e4ef]">
          
          {/* Brand & Mission Column (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#fffdf7] shadow-[2px_4px_12px_rgba(31,24,35,0.06),inset_1px_1px_3px_rgba(255,255,255,0.9),inset_-1px_-1px_3px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform border border-[#e2e4ef] p-1">
                <Image
                  src="/BrandSphere-AI-Logo.png"
                  alt="BrandSphere AI Logo"
                  width={34}
                  height={34}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1f1823] tracking-tight flex items-center gap-1.5">
                  BrandSphere <span className="px-1.5 py-0.5 rounded-md bg-[#ded0f9] text-[#2d1b54] text-[10px] font-black uppercase tracking-wider border border-[#caaef2]">AI</span>
                </span>
                <span className="text-[10px] text-[#695f70] font-bold tracking-wider uppercase">
                  Pre-Publication Brand Governance
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#453c4c] leading-relaxed max-w-sm">
              Empowering enterprise creators and compliance stewards to evaluate brand consistency, factual veracity, and design tokens before collateral goes live.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c0efdc] text-[#11402d] text-[11px] font-bold border border-[#9ee2c5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#11402d]" />
                Zero-Retention Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fffdf7] text-[#524959] text-[11px] font-semibold border border-[#d8daeb]">
                <Sparkles className="w-3 h-3 text-[#f6a3ca]" />
                v1.2.0
              </span>
            </div>
          </div>

          {/* Product Navigation Column (Col 6-7) */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1f1823]">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#524959]">
              <li>
                <Link href="/dashboard" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Dashboard</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Upload &amp; Scan</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Review Studio</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Analytics &amp; SLA</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Resources Column (Col 8-9) */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1f1823]">
              Governance
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#524959]">
              <li>
                <Link href="/guidelines" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Policy Engine</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Certified Facts</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Brand Glossary</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1 group">
                  <span>Design Tokens</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#f6a3ca]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Engineering Team & Attribution Column (Col 10-12) */}
          <div className="md:col-span-3 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1f1823] flex items-center gap-1.5">
              <span>Architecture &amp; Team</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-[#fffdf7] border border-[#e2e4ef] shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#1f1823]">CIPHER CODERS</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ded0f9] text-[#2d1b54] text-[10px] font-bold">Round 2</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#453c4c]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1f1823]">Ishaan Ray</span>
                  <span className="text-[#695f70]">Team Leader</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1f1823]">Rishi Prajapati</span>
                  <span className="text-[#695f70]">Research &amp; Validation</span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-[#f1f2fa] flex items-center gap-1.5 text-[10px] text-[#695f70]">
                <Terminal className="w-3 h-3 text-[#695f70]" />
                <span>CODESTAR 30 • Inkloom AI</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#695f70]">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} BrandSphere AI.</span>
            <span className="text-[#b4b7c8]">•</span>
            <span>Intelligent Pre-Publication Brand Governance Platform.</span>
          </div>

          <div className="flex items-center gap-5 font-semibold text-[#453c4c]">
            <Link href="/guidelines" className="hover:text-[#1f1823] transition-colors">
              Compliance Terms
            </Link>
            <Link href="/analytics" className="hover:text-[#1f1823] transition-colors">
              SLA Telemetry
            </Link>
            <a
              href="https://github.com/Cipher-Shadow-IR/brandsphere-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1f1823] transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-[#695f70]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
