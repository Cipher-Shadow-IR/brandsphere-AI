'use client';

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Palette,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Zap,
  Check,
  ChevronRight,
  PenTool,
  Scale
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [demoStep, setDemoStep] = useState<"flagged" | "remediated">("flagged");

  return (
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20 space-y-12">
        {}
        <section className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-4">
          {}
          <div className="lg:col-span-7 clay-cushion-pink p-8 sm:p-12 flex flex-col justify-between space-y-6 border border-[#f78ec0]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fffdf7] text-[#1f1823] text-xs font-black shadow-[2px_3px_8px_rgba(56,49,57,0.08),inset_1px_1px_2px_rgba(255,255,255,0.9)] border border-[#e2dfd5]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bd216b] animate-pulse" />
                <span className="uppercase tracking-wider text-[11px]">Enterprise Governance Engine • Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1f1823] leading-[1.08]">
                Intelligent Pre-Publication
                <br />
                <span className="text-[#801344]">
                  Brand Governance
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#1f1823] max-w-xl font-bold leading-relaxed">
                Safeguard enterprise credibility in the age of autonomous content velocity. Detect ungrounded superlatives, off-brand tone drift, and visual WCAG failures before release with explainable citations and 1-click remediation.
              </p>
            </div>

            {}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/upload"
                className="clay-pill-secondary !bg-[#fffdf7] !text-[#1f1823] px-7 py-3.5 text-sm font-black flex items-center gap-2 shadow-lg border border-[#e2dfd5]"
              >
                <Sparkles className="w-4 h-4 text-[#1f1823]" />
                <span>Launch Brand Scanner</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/dashboard"
                className="clay-pill-secondary !bg-[#f1f2fa] !text-[#1f1823] px-6 py-3.5 text-sm font-black flex items-center gap-2 border border-[#d6d9ea]"
              >
                <FileText className="w-4 h-4 text-[#1f1823]" />
                <span>Operations Dashboard</span>
              </Link>
              <Link
                href="/guidelines"
                className="clay-pill-secondary !bg-[#ded0f9] !text-[#2d1b54] px-5 py-3.5 text-sm font-black flex items-center gap-2 border border-[#caaef2]"
              >
                <BookOpen className="w-4 h-4 text-[#2d1b54]" />
                <span>Rule Book</span>
              </Link>
            </div>
          </div>

          {}
          <div className="lg:col-span-5 clay-cushion !bg-[#fffdf7] p-6 sm:p-7 flex flex-col justify-between gap-4 border border-[#e2dfd5]">
            {}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f6a3ca] shadow-sm" />
                <span className="text-xs font-black text-[#1f1823] uppercase tracking-wider">
                  Live Remediation Simulator
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#e6e8f4] shadow-inner text-xs font-bold border border-[#d6d9ea]">
                <button
                  type="button"
                  onClick={() => setDemoStep("flagged")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    demoStep === "flagged"
                      ? "bg-[#ffd6e0] text-[#570f25] shadow-sm font-black border border-[#f78ec0]"
                      : "text-[#3b3240] hover:text-[#1f1823] font-bold"
                  }`}
                >
                  Flagged
                </button>
                <button
                  type="button"
                  onClick={() => setDemoStep("remediated")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    demoStep === "remediated"
                      ? "bg-[#c0efdc] text-[#0e3b27] shadow-sm font-black border border-[#9ee2c5]"
                      : "text-[#3b3240] hover:text-[#1f1823] font-bold"
                  }`}
                >
                  Certified
                </button>
              </div>
            </div>

            {}
            <div className="clay-well-cream p-4 text-xs sm:text-sm leading-relaxed text-[#1f1823] border border-[#e2dfd5] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#5a5061]">
                  Live Marketing Collateral Preview
                </span>
                <span className="text-[10px] font-bold text-[#5a5061]">v1.0 • Pre-flight</span>
              </div>
              <div className="pt-0.5">
                {demoStep === "flagged" ? (
                  <>
                    <span>&quot;BrandSphere is officially the </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#ffd6e0] text-[#570f25] font-black border border-[#f78ec0] inline-block">
                      #1 fastest cloud platform in the world!
                    </span>
                    <span> We have completely eliminated the </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#f9e7a8] text-[#473503] font-black border border-[#fae089] inline-block">
                      legacy architecture
                    </span>
                    <span> to bring you guaranteed 100% zero downtime.&quot;</span>
                  </>
                ) : (
                  <>
                    <span>&quot;BrandSphere AI delivers up to an </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#c0efdc] text-[#0e3b27] font-black border border-[#9ee2c5] inline-block">
                      80% reduction in review turnaround
                    </span>
                    <span> verified by the Inkloom 2026 Enterprise Study. Supported by certified </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#c0efdc] text-[#0e3b27] font-black border border-[#9ee2c5] inline-block">
                      Governance Framework
                    </span>
                    <span> standards.&quot;</span>
                  </>
                )}
              </div>
            </div>

            {}
            {demoStep === "flagged" ? (
              <div className="clay-cushion-yellow !rounded-2xl p-4 space-y-2.5 border border-[#fae089]">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffd6e0] text-[#570f25] text-[10px] font-black uppercase border border-[#f78ec0]">
                    Critical Claim Flag
                  </span>
                  <span className="text-[11px] font-black text-[#473503]">Claims Policy §3.2</span>
                </div>
                <p className="text-xs text-[#1f1823] font-bold leading-snug">
                  Superlative assertion detected without canonical fact benchmark citation.
                </p>
                <button
                  type="button"
                  onClick={() => setDemoStep("remediated")}
                  className="clay-pill-mint w-full py-2.5 px-3 text-xs flex items-center justify-center gap-2 font-black border border-[#9ee2c5] shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-[#0e3b27]" />
                  <span>1-Click Context Remediation</span>
                </button>
              </div>
            ) : (
              <div className="clay-cushion-mint !rounded-2xl p-4 flex items-center justify-between border border-[#9ee2c5]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#fffdf7] flex items-center justify-center shadow-sm border border-[#9ee2c5] shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#0e3b27]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0e3b27] block">Certified Compliant</span>
                    <span className="text-[10px] text-[#134e34] font-mono font-bold">SHA-256: 8F42B18E9A...</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoStep("flagged")}
                  className="text-xs font-black text-[#0e3b27] underline cursor-pointer hover:text-[#1f1823] px-2 py-1"
                >
                  Reset Demo
                </button>
              </div>
            )}

            {}
            <div className="clay-well p-3.5 rounded-2xl border border-[#d6d9ea] space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-[#5a5061]">
                <span>Transformation Audit</span>
                <span className={demoStep === "flagged" ? "text-[#570f25]" : "text-[#0e3b27]"}>
                  {demoStep === "flagged" ? "Pending Approval" : "100% Policy Aligned"}
                </span>
              </div>
              <div className="text-[11px] leading-relaxed font-mono">
                {demoStep === "flagged" ? (
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#ffd6e0] text-[#570f25] font-black line-through">
                      #1 fastest cloud platform
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5a5061] shrink-0" />
                    <span className="text-[#5a5061] italic font-sans text-xs">Awaiting ground truth citation</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#ffd6e0] text-[#570f25] font-black line-through">
                      #1 fastest platform
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0e3b27] shrink-0" />
                    <span className="px-1.5 py-0.5 rounded bg-[#c0efdc] text-[#0e3b27] font-black">
                      80% turnaround (Inkloom Study)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-2 text-center pt-0.5">
              <div className="clay-well p-2 rounded-xl border border-[#d6d9ea]">
                <span className="block text-[9px] font-bold text-[#5a5061] uppercase tracking-wider">Reading</span>
                <strong className="text-xs font-black text-[#1f1823] [font-variant-numeric:tabular-nums]">
                  {demoStep === "flagged" ? "74/100" : "82/100"}
                </strong>
              </div>
              <div className="clay-well p-2 rounded-xl border border-[#d6d9ea]">
                <span className="block text-[9px] font-bold text-[#5a5061] uppercase tracking-wider">Tone Drift</span>
                <strong className={`text-xs font-black ${demoStep === "flagged" ? "text-[#570f25]" : "text-[#0e3b27]"}`}>
                  {demoStep === "flagged" ? "Alert" : "0.0%"}
                </strong>
              </div>
              <div className="clay-well p-2 rounded-xl border border-[#d6d9ea]">
                <span className="block text-[9px] font-bold text-[#5a5061] uppercase tracking-wider">Contrast</span>
                <strong className="text-xs font-black text-[#0e3b27] [font-variant-numeric:tabular-nums]">
                  10.4:1
                </strong>
              </div>
              <div className="clay-well p-2 rounded-xl border border-[#d6d9ea]">
                <span className="block text-[9px] font-bold text-[#5a5061] uppercase tracking-wider">Status</span>
                <strong className={`text-xs font-black ${demoStep === "flagged" ? "text-[#570f25]" : "text-[#0e3b27]"}`}>
                  {demoStep === "flagged" ? "Blocked" : "Certified"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {}
          <div className="clay-cushion-mint p-5 sm:p-6 flex items-center gap-4 border border-[#9ee2c5] min-w-0 overflow-hidden">
            <div className="px-3.5 py-3 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[clamp(1.4rem,2.2vw,2rem)] font-black text-[#0e3b27] shadow-sm border border-[#9ee2c5]/60 text-center shrink-0 min-w-[76px] sm:min-w-[84px] [font-variant-numeric:tabular-nums]">
              80%
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-sm text-[#0e3b27] tracking-tight truncate sm:whitespace-normal">
                Turnaround Reduction
              </h4>
              <p className="text-xs text-[#134e34] font-bold mt-0.5 leading-snug break-words">
                Accelerated from 5 days to minutes
              </p>
            </div>
          </div>

          {}
          <div className="clay-cushion-lavender p-5 sm:p-6 flex items-center gap-4 border border-[#caaef2] min-w-0 overflow-hidden">
            <div className="px-3.5 py-3 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[clamp(1.4rem,2.2vw,2rem)] font-black text-[#2d1b54] shadow-sm border border-[#caaef2]/60 text-center shrink-0 min-w-[88px] sm:min-w-[96px] [font-variant-numeric:tabular-nums]">
              99.5%
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-sm text-[#2d1b54] tracking-tight truncate sm:whitespace-normal">
                Claim Accuracy
              </h4>
              <p className="text-xs text-[#41277a] font-bold mt-0.5 leading-snug break-words">
                Grounded against verified fact sheets
              </p>
            </div>
          </div>

          {}
          <div className="clay-cushion-yellow p-5 sm:p-6 flex items-center gap-4 border border-[#fae089] min-w-0 overflow-hidden">
            <div className="px-3.5 py-3 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[clamp(1.4rem,2.2vw,2rem)] font-black text-[#473503] shadow-sm border border-[#fae089]/60 text-center shrink-0 min-w-[76px] sm:min-w-[84px] [font-variant-numeric:tabular-nums]">
              100%
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-sm text-[#473503] tracking-tight truncate sm:whitespace-normal">
                Cryptographic Audit
              </h4>
              <p className="text-xs text-[#5e4708] font-bold mt-0.5 leading-snug break-words">
                Tamper-evident verification hash
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="clay-tray p-8 sm:p-12 space-y-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#3b3240]">
              Continuous Governance
            </span>
            <h2 className="text-3xl font-extrabold text-[#1f1823] tracking-tight mt-1">
              Core Governance Pillars
            </h2>
            <p className="text-sm text-[#3b3240] max-w-2xl mt-1">
              Engineered to detect every vector of brand entropy before publication.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {}
            <div className="lg:col-span-6 clay-cushion-blue p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[#1f1823] shadow-sm">
                  <FileText className="w-6 h-6 text-[#1f1823]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1f1823]">Claim Guard &amp; Fact Engine</h3>
                <p className="text-sm text-[#1f1823] leading-relaxed">
                  Automatically flags ungrounded promotional superlatives (&quot;fastest in the world&quot;, &quot;#1 rated&quot;) and cross-references assertions against the enterprise fact library to demand verifiable citations.
                </p>
              </div>

              <div className="clay-well p-4 text-xs font-mono text-[#1f1823]">
                Exact citation matching with approved metric tolerance.
              </div>
            </div>

            {}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div className="clay-cushion-lavender p-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fffdf7] flex items-center justify-center shadow-sm">
                    <Palette className="w-5 h-5 text-[#1f1823]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1f1823]">Multimodal Visual Auditor</h4>
                </div>
                <p className="text-xs text-[#1f1823] leading-relaxed">
                  Extracts dominant image palettes using computer vision, measures Euclidean distance from brand tokens, and checks WCAG 2.1 AA text-over-image contrast ratios (minimum 4.5:1).
                </p>
              </div>

              <div className="clay-cushion-mint p-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fffdf7] flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-[#1f1823]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1f1823]">Collaborative Review Studio</h4>
                </div>
                <p className="text-xs text-[#1f1823] leading-relaxed">
                  Role-based review workflows for Creators, Reviewers, and Legal Admins with 1-click context-preserving remediation and threaded discussion notes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="clay-cushion-lavender p-8 sm:p-12 space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3b2c5e]">
              Human-In-The-Loop Sovereignty
            </span>
            <h2 className="text-3xl font-extrabold text-[#1f1823] mt-1">
              Engineered for Every Stakeholder
            </h2>
          </div>

          <div className="space-y-4">
            {}
            <div className="clay-cushion !bg-[#fffdf7] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#1f1823]"><PenTool className="w-4 h-4 inline mr-1.5 text-[#1f1823]" />Content Creators &amp; Authors</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ded0f9] text-[#3b2c5e] text-[10px] font-bold">Instant Feedback</span>
                </div>
                <p className="text-xs text-[#3b3240] leading-relaxed">
                  Immediate pre-flight validation with context-preserving fixes instead of cryptic rejections.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#214d3b] shrink-0">
                <Check className="w-4 h-4 text-[#214d3b]" /> 1-Click fixes preserve voice
              </div>
            </div>

            {}
            <div className="clay-cushion !bg-[#fffdf7] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#1f1823]"><Shield className="w-4 h-4 inline mr-1.5 text-[#1f1823]" />Brand &amp; Compliance Leads</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c0efdc] text-[#214d3b] text-[10px] font-bold">Policy Control</span>
                </div>
                <p className="text-xs text-[#3b3240] leading-relaxed">
                  Maintain policies, terminology glossaries, and truth libraries with full audit logs.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#214d3b] shrink-0">
                <Check className="w-4 h-4 text-[#214d3b]" /> Immutable version snapshots
              </div>
            </div>

            {}
            <div className="clay-cushion !bg-[#fffdf7] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#1f1823]"><Scale className="w-4 h-4 inline mr-1.5 text-[#1f1823]" />Legal &amp; Executive Leadership</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f6a3ca] text-[#63192e] text-[10px] font-bold">Risk Shield</span>
                </div>
                <p className="text-xs text-[#3b3240] leading-relaxed">
                  Protect enterprise reputation with cryptographic SHA-256 compliance certification.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#214d3b] shrink-0">
                <Check className="w-4 h-4 text-[#214d3b]" /> Verified audit certificate
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="clay-cushion-pink p-8 sm:p-12 text-center space-y-5">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1f1823]">
            Safeguard Your Brand Today
          </h3>
          <p className="text-sm sm:text-base text-[#1f1823] max-w-xl mx-auto font-medium leading-relaxed">
            Eliminate brand entropy, accelerate review turnaround cycles, and build public trust with intelligent pre-publication governance.
          </p>
          <div className="pt-2">
            <Link
              href="/upload"
              className="clay-pill-secondary !bg-[#fffdf7] !text-[#1f1823] px-8 py-4 text-sm font-bold inline-flex items-center gap-2 shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-[#1f1823]" />
              <span>Start Pre-Publication Scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {}

      </main>
      <Footer />
    </div>
  );
}