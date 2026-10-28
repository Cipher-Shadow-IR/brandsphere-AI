"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e2e4ef] bg-[#fafafc] text-[#1f1823] overflow-hidden">
      {/* Top CTA & Invite Row — Mirroring Minimalist Aesthetic */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-14 border-b border-[#e6e8f4]">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1f1823] tracking-tight font-serif">
              Your Brand awaits.
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-xs sm:text-sm text-[#3b3240] leading-relaxed">
              BrandSphere AI is in enterprise release preview. Protect reputation at scale, eliminate unverified claims, and harmonize global brand voice before publication.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f1823] text-[#fffdf7] text-xs font-black tracking-wider uppercase hover:bg-[#3b2c5e] transition-colors shadow-sm"
              >
                <span>Audit Content Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/guidelines"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#d8daeb] bg-[#ffffff] text-xs font-extrabold text-[#1f1823] hover:bg-[#f1f2fa] transition-colors"
              >
                <span>Knowledge Base</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Metadata & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 pb-6 text-xs text-[#524959] leading-relaxed">
          <div>
            <p className="max-w-lg text-[11px] text-[#695f70] leading-normal">
              The work on this platform was architected and built by <strong>Team CIPHER CODERS</strong>: Ishaan Ray &amp; Rishi Prajapati for the Inkloom AI Hackathon (CODESTAR 30). Automated brand governance powered by deterministic rule engines, embedded vector RAG, and multimodal computer vision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between md:justify-end items-start sm:items-center gap-6 text-[11px]">
            <div className="flex items-center gap-4 text-[#1f1823] font-bold">
              <Link href="/dashboard" className="hover:text-[#f6a3ca] transition-colors">Dashboard</Link>
              <Link href="/upload" className="hover:text-[#f6a3ca] transition-colors">Scanner</Link>
              <Link href="/review" className="hover:text-[#f6a3ca] transition-colors">Review Studio</Link>
              <Link href="/guidelines" className="hover:text-[#f6a3ca] transition-colors">Policy Hub</Link>
              <Link href="/analytics" className="hover:text-[#f6a3ca] transition-colors">Telemetry</Link>
            </div>
            <div className="text-[#877d8e] font-mono">
              &copy; 2026 BrandSphere AI. Team CIPHER CODERS.
            </div>
          </div>
        </div>
      </div>

      {/* Massive Debossed Aesthetic Watermark "BRANDSPHERE" */}
      <div className="relative select-none pointer-events-none w-full overflow-hidden flex justify-center items-center py-2 sm:py-4">
        <span
          className="text-[14vw] sm:text-[15vw] md:text-[16vw] font-black uppercase tracking-tighter leading-none font-serif text-transparent"
          style={{
            WebkitTextStroke: "1.5px rgba(31, 24, 35, 0.12)",
            textShadow: "1px 2px 0px rgba(255, 255, 255, 0.95), -1px -1px 0px rgba(31, 24, 35, 0.08)"
          }}
        >
          BRANDSPHERE
        </span>
      </div>
    </footer>
  );
}
