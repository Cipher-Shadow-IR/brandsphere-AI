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
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  Zap,
  SlidersHorizontal,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [demoStep, setDemoStep] = useState<"flagged" | "remediated">("flagged");

  return (
    <div className="min-h-screen bg-ambient-mesh text-gray-200">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Top Transparency Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-white">Responsible Brand Governance:</span>
            <span>Local RAG Grounding • Human Sovereignty • Zero Data Retention</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Intelligent Pre-Publication
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Brand Governance
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Safeguarding Enterprise Credibility in the Era of Autonomous Content Velocity.
            Eliminate ungrounded promotional superlatives, off-brand tone drift, and accessibility violations *before* release with explainable citations and 1-click remediation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/upload"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:brightness-110 text-white rounded-xl font-bold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2.5 text-base"
            >
              <Sparkles className="w-5 h-5 text-cyan-200" />
              Launch Brand Scanner
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guidelines"
              className="px-7 py-4 glass-panel glass-panel-hover text-white rounded-xl font-semibold text-base flex items-center gap-2.5"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Explore Knowledge Base
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-4 border border-indigo-500/30 hover:border-indigo-400 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        {/* Interactive Live Governance Simulator (Showcasing 1-Click Remediation) */}
        <div className="mt-14 max-w-4xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-ping opacity-75" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Live Interactive Simulation: Real-Time Governance Scan
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-900/90 p-1 rounded-lg border border-indigo-500/30">
              <button
                onClick={() => setDemoStep("flagged")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  demoStep === "flagged"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                1. Flagged Draft
              </button>
              <button
                onClick={() => setDemoStep("remediated")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  demoStep === "remediated"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                2. Remediated &amp; Certified
              </button>
            </div>
          </div>

          {demoStep === "flagged" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30 text-sm leading-relaxed text-gray-200">
                <span>&quot;BrandSphere is officially the </span>
                <mark className="bg-red-500/20 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-500/40">
                  #1 fastest cloud platform in the world!
                </mark>
                <span> We have completely eliminated the </span>
                <mark className="bg-yellow-500/20 text-yellow-300 font-semibold px-1.5 py-0.5 rounded border border-yellow-500/40">
                  legacy architecture
                </mark>
                <span> to bring you an unbeatable price with guaranteed 100% zero downtime.&quot;</span>
              </div>

              {/* Explanatory AI Citation Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      CRITICAL VIOLATION
                    </span>
                    <span className="text-xs text-cyan-300 font-mono font-semibold">
                      Brand Claims Policy §3.2 (Promotional Superlative)
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Ungrounded superlative claim detected without canonical fact sheet citation.
                  </p>
                  <p className="text-[11px] text-gray-500 italic">
                    Source: Approved Fact Sheet #4.2 — Comparative claims require verified third-party benchmarks.
                  </p>
                </div>
                <button
                  onClick={() => setDemoStep("remediated")}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 self-end sm:self-center shrink-0 transition-all active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  1-Click Context Fix
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-sm leading-relaxed text-gray-200">
                <span>&quot;BrandSphere AI delivers up to an </span>
                <mark className="bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/40">
                  80% reduction in content review cycles according to the Inkloom 2026 Enterprise Study
                </mark>
                <span>. Modernized infrastructure ensures high resilience, backed by verifiable </span>
                <mark className="bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/40">
                  Next-Gen Enterprise Hub
                </mark>
                <span> standards.&quot;</span>
              </div>

              {/* Certified Hash Badge */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Certified Compliant Release</span>
                    <span className="text-[11px] text-gray-400 font-mono">Verification: BS-SHA256-8F42B18E9A...</span>
                  </div>
                </div>
                <button
                  onClick={() => setDemoStep("flagged")}
                  className="text-xs text-gray-400 hover:text-cyan-300 underline"
                >
                  Reset demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Claim Guard &amp; Fact Engine</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Detects promotional superlatives (&quot;#1&quot;, &quot;fastest&quot;, absolute guarantees) and verifies statements against canonical enterprise fact sheets.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multimodal Visual Auditor</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Extracts image color palettes via computer vision, verifies Euclidean distance against brand tokens, and calculates WCAG 2.1 contrast compliance.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Collaborative Review Studio</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Multi-tier approval workflows (Creator, Reviewer, Legal Admin) with 1-click remediation, version snapshots, and threaded discussion comments.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Guideline Clarity Index</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Continuous compliance telemetry calculating the Guideline Clarity Index, highlighting recurring confusion, and guiding policy updates.
            </p>
          </div>
        </div>

        {/* Persona Quadrant Matrix */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Multi-Stakeholder Sovereignty
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Designed for Every Brand Stakeholder</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyan-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">✍️ Content Creators &amp; Authors</span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">Rapid Feedback</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Immediate pre-flight validation with context-preserving recommendations rather than cryptic rejections. Authors retain original voice while avoiding costly brand infractions.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                <Check className="w-4 h-4" /> 1-Click fixes preserve creative momentum
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">🛡️ Brand &amp; Compliance Managers</span>
                <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">Deterministic Policy</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Total control over brand guidelines, terminology glossaries, and truth libraries. Automated scans flag discrepancies before publishing without manual line-by-line strain.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <Check className="w-4 h-4" /> Full version snapshots and audit traceability
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">🤝 PR &amp; External Marketing Agencies</span>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">Boundary Clarity</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Agencies pre-validate campaign assets against approved tokens and fact sheets prior to client submission, cutting review turnaround from 5 days to minutes.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                <Check className="w-4 h-4" /> Color palette distance and WCAG AA verification
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">⚖️ Legal &amp; Executive Leadership</span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">Risk Mitigation</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Enterprise protection against false advertising claims and regulatory penalties. Approved publications receive a cryptographic SHA-256 certificate for complete audit defensibility.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Check className="w-4 h-4" /> Tamper-evident cryptographic verification seal
              </div>
            </div>
          </div>
        </div>

        {/* Quantified Impact Banner */}
        <div className="mt-20 glass-panel rounded-2xl p-8 border border-indigo-500/30">
          <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-indigo-500/20">
            <div className="pt-4 md:pt-0">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent mb-1 font-mono">
                80%
              </div>
              <div className="text-white font-bold text-sm">Turnaround Cycle Reduction</div>
              <div className="text-gray-400 text-xs mt-1">Review workflows accelerated from 3-5 days to minutes</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent mb-1 font-mono">
                99.5%
              </div>
              <div className="text-white font-bold text-sm">Claim Accuracy Verification</div>
              <div className="text-gray-400 text-xs mt-1">Grounded against enterprise fact sheets and approved metrics</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent mb-1 font-mono">
                100%
              </div>
              <div className="text-white font-bold text-sm">Cryptographic Audit Trail</div>
              <div className="text-gray-400 text-xs mt-1">Tamper-evident verification hash attached to every approved release</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 py-10 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <span className="font-bold text-gray-300">Team CIPHER CODERS</span> — Ishaan Ray &amp; Rishi Prajapati
            <span className="block text-gray-400 mt-0.5">Inkloom AI Hackathon • Intelligent Pre-Publication Brand Governance</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/upload" className="hover:text-white transition-colors">Scanner</Link>
            <Link href="/review" className="hover:text-white transition-colors">Review Studio</Link>
            <Link href="/guidelines" className="hover:text-white transition-colors">Knowledge Base</Link>
            <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
