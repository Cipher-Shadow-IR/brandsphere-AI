"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, BarChart3, AlertTriangle, TrendingUp, FileText } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm">
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
            <Link href="/analytics" className="text-white">Analytics</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Governance Analytics
          </h1>
          <p className="text-gray-400">Insights into brand compliance trends and guideline clarity</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : analytics ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">{analytics.overview.total_documents}</span>
                </div>
                <p className="text-gray-400 text-sm">Total Documents</p>
              </div>
              <div className="p-6 rounded-xl border border-green-500/30 bg-gradient-to-br from-slate-900/50 to-green-900/10">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">{analytics.overview.approved}</span>
                </div>
                <p className="text-gray-400 text-sm">Approved</p>
              </div>
              <div className="p-6 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-slate-900/50 to-yellow-900/10">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{analytics.overview.pending_review}</span>
                </div>
                <p className="text-gray-400 text-sm">Pending Review</p>
              </div>
              <div className="p-6 rounded-xl border border-red-500/30 bg-gradient-to-br from-slate-900/50 to-red-900/10">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <span className="text-2xl font-bold text-white">{analytics.overview.total_issues_flagged}</span>
                </div>
                <p className="text-gray-400 text-sm">Issues Flagged</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Issue Distribution</h2>
                <div className="space-y-3">
                  {analytics.issue_distribution && Object.entries(analytics.issue_distribution).length > 0 ? (
                    Object.entries(analytics.issue_distribution).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                        <span className="text-gray-300 capitalize">{type}</span>
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold">{count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">No issues recorded yet</p>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Guideline Clarity Index</h2>
                <p className="text-gray-400 text-sm mb-4">Identifies which guidelines need refinement based on frequency of violations</p>
                <div className="space-y-3">
                  {analytics.guideline_clarity_insights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm font-medium">{insight.guideline}</span>
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">{insight.frequency} violations</span>
                      </div>
                      <p className="text-xs text-gray-400">{insight.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Average Issues Per Document</h3>
              <div className="text-4xl font-bold text-cyan-400 mb-1">{analytics.overview.avg_issues_per_doc}</div>
              <p className="text-gray-400 text-sm">Helps track improvement over time</p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
