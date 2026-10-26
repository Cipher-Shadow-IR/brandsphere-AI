"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles,
  PieChart,
  HelpCircle,
  Award
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Analytics {
  overview: {
    total_documents: number;
    approved: number;
    pending_review: number;
    rejected: number;
    total_issues_flagged: number;
    avg_issues_per_doc: number;
  };
  issue_distribution: Record<string, number>;
  guideline_clarity_insights: Array<{
    guideline: string;
    frequency: number;
    recommendation: string;
  }>;
  compliance_rate_percent?: number;
  severity_breakdown?: Record<string, number>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics`)
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const exportReport = () => {
    if (!analytics) return;
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brandsphere-governance-audit-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-gray-200">
      {/* Header */}
      <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              BrandSphere AI
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">Upload Content</Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">Review Queue</Link>
            <Link href="/guidelines" className="text-gray-300 hover:text-white transition-colors">Guidelines & KB</Link>
            <Link href="/analytics" className="text-white font-medium">Analytics</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              Enterprise Governance Intelligence
            </h1>
            <p className="text-gray-400 text-sm">
              Continuous compliance telemetry, recurring policy friction hotspots, and Guideline Clarity Index
            </p>
          </div>
          <button
            onClick={exportReport}
            className="px-4 py-2.5 bg-slate-900 border border-indigo-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all self-start"
          >
            <Download className="w-4 h-4" />
            Export Audit Report (JSON)
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading governance telemetry...</div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-7 h-7 text-cyan-400" />
                  <span className="text-3xl font-bold text-white">{analytics.overview.total_documents}</span>
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Total Ingested Documents</p>
              </div>

              <div className="p-5 rounded-xl border border-green-500/30 bg-gradient-to-br from-slate-900/50 to-green-900/10">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-7 h-7 text-green-400" />
                  <span className="text-3xl font-bold text-white">{analytics.overview.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Certified Approved</p>
                  <span className="text-xs font-bold text-green-400">{analytics.compliance_rate_percent || 0}% Rate</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-slate-900/50 to-yellow-900/10">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-7 h-7 text-yellow-400" />
                  <span className="text-3xl font-bold text-white">{analytics.overview.pending_review}</span>
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Pending Review Actions</p>
              </div>

              <div className="p-5 rounded-xl border border-red-500/30 bg-gradient-to-br from-slate-900/50 to-red-900/10">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-7 h-7 text-red-400" />
                  <span className="text-3xl font-bold text-white">{analytics.overview.total_issues_flagged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Violations Detected</p>
                  <span className="text-xs font-bold text-red-400">{analytics.overview.avg_issues_per_doc} / doc</span>
                </div>
              </div>
            </div>

            {/* Severity Breakdown Bar */}
            {analytics.severity_breakdown && Object.keys(analytics.severity_breakdown).length > 0 && (
              <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white mb-3">Violation Severity Composition</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg">
                    <span className="text-xl font-bold text-red-400">{analytics.severity_breakdown["Critical"] || 0}</span>
                    <p className="text-[11px] text-gray-400 uppercase mt-0.5 font-medium">Critical (Unsubstantiated Claims)</p>
                  </div>
                  <div className="p-3 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
                    <span className="text-xl font-bold text-yellow-400">{analytics.severity_breakdown["Moderate"] || 0}</span>
                    <p className="text-[11px] text-gray-400 uppercase mt-0.5 font-medium">Moderate (Terminology / WCAG)</p>
                  </div>
                  <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-lg">
                    <span className="text-xl font-bold text-blue-400">{analytics.severity_breakdown["Advisory"] || 0}</span>
                    <p className="text-[11px] text-gray-400 uppercase mt-0.5 font-medium">Advisory (Tone / Formatting)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution and Guideline Clarity Index Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Issue Distribution by Category */}
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-cyan-400" />
                  Issue Category Distribution
                </h2>
                <div className="space-y-3">
                  {analytics.issue_distribution && Object.entries(analytics.issue_distribution).length > 0 ? (
                    Object.entries(analytics.issue_distribution).map(([type, count]) => {
                      const total = analytics.overview.total_issues_flagged || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300 capitalize font-medium">{type} Violations</span>
                            <span className="text-cyan-400 font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No issues recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Guideline Clarity Index */}
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Guideline Clarity Index (GCI)
                  </h2>
                  <span className="text-xs text-indigo-300 font-mono">Live Telemetry</span>
                </div>
                <p className="text-gray-400 text-xs mb-4">
                  Identifies specific brand policies causing the highest employee confusion, providing AI recommendations for policy refinement.
                </p>
                <div className="space-y-3">
                  {analytics.guideline_clarity_insights.map((insight, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-cyan-300 text-xs font-semibold">{insight.guideline}</span>
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold">
                          {insight.frequency} Violations
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <span className="text-indigo-400 font-medium">Actionable Refinement: </span>
                        {insight.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Horizon Callout */}
            <div className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-indigo-950/40 via-cyan-950/30 to-indigo-950/40 backdrop-blur-sm text-center">
              <h3 className="text-base font-bold text-white mb-1">
                Continuous Pre-Publication Governance Impact
              </h3>
              <p className="text-gray-400 text-xs max-w-2xl mx-auto mb-4">
                By catching ungrounded claims and visual inconsistencies before release, BrandSphere AI eliminates high-risk public corrections and protects enterprise credibility.
              </p>
              <div className="grid grid-cols-3 max-w-xl mx-auto gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">80%</div>
                  <div className="text-[11px] text-gray-400">Faster Review Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-400">99.5%</div>
                  <div className="text-[11px] text-gray-400">Claim Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">100%</div>
                  <div className="text-[11px] text-gray-400">Audit Traceability</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
