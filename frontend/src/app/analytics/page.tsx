"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  BarChart3,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Download,
  Sparkles,
  PieChart,
  Loader2,
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
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f6a3ca] text-[#1f1823] text-xs font-bold shadow-sm mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Executive Compliance Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1f1823] tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#1f1823]" />
              Enterprise Governance Intelligence
            </h1>
            <p className="text-[#3b3240] text-sm mt-1 max-w-2xl">
              Continuous compliance telemetry, recurring policy friction hotspots, and Guideline Clarity Index across enterprise content.
            </p>
          </div>

          <button
            type="button"
            onClick={exportReport}
            className="clay-pill-secondary px-5 py-2.5 text-xs flex items-center gap-2 self-start cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1f1823]" />
            <span>Export Audit Report (JSON)</span>
          </button>
        </div>

        {loading ? (
          <div className="clay-tray p-20 text-center text-[#3b3240] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-[#f6a3ca] border-t-transparent animate-spin" />
            <span className="text-sm font-bold">Aggregating governance telemetry...</span>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {}
              <div className="clay-cushion-blue p-5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[#1f1823] shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-[#1f1823]">{analytics.overview.total_documents}</span>
                </div>
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-[#1f1823]">Total Documents</p>
                  <p className="text-[11px] text-[#1f1823]/80 mt-0.5">Across all content pipelines</p>
                </div>
              </div>

              {}
              <div className="clay-cushion-mint p-5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[#214d3b] shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-[#214d3b]">{analytics.overview.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-[#214d3b]">Certified Approved</p>
                  <span className="text-xs font-black text-[#214d3b]">
                    {analytics.compliance_rate_percent || 0}% Rate
                  </span>
                </div>
              </div>

              {}
              <div className="clay-cushion-yellow p-5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[#59470c] shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-[#59470c]">{analytics.overview.pending_review}</span>
                </div>
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-[#59470c]">Pending Review</p>
                  <p className="text-[11px] text-[#59470c]/80 mt-0.5">Awaiting reviewer sign-off</p>
                </div>
              </div>

              {}
              <div className="clay-cushion-pink p-5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#fffdf7] flex items-center justify-center text-[#63192e] shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-[#63192e]">{analytics.overview.total_issues_flagged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-[#63192e]">Violations Flagged</p>
                  <span className="text-xs font-black text-[#63192e]">
                    {analytics.overview.avg_issues_per_doc} / doc
                  </span>
                </div>
              </div>
            </div>

            {}
            {analytics.severity_breakdown && Object.keys(analytics.severity_breakdown).length > 0 && (
              <div className="clay-cushion !bg-[#fffdf7] !rounded-[32px] p-6 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#3b3240]">
                  Violation Severity Composition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="clay-cushion !bg-[#ffd6e0] !rounded-2xl p-4">
                    <span className="text-2xl font-black text-[#63192e]">{analytics.severity_breakdown["Critical"] || 0}</span>
                    <p className="text-xs font-extrabold text-[#63192e] mt-1">Critical Severity</p>
                    <p className="text-[10px] text-[#63192e]/80 mt-0.5">Ungrounded / Unsubstantiated claims</p>
                  </div>
                  <div className="clay-cushion !bg-[#f9e7a8] !rounded-2xl p-4">
                    <span className="text-2xl font-black text-[#59470c]">{analytics.severity_breakdown["Moderate"] || 0}</span>
                    <p className="text-xs font-extrabold text-[#59470c] mt-1">Moderate Severity</p>
                    <p className="text-[10px] text-[#59470c]/80 mt-0.5">Deprecated terms &amp; visual WCAG ratio</p>
                  </div>
                  <div className="clay-cushion !bg-[#c5e5fb] !rounded-2xl p-4">
                    <span className="text-2xl font-black text-[#1c4b69]">{analytics.severity_breakdown["Advisory"] || 0}</span>
                    <p className="text-xs font-extrabold text-[#1c4b69] mt-1">Advisory Severity</p>
                    <p className="text-[10px] text-[#1c4b69]/80 mt-0.5">Tone calibration &amp; readability polish</p>
                  </div>
                </div>
              </div>
            )}

            {}
            <div className="grid lg:grid-cols-2 gap-6">
              {}
              <div className="clay-tray p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4]">
                  <h2 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#f6a3ca]" />
                    <span>Issue Category Distribution</span>
                  </h2>
                  <span className="text-xs text-[#3b3240] font-bold">
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
                            <span className="text-[#1f1823] capitalize font-bold">{type} Violations</span>
                            <span className="text-[#1f1823] font-black">
                              {count} <span className="text-[#3b3240] font-normal">({pct}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-3 bg-[#f1f2fa] rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-[#f6a3ca] rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[#3b3240] text-center py-8 text-xs">No issue telemetry recorded yet.</p>
                  )}
                </div>
              </div>

              {}
              <div className="clay-tray p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4]">
                  <h2 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#f6a3ca]" />
                    <span>Guideline Clarity Index (GCI)</span>
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#ded0f9] text-[#3b2c5e] font-bold">
                    Live Telemetry
                  </span>
                </div>

                <p className="text-xs text-[#3b3240]">
                  Identifies specific brand policies causing the highest team friction, delivering recommendations for policy refinement.
                </p>

                <div className="space-y-3 pt-1">
                  {analytics.guideline_clarity_insights.map((insight, idx) => (
                    <div key={idx} className="clay-cushion !bg-[#fffdf7] !rounded-[24px] p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1f1823] text-xs font-extrabold">{insight.guideline}</span>
                        <span className="px-2.5 py-0.5 bg-[#ffd6e0] text-[#63192e] rounded-full text-[10px] font-bold">
                          {insight.frequency} Violations
                        </span>
                      </div>
                      <p className="text-xs text-[#3b3240] leading-relaxed">
                        <strong className="text-[#1f1823]">Refinement: </strong>
                        {insight.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="clay-cushion-pink p-8 sm:p-10 text-center space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1f1823]">
                  Continuous Pre-Publication Governance Impact
                </h3>
                <p className="text-xs sm:text-sm text-[#1f1823]/90 max-w-2xl mx-auto mt-1 font-medium leading-relaxed">
                  By catching ungrounded claims and visual inconsistencies before release, BrandSphere AI eliminates costly public corrections and protects corporate brand equity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto gap-4 pt-2">
                <div className="clay-cushion !bg-[#fffdf7] p-4 !rounded-2xl">
                  <div className="text-3xl font-black text-[#1f1823]">80%</div>
                  <div className="text-xs font-extrabold text-[#1f1823] mt-1">Faster Review Turnaround</div>
                  <div className="text-[10px] text-[#3b3240]">From days to minutes with 1-click fixes</div>
                </div>
                <div className="clay-cushion !bg-[#fffdf7] p-4 !rounded-2xl">
                  <div className="text-3xl font-black text-[#1f1823]">99.5%</div>
                  <div className="text-xs font-extrabold text-[#1f1823] mt-1">Claim Grounding Accuracy</div>
                  <div className="text-[10px] text-[#3b3240]">Grounded against verified facts</div>
                </div>
                <div className="clay-cushion !bg-[#fffdf7] p-4 !rounded-2xl">
                  <div className="text-3xl font-black text-[#1f1823]">100%</div>
                  <div className="text-xs font-extrabold text-[#1f1823] mt-1">Audit Traceability</div>
                  <div className="text-[10px] text-[#3b3240]">Cryptographically verifiable certificates</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}