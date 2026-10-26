"use client";

import { useState, useRef } from "react";
import Link from "next/link";
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
  Sliders,
  Palette,
  Eye
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
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
            <Link href="/upload" className="text-white font-medium">Upload Content</Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">Review Queue</Link>
            <Link href="/guidelines" className="text-gray-300 hover:text-white transition-colors">Guidelines & KB</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Upload className="w-8 h-8 text-cyan-400" />
              Pre-Publication Brand Scanner
            </h1>
            <p className="text-gray-400">
              Submit copy, documents, and marketing collateral for multi-dimensional brand governance analysis
            </p>
          </div>

          {/* Quick Demo Preset Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Presets:
            </span>
            <button
              type="button"
              onClick={() => loadPreset("high_risk")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition-all"
            >
              ⚠️ High-Risk Draft
            </button>
            <button
              type="button"
              onClick={() => loadPreset("enterprise")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-green-500/10 text-green-300 border border-green-500/30 hover:bg-green-500/20 transition-all"
            >
              ✅ Compliant Draft
            </button>
            <button
              type="button"
              onClick={() => loadPreset("social")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
            >
              📱 Social Post
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Submission Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Document Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g., Q4 Enterprise Release Announcement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author or Team</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g., Sarah Chen (Product Marketing)"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content Format</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="text">Text / Copy</option>
                    <option value="document">Enterprise Whitepaper / PR Document</option>
                    <option value="social">Social Media Post</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Import Text File (Optional)</label>
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
                      className="w-full px-4 py-3 bg-slate-950/40 border border-dashed border-indigo-500/40 rounded-lg text-sm text-gray-300 hover:text-white hover:border-cyan-400 flex items-center justify-center gap-2 transition-all"
                    >
                      <FileUp className="w-4 h-4 text-cyan-400" />
                      Browse .txt or .md file
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Draft Content Body</label>
                  <span className="text-xs text-gray-500 font-mono">{formData.content.length} characters</span>
                </div>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={9}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none font-sans text-sm leading-relaxed"
                  placeholder="Paste marketing copy, press release, or executive collateral here for governance analysis..."
                />
              </div>

              {/* Multimodal Visual Audit Upload Section */}
              <div className="pt-2 border-t border-indigo-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Visual Brand Asset & Banner Check (Multimodal)</span>
                  </div>
                  <span className="text-xs text-indigo-400">Optional</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-1">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full h-32 bg-slate-950/40 border border-dashed border-indigo-500/40 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-cyan-400 transition-all p-3"
                    >
                      {selectedImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={selectedImage}
                            alt="Selected creative preview"
                            className="max-h-full max-w-full rounded object-contain"
                          />
                        </div>
                      ) : (
                        <>
                          <Palette className="w-6 h-6 text-cyan-400 mb-1" />
                          <span className="text-xs font-medium">Upload Image Banner</span>
                          <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, WebP, SVG</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    {analyzingVisual ? (
                      <div className="h-32 flex items-center justify-center gap-2 text-sm text-cyan-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning visual palette & WCAG contrast...
                      </div>
                    ) : visualResult ? (
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-semibold">Extracted Dominant Palette:</span>
                          <span className={`px-2 py-0.5 rounded font-medium ${visualResult.contrast_compliant_aa ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            WCAG AA: {visualResult.contrast_compliant_aa ? 'PASS' : 'FAIL'} ({visualResult.contrast_ratio}:1)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {visualResult.dominant_colors.map((hex: string, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div
                                className="w-7 h-7 rounded border border-white/20 shadow"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                              <span className="font-mono text-[10px] text-gray-400">{hex}</span>
                            </div>
                          ))}
                        </div>
                        {visualResult.recommendations && visualResult.recommendations.length > 0 && (
                          <p className="text-gray-300 text-[11px] italic">
                            💡 {visualResult.recommendations[0]}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="h-32 p-3 bg-slate-950/20 rounded-xl border border-indigo-500/10 flex flex-col justify-center text-xs text-gray-500">
                        <p className="font-medium text-gray-400 mb-1">Automated Multi-Modal Vision Checks:</p>
                        <p>• Approved enterprise HEX color palette distance verification</p>
                        <p>• WCAG 2.1 AA text-over-image contrast ratio (min 4.5:1)</p>
                        <p>• Logo clearance and visual token grading</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Brand Governance Analysis...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Scan Content Against Brand Guidelines
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Pre-Publication Analysis Complete</h2>
                </div>
                <p className="text-gray-300 text-sm">
                  {result.issues_count} governance issue{result.issues_count !== 1 ? "s" : ""} flagged for review and remediation
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block mb-0.5">Reading Ease Score</span>
                <span className="text-2xl font-bold text-cyan-400">{result.document.readability_score || 72}/100</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Document Snapshot</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">Document Title</span>
                  <span className="text-white font-medium">{result.document.title}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Author / Origin</span>
                  <span className="text-white font-medium">{result.document.author}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Governance Status</span>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs uppercase font-semibold">
                    {result.document.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {result.document.issues && result.document.issues.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Flagged Governance Findings ({result.document.issues.length})
                  </h3>
                  <span className="text-xs text-gray-400">Interactive 1-Click Fixes available in Review Queue</span>
                </div>
                {result.document.issues.map((issue: any) => (
                  <div key={issue.id} className="p-4 rounded-xl border border-indigo-500/30 bg-slate-900/40">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            issue.severity === "Critical"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : issue.severity === "Moderate"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs uppercase font-medium">
                          {issue.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{issue.location}</span>
                    </div>

                    <p className="text-white font-medium mb-2">{issue.description}</p>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-gray-400">
                        <span className="text-cyan-400 font-medium">Guideline Citation: </span>
                        {issue.guideline_reference}
                      </p>
                      <p className="text-green-300">
                        <span className="text-green-400 font-medium">Remediation Suggestion: </span>
                        {issue.suggestion}
                      </p>
                      <p className="text-gray-500 italic">
                        <span className="text-indigo-400 not-italic font-medium">Approved Truth Source: </span>
                        {issue.citation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => router.push(`/review?id=${result.document.id}`)}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Open in Collaborative Review Studio
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedImage(null);
                  setVisualResult(null);
                  setFormData({ title: "", content: "", content_type: "text", author: "" });
                }}
                className="px-6 py-3.5 border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-500/10 transition-all"
              >
                Upload Another Document
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
