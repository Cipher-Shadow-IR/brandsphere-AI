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
  Award,
  Loader2,
  ArrowUpRight,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      <div className="fixed inset-0 bg-ambient-mesh pointer-events-none" />

      {/* Reusable Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              Executive Compliance Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-7 h-7 text-cyan-400" />
              Enterprise Governance Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Continuous compliance telemetry, recurring policy friction hotspots, and Guideline Clarity Index across enterprise content.
            </p>
          </div>

          <button
            onClick={exportReport}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-cyan-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all self-start cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Audit Report (JSON)</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm">Aggregating governance telemetry...</span>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Documents */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-3xl font-black text-white">{analytics.overview.total_documents}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Ingested Documents</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Across all content pipelines</p>
                </div>
              </div>

              {/* Certified Approved */}
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-black text-white">{analytics.overview.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Certified Approved</p>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {analytics.compliance_rate_percent || 0}% Rate
                  </span>
                </div>
              </div>

              {/* Pending Review Actions */}
              <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-3xl font-black text-white">{analytics.overview.pending_review}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Pending Review</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">Awaiting reviewer sign-off</p>
                </div>
              </div>

              {/* Violations Flagged */}
              <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-rose-400" />
                  </div>
                  <span className="text-3xl font-black text-white">{analytics.overview.total_issues_flagged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Violations Flagged</p>
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    {analytics.overview.avg_issues_per_doc} / doc
                  </span>
                </div>
              </div>
            </div>

            {/* Severity Breakdown Bar */}
            {analytics.severity_breakdown && Object.keys(analytics.severity_breakdown).length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Violation Severity Composition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <span className="text-2xl font-black text-rose-400">{analytics.severity_breakdown["Critical"] || 0}</span>
                    <p className="text-xs font-semibold text-rose-200 mt-1">Critical Severity</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ungrounded / Unsubstantiated claims</p>
                  </div>
                  <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                    <span className="text-2xl font-black text-amber-400">{analytics.severity_breakdown["Moderate"] || 0}</span>
                    <p className="text-xs font-semibold text-amber-200 mt-1">Moderate Severity</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Deprecated terms & visual WCAG ratio</p>
                  </div>
                  <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl">
                    <span className="text-2xl font-black text-cyan-400">{analytics.severity_breakdown["Advisory"] || 0}</span>
                    <p className="text-xs font-semibold text-cyan-200 mt-1">Advisory Severity</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tone calibration & readability polish</p>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution and Guideline Clarity Index Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Issue Distribution by Category */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-cyan-400" />
                    <span>Issue Category Distribution</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {analytics.overview.total_issues_flagged} Total
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  {analytics.issue_distribution && Object.entries(analytics.issue_distribution).length > 0 ? (
                    Object.entries(analytics.issue_distribution).map(([type, count]) => {
                      const total = analytics.overview.total_issues_flagged || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={type} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-200 capitalize font-medium">{type} Violations</span>
                            <span className="text-cyan-400 font-mono font-bold">
                              {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-center py-8 text-xs">No issue telemetry recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Guideline Clarity Index */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>Guideline Clarity Index (GCI)</span>
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/25">
                    Live Telemetry
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Identifies specific brand policies causing the highest team friction, delivering prescriptive suggestions for policy refinement.
                </p>

                <div className="space-y-3 pt-1">
                  {analytics.guideline_clarity_insights.map((insight, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-300 text-xs font-semibold">{insight.guideline}</span>
                        <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-bold">
                          {insight.frequency} Violations
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="text-indigo-400 font-medium">Refinement: </span>
                        {insight.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Horizon Callout */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-indigo-950/40 via-cyan-950/30 to-indigo-950/40 shadow-xl text-center space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Continuous Pre-Publication Governance Impact
                </h3>
                <p className="text-slate-400 text-xs max-w-2xl mx-auto mt-1">
                  By catching ungrounded claims and visual inconsistencies before release, BrandSphere AI eliminates costly public corrections and protects corporate brand equity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-3xl font-black text-cyan-400">80%</div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">Faster Review Turnaround</div>
                  <div className="text-[10px] text-slate-500">From days to minutes with 1-click fixes</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-3xl font-black text-indigo-400">99.5%</div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">Claim Grounding Accuracy</div>
                  <div className="text-[10px] text-slate-500">Grounded against verified facts</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-3xl font-black text-emerald-400">100%</div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">Audit Traceability</div>
                  <div className="text-[10px] text-slate-500">Cryptographically verifiable certificates</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
