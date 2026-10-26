'use client';

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
  CheckCircle,
  Lock
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-gray-200">
      {/* Header */}
      <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              BrandSphere AI
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
              Upload Content
            </Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">
              Review Queue
            </Link>
            <Link href="/guidelines" className="text-gray-300 hover:text-white transition-colors">
              Guidelines & KB
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          {/* Trust & AI Transparency Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium mb-6">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Disclosure: Local RAG Grounding • SOC 2 Aligned • Zero Data Retention</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent leading-tight">
            Intelligent Pre-Publication
            <br />
            Brand Governance
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Safeguarding Enterprise Credibility in the Age of Autonomous Content Creation.
            Detect ungrounded promotional claims, inconsistent brand voice, and visual discord before release with explainable citations and 1-click remediation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/upload"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2 text-base"
            >
              Start Scanning Content
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guidelines"
              className="px-8 py-4 border border-indigo-500/50 text-white rounded-lg font-semibold hover:bg-indigo-500/10 transition-all text-base flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Explore Knowledge Base
            </Link>
          </div>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <FileText className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Claim Guard & Fact Engine</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Detects promotional superlatives (&quot;#1&quot;, &quot;fastest&quot;, absolute guarantees) and verifies statements against canonical enterprise fact sheets.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <Palette className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multimodal Visual Auditor</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Extracts image color palettes using computer vision, verifies Euclidean distance against brand tokens, and checks WCAG 2.1 contrast ratios.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <Users className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Collaborative Review Studio</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Role-based persona workflows (Creator, Reviewer, Legal Admin) with 1-click remediation, version snapshots, and threaded discussion comments.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <BarChart3 className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Guideline Clarity Index</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Continuous compliance telemetry highlighting recurring policy misunderstandings and recommending iterative guideline refinements.
            </p>
          </div>
        </div>

        {/* Quantified Impact Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center p-8 rounded-2xl border border-indigo-500/20 bg-slate-900/40">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-1">80%</div>
            <div className="text-white font-medium text-sm">Review Cycle Reduction</div>
            <div className="text-gray-500 text-xs mt-1">From days to minutes via inline explainable fixes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-1">99.5%</div>
            <div className="text-white font-medium text-sm">Claim Accuracy Verification</div>
            <div className="text-gray-500 text-xs mt-1">Cross-checked with enterprise truth base</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-1">100%</div>
            <div className="text-white font-medium text-sm">Audit Compliance & Traceability</div>
            <div className="text-gray-500 text-xs mt-1">Cryptographic tamper-evident publication hashes</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500 space-y-1">
          <p className="text-gray-400 font-semibold">Team CIPHER CODERS | Ishaan Ray &amp; Rishi Prajapati | Inkloom AI Hackathon</p>
          <p>BrandSphere AI — Intelligent Pre-Publication Brand Governance Platform</p>
        </div>
      </footer>
    </div>
  );
}
