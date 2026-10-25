'use client';

import Link from "next/link";
import { Shield, FileText, Users, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              BrandSphere AI
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
              Upload Content
            </Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">
              Review Queue
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Intelligent Pre-Publication
            <br />
            Brand Governance
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Safeguarding Enterprise Credibility in the Age of Autonomous Content Creation.
            Detect issues before publication with explainable AI and human-in-the-loop control.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/upload"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
            >
              Start Scanning Content
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 border border-indigo-500/50 text-white rounded-lg font-semibold hover:bg-indigo-500/10 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <FileText className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Fact-Checking & Claims</h3>
            <p className="text-gray-400">
              Detect unsupported promotional claims and require citations from approved fact sheets
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <Shield className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Tone & Terminology</h3>
            <p className="text-gray-400">
              Harmonize brand voice and flag outdated terminology across all content
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <Users className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Collaborative Review</h3>
            <p className="text-gray-400">
              Multi-tier approval workflows with threaded comments and full audit trails
            </p>
          </div>
          <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
            <BarChart3 className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Governance Insights</h3>
            <p className="text-gray-400">
              Track recurring issues and identify guidelines that need clarification
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">80%</div>
            <div className="text-gray-400">Faster Review Cycles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">99.5%</div>
            <div className="text-gray-400">Claim Verification</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-gray-400">Audit Compliance</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
          <p>Team CIPHER CODERS | Ishaan Ray & Rishi Prajapati | Inkloom AI Hackathon</p>
        </div>
      </footer>
    </div>
  );
}
