"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  FileUp,
  Palette,
  Eye,
  ArrowRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "text",
    author: ""
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visualResult, setVisualResult] = useState<any>(null);
  const [analyzingVisual, setAnalyzingVisual] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Quick Demo Presets
  const loadPreset = (type: "high_risk" | "enterprise" | "social") => {
    if (type === "high_risk") {
      setFormData({
        title: "Q4 Enterprise Cloud Launch Announcement",
        author: "Growth Marketing Team",
        content_type: "document",
        content:
          "BrandSphere is officially the fastest cloud platform in the world! Our totally amazing new release is #1 rated across all benchmarks. We have completely eliminated the legacy architecture and old version bottlenecks to bring you an unbeatable price with guaranteed 100% zero downtime. This is an awesome revolution in business computing that your team will totally love."
      });
    } else if (type === "enterprise") {
      setFormData({
        title: "Product Performance Benchmark Summary",
        author: "Compliance & Communications Lead",
        content_type: "document",
        content:
          "BrandSphere AI delivers up to an 80% reduction in content review turnaround cycles according to the Inkloom Enterprise Study 2026. The platform maintains 99.5% accuracy in detecting unsupported promotional claims, upholding high standards of enterprise credibility. All published collateral retains a cryptographically verifiable audit trail compliant with SOC 2 requirements."
      });
    } else if (type === "social") {
      setFormData({
        title: "Autonomous Agent Feature Spotlight",
        author: "Social Media Agency",
        content_type: "social",
        content:
          "Excited to showcase our Autonomous Brand Governance Agent! With continuous pre-publication checks, teams protect brand voice and visual consistency seamlessly. Experience reliable, explainable AI assistance designed for modern marketing workflows. #BrandSphere #Governance"
      });
    }
  };

  // Document File Upload (.txt / .md)
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.title) {
      setFormData((prev) => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setFormData((prev) => ({ ...prev, content: text }));
      }
    };
    reader.readAsText(file);
  };

  // Image Upload & Visual Analysis
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);

      // Perform visual brand audit
      setAnalyzingVisual(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/visual/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: base64 })
        });
        if (res.ok) {
          const vData = await res.json();
          setVisualResult(vData);
        }
      } catch (err) {
        console.error("Visual analysis error:", err);
      } finally {
        setAnalyzingVisual(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setVisualResult(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        image_url: selectedImage || undefined
      };

      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detailMsg = errorData?.detail
          ? typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail)
          : `Server returned HTTP ${response.status}`;
        throw new Error(detailMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to submit content for analysis. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      <div className="fixed inset-0 bg-ambient-mesh pointer-events-none" />

      {/* Reusable Premium Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header Ribbon */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Policy Enforcement
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Upload className="w-7 h-7 text-cyan-400" />
              Pre-Publication Brand Scanner
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Submit drafts, press releases, and marketing creatives for multi-dimensional brand governance, readability calibration, and visual palette auditing.
            </p>
          </div>

          {/* Quick Demo Preset Pills */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Load Demo Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => loadPreset("high_risk")}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                High-Risk Draft
              </button>
              <button
                type="button"
                onClick={() => loadPreset("enterprise")}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Compliant Draft
              </button>
              <button
                type="button"
                onClick={() => loadPreset("social")}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Social Post
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 flex items-start gap-3.5 text-rose-200 backdrop-blur-md animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-300">Submission Error</p>
              <p className="text-sm mt-0.5 text-rose-200/90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 text-sm font-semibold p-1"
            >
              ✕
            </button>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Row 1: Document Title & Author */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Document Title <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                    placeholder="e.g., Q4 Enterprise Release Announcement"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Author or Team <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                    placeholder="e.g., Sarah Chen (Product Marketing)"
                  />
                </div>
              </div>

              {/* Row 2: Format & File Import */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Content Format Type
                  </label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                  >
                    <option value="text">Marketing Copy / Web Announcement</option>
                    <option value="document">Enterprise Whitepaper / PR Document</option>
                    <option value="social">Social Media Campaign Post</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Import Text Document (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".txt,.md,.json"
                      onChange={handleDocFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl text-sm text-slate-300 hover:text-white flex items-center justify-center gap-2.5 transition-all group hover:bg-slate-900/60"
                    >
                      <FileUp className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Browse .txt or .md file from local drive</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Draft Body Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Draft Content Body <span className="text-cyan-400">*</span>
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    {formData.content.length} characters • ~{Math.ceil(formData.content.split(/\s+/).filter(Boolean).length)} words
                  </span>
                </div>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 resize-none font-sans text-sm leading-relaxed transition-all"
                  placeholder="Paste marketing copy, press release, or executive collateral here for governance analysis..."
                />
              </div>

              {/* Multimodal Visual Audit Upload Section */}
              <div className="pt-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-sm font-semibold text-white">Visual Brand Asset & Banner Check (Multimodal)</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">Optional Asset</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-stretch">
                  {/* File selector card */}
                  <div className="md:col-span-1">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {selectedImage ? (
                      <div className="relative h-36 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 flex flex-col items-center justify-center group overflow-hidden">
                        <img
                          src={selectedImage}
                          alt="Creative preview"
                          className="max-h-full max-w-full rounded object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-rose-500/80 transition-all shadow"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full h-36 bg-slate-950/50 border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all p-3 group hover:bg-slate-900/40"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
                          <Palette className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">Upload Image Banner</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WebP, SVG</span>
                      </button>
                    )}
                  </div>

                  {/* Vision analysis output */}
                  <div className="md:col-span-2">
                    {analyzingVisual ? (
                      <div className="h-36 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-medium">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                        <span>Quantizing color palette & verifying WCAG AA contrast...</span>
                      </div>
                    ) : visualResult ? (
                      <div className="h-36 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-cyan-400" />
                            Extracted Dominant Palette:
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                              visualResult.contrast_compliant_aa
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                            }`}
                          >
                            WCAG AA: {visualResult.contrast_compliant_aa ? "PASS" : "FAIL"} ({visualResult.contrast_ratio}:1)
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 py-1">
                          {visualResult.dominant_colors.map((hex: string, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div
                                className="w-7 h-7 rounded-md border border-white/20 shadow-md ring-1 ring-black/40"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                              <span className="font-mono text-[10px] text-slate-400">{hex}</span>
                            </div>
                          ))}
                        </div>
                        {visualResult.recommendations && visualResult.recommendations.length > 0 ? (
                          <p className="text-slate-300 text-[11px] truncate flex items-center gap-1.5 text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                            <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            <span>{visualResult.recommendations[0]}</span>
                          </p>
                        ) : (
                          <p className="text-slate-500 text-[11px]">Visual palette meets baseline brand tolerances.</p>
                        )}
                      </div>
                    ) : (
                      <div className="h-36 p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 flex flex-col justify-center text-xs text-slate-400">
                        <p className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-cyan-400" />
                          Automated Multi-Modal Vision Checks:
                        </p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          • Color distance delta from brand token palette (#4F46E5, #06B6D4, #10B981)
                        </p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          • WCAG 2.1 AA text-over-image luminance contrast ratio (min 4.5:1)
                        </p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          • Visual findings automatically appended to review workspace
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/20 hover:shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Executing Brand Governance Scanner & Multimodal Engine...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-cyan-200" />
                  <span>Scan Content Against Brand Guidelines</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Analysis Result Display */
          <div className="space-y-6 animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Pre-Publication Analysis Complete</h2>
                </div>
                <p className="text-slate-300 text-sm pl-11">
                  {result.issues_count} governance issue{result.issues_count !== 1 ? "s" : ""} detected and cataloged with citations.
                </p>
              </div>
              <div className="flex items-center gap-4 sm:border-l sm:border-emerald-500/20 sm:pl-6">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Reading Ease</span>
                  <span className="text-2xl font-black text-cyan-400">{result.document.readability_score || 72}<span className="text-xs font-normal text-slate-400">/100</span></span>
                </div>
                {result.document.wcag_score && (
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Visual WCAG</span>
                    <span className="text-2xl font-black text-emerald-400">{result.document.wcag_score}<span className="text-xs font-normal text-slate-400">:1</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Document Details Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Document Summary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Document Title</span>
                  <span className="text-white font-medium">{result.document.title}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Author / Origin</span>
                  <span className="text-slate-200">{result.document.author}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Governance Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                    {result.document.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Issues Breakdown */}
            {result.document.issues && result.document.issues.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Flagged Governance Findings ({result.document.issues.length})
                  </h3>
                  <span className="text-xs text-slate-400">Interactive 1-Click Fixes available in Review Studio</span>
                </div>

                <div className="space-y-3">
                  {result.document.issues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                              issue.severity === "Critical"
                                ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                : issue.severity === "Moderate"
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs uppercase font-medium">
                            {issue.type}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{issue.location}</span>
                      </div>

                      <p className="text-sm font-semibold text-slate-100">{issue.description}</p>

                      <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                        <p className="text-slate-400">
                          <span className="text-cyan-400 font-semibold">Guideline Reference: </span>
                          {issue.guideline_reference}
                        </p>
                        <p className="text-emerald-300 font-medium">
                          <span className="text-emerald-400 font-semibold">Remediation Suggestion: </span>
                          {issue.suggestion}
                        </p>
                        <p className="text-slate-400 italic">
                          <span className="text-indigo-400 not-italic font-semibold">Approved Truth Source: </span>
                          {issue.citation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => router.push(`/review?id=${result.document.id}`)}
                className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Open in Collaborative Review Studio</span>
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedImage(null);
                  setVisualResult(null);
                  setFormData({ title: "", content: "", content_type: "text", author: "" });
                }}
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
                <span>Upload Another Document</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
