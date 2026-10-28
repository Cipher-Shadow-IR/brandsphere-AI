"use client";

import Image from "next/image";

interface BrandLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLoader({
  label = "Evaluating Brand Governance Engine...",
  size = "md"
}: BrandLoaderProps) {
  const logoDimensions = size === "sm" ? 36 : size === "lg" ? 64 : 48;
  const containerPadding = size === "sm" ? "p-6" : size === "lg" ? "p-16" : "p-10";

  return (
    <div className={`clay-tray ${containerPadding} text-center text-[#1f1823] flex flex-col items-center justify-center gap-4 select-none`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing aura */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#f6a3ca] via-[#ded0f9] to-[#c0efdc] opacity-50 blur-xl animate-pulse" />
        
        {/* Soft spinning orbital ring */}
        <div className="absolute -inset-3 rounded-full border-2 border-dashed border-[#f6a3ca]/60 animate-[spin_8s_linear_infinite]" />
        
        {/* Tactile Claymorphism Logo Container */}
        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#fffdf7] border border-[#e6e8f4] shadow-[4px_6px_16px_rgba(31,24,35,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] p-2.5 flex items-center justify-center animate-bounce duration-1000">
          <Image
            src="/BrandSphere-AI-Logo.png"
            alt="BrandSphere AI Logo"
            width={logoDimensions}
            height={logoDimensions}
            className="w-full h-full object-contain rounded-xl drop-shadow-sm"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-2">
        <span className="text-sm font-extrabold text-[#1f1823] tracking-tight flex items-center gap-2">
          {label}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-[#3b3240] font-semibold">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f6a3ca] animate-ping" />
          <span>Real-time RAG &amp; Policy Verification Active</span>
        </div>
      </div>
    </div>
  );
}
