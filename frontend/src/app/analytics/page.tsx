import BrandLoader from "@/components/BrandLoader";
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
  Info,
  ChevronDown
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

  const [exportOpen, setExportOpen] = useState(false);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const handleExport = (format: "json" | "pdf" | "md" | "word" | "csv") => {
    if (!analytics) return;
    const dateStr = new Date().toISOString().split("T")[0];

    if (format === "json") {
      downloadFile(JSON.stringify(analytics, null, 2), `brandsphere-audit-${dateStr}.json`, "application/json");
    } else if (format === "md") {
      const issueLines = Object.entries(analytics.issue_distribution || {})
        .map(([cat, count]) => `- **${cat.toUpperCase()}:** ${count} violations`)
        .join("\n");
      const clarityLines = analytics.guideline_clarity_insights
        .map((g, i) => `### ${i + 1}. ${g.guideline}\n- **Friction Count:** ${g.frequency} violations\n- **AI Recommendation:** ${g.recommendation}\n`)
        .join("\n");
      const md = `# BrandSphere AI - Governance & Compliance Audit Report
**Date:** ${dateStr}  
**Status:** Certified Audit  
**Total Ingested Documents:** ${analytics.overview.total_documents}  
**Approved Rate:** ${analytics.compliance_rate_percent || 0}%  

---

## 1. Executive Metrics Overview
| Metric | Value |
| :--- | :--- |
| Total Ingested Documents | ${analytics.overview.total_documents} |
| Approved / Certified | ${analytics.overview.approved} |
| Pending Review | ${analytics.overview.pending_review} |
| Rejected | ${analytics.overview.rejected} |
| Total Violations Flagged | ${analytics.overview.total_issues_flagged} |
| Average Issues Per Document | ${analytics.overview.avg_issues_per_doc} |

---

## 2. Issue Distribution by Category
${issueLines}

---

## 3. Guideline Clarity Index (GCI) & Recommendations
${clarityLines}

---
*Report generated automatically by BrandSphere AI Enterprise Governance Engine.*
`;
      downloadFile(md, `brandsphere-audit-${dateStr}.md`, "text/markdown");
    } else if (format === "csv") {
      let csv = "Category,Metric,Value\n";
      csv += `Overview,Total Documents,${analytics.overview.total_documents}\n`;
      csv += `Overview,Approved,${analytics.overview.approved}\n`;
      csv += `Overview,Pending Review,${analytics.overview.pending_review}\n`;
      csv += `Overview,Rejected,${analytics.overview.rejected}\n`;
      csv += `Overview,Total Issues Flagged,${analytics.overview.total_issues_flagged}\n`;
      csv += `Overview,Compliance Rate %,${analytics.compliance_rate_percent || 0}\n`;
      Object.entries(analytics.issue_distribution || {}).forEach(([cat, val]) => {
        csv += `Issue Distribution,${cat},${val}\n`;
      });
      analytics.guideline_clarity_insights.forEach(g => {
        csv += `Guideline Clarity,${g.guideline.replace(/,/g, ' ')},${g.frequency} violations - "${g.recommendation.replace(/"/g, '""')}"\n`;
      });
      downloadFile(csv, `brandsphere-audit-${dateStr}.csv`, "text/csv");
    } else if (format === "word") {
      const issueRows = Object.entries(analytics.issue_distribution || {})
        .map(([k, v]) => `<tr><td>${k.toUpperCase()}</td><td>${v}</td></tr>`)
        .join("");
      const clarityRows = analytics.guideline_clarity_insights
        .map(g => `<p><strong>${g.guideline}</strong> (${g.frequency} violations)<br/><em>Recommendation:</em> ${g.recommendation}</p>`)
        .join("");
      const docContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BrandSphere Audit Report</title>
<style>
body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #1f1823; }
h1 { color: #3b3240; border-bottom: 2px solid #f6a3ca; padding-bottom: 8px; }
h2 { color: #4F46E5; margin-top: 24px; }
table { border-collapse: collapse; width: 100%; margin-top: 12px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f1f2fa; }
.badge { background: #f6a3ca; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
</style>
</head>
<body>
<h1>BrandSphere AI - Executive Governance Audit Report</h1>
<p><strong>Generated Date:</strong> ${dateStr} | <strong>Compliance Rate:</strong> <span class="badge">${analytics.compliance_rate_percent || 0}% Certified</span></p>

<h2>1. Executive Summary</h2>
<table>
<tr><th>Metric</th><th>Count</th></tr>
<tr><td>Total Documents</td><td>${analytics.overview.total_documents}</td></tr>
<tr><td>Approved Releases</td><td>${analytics.overview.approved}</td></tr>
<tr><td>Pending Review</td><td>${analytics.overview.pending_review}</td></tr>
<tr><td>Rejected</td><td>${analytics.overview.rejected}</td></tr>
<tr><td>Total Governance Issues</td><td>${analytics.overview.total_issues_flagged}</td></tr>
<tr><td>Avg Issues Per Doc</td><td>${analytics.overview.avg_issues_per_doc}</td></tr>
</table>

<h2>2. Violation Categories</h2>
<table>
<tr><th>Category</th><th>Count</th></tr>
${issueRows}
</table>

<h2>3. Guideline Clarity Index (GCI) Recommendations</h2>
${clarityRows}
</body>
</html>`;
      downloadFile(docContent, `brandsphere-audit-${dateStr}.doc`, "application/msword");
    } else if (format === "pdf") {
      const issuePdfRows = Object.entries(analytics.issue_distribution || {})
        .map(([k, v]) => `<tr><td>${k.toUpperCase()}</td><td>${v}</td><td>${Math.round((v / (analytics.overview.total_issues_flagged || 1)) * 100)}%</td></tr>`)
        .join("");
      const clarityPdfBoxes = analytics.guideline_clarity_insights
        .map(g => `<div class="recommendation-box"><strong>${g.guideline}</strong> (${g.frequency} violations)<br/><span style="color:#334155;">${g.recommendation}</span></div>`)
        .join("");

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<title>BrandSphere AI Governance Audit - ${dateStr}</title>
<style>
@page { size: A4; margin: 20mm; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f1823; margin: 0; padding: 20px; }
.header { border-bottom: 2px solid #1f1823; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 24px; font-weight: 800; }
.badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.kpi-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; }
.kpi-val { font-size: 22px; font-weight: bold; margin-top: 4px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
th { background: #f1f5f9; font-weight: bold; }
.recommendation-box { background: #fdf2f8; border-left: 4px solid #ec4899; padding: 10px 14px; margin-bottom: 10px; border-radius: 4px; font-size: 13px; }
@media print { button { display: none; } }
</style>
</head>
<body>
<div class="header">
<div>
  <div class="title">BrandSphere AI — Enterprise Audit Report</div>
  <div style="color: #64748b; font-size: 12px; margin-top: 4px;">Pre-Publication Brand Governance & Telemetry • Date: ${dateStr}</div>
</div>
<div class="badge">Compliance Rate: ${analytics.compliance_rate_percent || 0}%</div>
</div>

<div class="kpi-grid">
<div class="kpi-box"><small style="color:#64748b;">Total Documents</small><div class="kpi-val">${analytics.overview.total_documents}</div></div>
<div class="kpi-box"><small style="color:#64748b;">Approved Releases</small><div class="kpi-val" style="color:#16a34a;">${analytics.overview.approved}</div></div>
<div class="kpi-box"><small style="color:#64748b;">Pending Review</small><div class="kpi-val" style="color:#d97706;">${analytics.overview.pending_review}</div></div>
<div class="kpi-box"><small style="color:#64748b;">Total Violations Flagged</small><div class="kpi-val" style="color:#dc2626;">${analytics.overview.total_issues_flagged}</div></div>
</div>

<h3 style="font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">1. Issue Distribution by Category</h3>
<table>
<thead><tr><th>Violation Type</th><th>Count</th><th>Percentage</th></tr></thead>
<tbody>
${issuePdfRows}
</tbody>
</table>

<h3 style="font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">2. Guideline Clarity Index (GCI) Recommendations</h3>
${clarityPdfBoxes}

<script>
window.onload = function() { window.print(); }
</script>
</body>
</html>`);
        printWindow.document.close();
      }
      setExportOpen(false);
    }
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

          <div className="relative self-start">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="clay-pill-secondary px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-sm font-bold"
            >
              <Download className="w-4 h-4 text-[#1f1823]" />
              <span>Export Audit Report</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#fffdf7] border-2 border-[#1f1823] shadow-xl z-50 p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#3b3240] border-b border-[#1f1823]/10 mb-1">
                  Select Export Format
                </div>
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1f1823] hover:bg-[#bde8f5] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">📄 PDF Report</span>
                  <span className="text-[10px] text-[#3b3240] bg-[#fff] px-1.5 py-0.5 rounded border border-[#1f1823]/20">Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("word")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1f1823] hover:bg-[#f6a3ca] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">📘 Word Document</span>
                  <span className="text-[10px] text-[#3b3240] bg-[#fff] px-1.5 py-0.5 rounded border border-[#1f1823]/20">.doc</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("md")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1f1823] hover:bg-[#fbd38d] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">📝 Markdown</span>
                  <span className="text-[10px] text-[#3b3240] bg-[#fff] px-1.5 py-0.5 rounded border border-[#1f1823]/20">.md</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1f1823] hover:bg-[#bbf7d0] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">📊 Spreadsheet CSV</span>
                  <span className="text-[10px] text-[#3b3240] bg-[#fff] px-1.5 py-0.5 rounded border border-[#1f1823]/20">.csv</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("json")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1f1823] hover:bg-[#e2e8f0] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">⚙️ Raw Telemetry</span>
                  <span className="text-[10px] text-[#3b3240] bg-[#fff] px-1.5 py-0.5 rounded border border-[#1f1823]/20">.json</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <BrandLoader label="Aggregating governance telemetry..." size="lg" />
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