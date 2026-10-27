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
  RefreshCw,
  Lightbulb
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

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);

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
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f6a3ca] text-[#1f1823] text-xs font-bold shadow-sm mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Policy Enforcement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1f1823] tracking-tight flex items-center gap-3">
              <Upload className="w-8 h-8 text-[#1f1823]" />
              Pre-Publication Brand Scanner
            </h1>
            <p className="text-[#3b3240] text-sm mt-1 max-w-2xl">
              Submit copy, documents, and marketing collateral for multi-dimensional brand governance analysis.
            </p>
          </div>

          {}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="text-xs text-[#3b3240] font-bold">Load Demo Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => loadPreset("high_risk")}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#ffd6e0] text-[#63192e] shadow-[2px_3px_6px_rgba(255,214,224,0.6),inset_1px_1px_2px_rgba(255,255,255,0.9)] hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High-Risk Draft</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset("enterprise")}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#c0efdc] text-[#214d3b] shadow-[2px_3px_6px_rgba(192,239,220,0.6),inset_1px_1px_2px_rgba(255,255,255,0.9)] hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Compliant Draft</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset("social")}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#ded0f9] text-[#3b2c5e] shadow-[2px_3px_6px_rgba(222,208,249,0.6),inset_1px_1px_2px_rgba(255,255,255,0.9)] hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Social Post</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#ffd6e0] text-[#63192e] shadow-md flex items-start justify-between gap-3 font-medium text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#63192e]" />
              <div>
                <strong className="block">Submission Error</strong>
                <span>{error}</span>
              </div>
            </div>
            <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-[#fffdf7]/50 text-[#63192e] transition-colors"><X className="w-4 h-4" /></button>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="clay-tray p-6 sm:p-10 space-y-6">
              {}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1f1823] mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="clay-well w-full px-4 py-3 text-sm text-[#1f1823] placeholder-[#3b3240] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca]"
                    placeholder="e.g., Q4 Enterprise Release Announcement"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1f1823] mb-2">
                    Author or Team *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="clay-well w-full px-4 py-3 text-sm text-[#1f1823] placeholder-[#3b3240] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca]"
                    placeholder="e.g., Sarah Chen (Product Marketing)"
                  />
                </div>
              </div>

              {}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1f1823] mb-2">
                    Content Format Type
                  </label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="clay-well w-full px-4 py-3 text-sm text-[#1f1823] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca] cursor-pointer"
                  >
                    <option value="text">Marketing Copy / Web Announcement</option>
                    <option value="document">Enterprise Whitepaper / PR Document</option>
                    <option value="social">Social Media Campaign Post</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1f1823] mb-2">
                    Import Text File (Optional)
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
                      className="clay-cushion-hover clay-pill-secondary w-full py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileUp className="w-4 h-4 text-[#1f1823]" />
                      <span>Browse .txt or .md file from local drive</span>
                    </button>
                  </div>
                </div>
              </div>

              {}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1f1823]">
                    Draft Content Body *
                  </label>
                  <span className="text-xs text-[#3b3240] font-mono">
                    {formData.content.length} characters
                  </span>
                </div>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="clay-well w-full p-4 text-sm text-[#1f1823] placeholder-[#3b3240] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca] resize-none leading-relaxed"
                  placeholder="Paste marketing copy, press release, or executive collateral here for governance analysis..."
                />
              </div>

              {}
              <div className="pt-4 border-t border-[#e6e8f4]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ded0f9] flex items-center justify-center text-[#3b2c5e] shadow-sm">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-extrabold text-[#1f1823]">Visual Brand Asset &amp; Banner Check (Multimodal)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f1f2fa] text-[#3b3240] text-[10px] font-bold">Optional</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 items-stretch">
                  <div className="md:col-span-1">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {selectedImage ? (
                      <div className="clay-well relative h-36 w-full p-2 flex flex-col items-center justify-center group overflow-hidden">
                        <img
                          src={selectedImage}
                          alt="Creative preview"
                          className="max-h-full max-w-full rounded-xl object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-[#ffd6e0] text-[#63192e] shadow-sm hover:scale-105 cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="clay-well w-full h-36 flex flex-col items-center justify-center text-[#3b3240] hover:text-[#1f1823] p-3 cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#fffdf7] shadow-sm flex items-center justify-center mb-2">
                          <Palette className="w-5 h-5 text-[#1f1823]" />
                        </div>
                        <span className="text-xs font-bold text-[#1f1823]">Upload Creative Banner</span>
                        <span className="text-[10px] text-[#3b3240] mt-0.5">PNG, JPG, WebP, SVG</span>
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    {analyzingVisual ? (
                      <div className="clay-well h-36 flex items-center justify-center gap-2 text-xs font-bold text-[#1f1823]">
                        <Loader2 className="w-5 h-5 animate-spin text-[#f6a3ca]" />
                        <span>Scanning visual palette &amp; WCAG AA contrast...</span>
                      </div>
                    ) : visualResult ? (
                      <div className="clay-cushion-mint !rounded-2xl h-36 p-4 flex flex-col justify-between text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#214d3b]">Extracted Dominant Palette:</span>
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-[11px] shadow-sm ${
                              visualResult.contrast_compliant_aa
                                ? "bg-[#fffdf7] text-[#214d3b]"
                                : "bg-[#ffd6e0] text-[#63192e]"
                            }`}
                          >
                            WCAG AA: {visualResult.contrast_compliant_aa ? "PASS" : "FAIL"} ({visualResult.contrast_ratio}:1)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          {visualResult.dominant_colors.map((hex: string, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div
                                className="w-7 h-7 rounded-full shadow-[2px_3px_6px_rgba(56,49,57,0.15),inset_1px_1px_2px_rgba(255,255,255,0.7)]"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                              <span className="font-mono text-[10px] text-[#214d3b] font-bold">{hex}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[#214d3b] text-[11px] truncate">
                          <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-[#214d3b] shrink-0" /> {visualResult.recommendations?.[0] || "Palette conforms to baseline brand guidelines."}
                        </p>
                      </div>
                    ) : (
                      <div className="clay-well h-36 p-4 flex flex-col justify-center text-xs text-[#3b3240]">
                        <p className="font-bold text-[#1f1823] mb-1">Automated Multi-Modal Vision Checks:</p>
                        <p>• Color palette distance against approved brand tokens</p>
                        <p>• WCAG 2.1 AA text-over-image luminance contrast ratio (min 4.5:1)</p>
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
              className="clay-pill-primary w-full py-4 text-base flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Executing Brand Governance Scanner...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Scan Content Against Brand Guidelines</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        ) : (
          
          <div className="space-y-6">
            <div className="clay-cushion-mint p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-[#fffdf7] flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-5 h-5 text-[#214d3b]" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#214d3b]">Pre-Publication Analysis Complete</h2>
                </div>
                <p className="text-xs text-[#214d3b]/80 pl-12">
                  {result.issues_count} governance issue{result.issues_count !== 1 ? "s" : ""} cataloged for review and remediation.
                </p>
              </div>
              <div className="flex items-center gap-4 sm:pl-6">
                <div className="clay-well px-4 py-2 rounded-2xl bg-[#fffdf7] text-center">
                  <span className="text-[10px] text-[#3b3240] uppercase font-bold block">Reading Ease</span>
                  <span className="text-xl font-black text-[#214d3b]">{result.document.readability_score || 72}/100</span>
                </div>
                {result.document.wcag_score && (
                  <div className="clay-well px-4 py-2 rounded-2xl bg-[#fffdf7] text-center">
                    <span className="text-[10px] text-[#3b3240] uppercase font-bold block">Visual WCAG</span>
                    <span className="text-xl font-black text-[#214d3b]">{result.document.wcag_score}:1</span>
                  </div>
                )}
              </div>
            </div>

            {}
            {result.document.issues && result.document.issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#f6a3ca]" />
                  <span>Flagged Findings ({result.document.issues.length})</span>
                </h3>

                <div className="space-y-3">
                  {result.document.issues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="clay-cushion !bg-[#fffdf7] !rounded-[24px] p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              issue.severity === "Critical"
                                ? "bg-[#ffd6e0] text-[#63192e]"
                                : issue.severity === "Moderate"
                                ? "bg-[#f9e7a8] text-[#59470c]"
                                : "bg-[#c5e5fb] text-[#1c4b69]"
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f1f2fa] text-[#3b3240] text-[10px] font-bold uppercase">
                            {issue.type}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-[#3b3240]">{issue.location}</span>
                      </div>

                      <p className="text-sm font-extrabold text-[#1f1823]">{issue.description}</p>

                      <div className="clay-well p-3 space-y-1.5 text-xs text-[#3b3240]">
                        <p>
                          <strong className="text-[#1f1823]">Policy Reference: </strong>
                          {issue.guideline_reference}
                        </p>
                        <p className="text-[#214d3b]">
                          <strong>Remediation Suggestion: </strong>
                          {issue.suggestion}
                        </p>
                        <p className="italic">
                          <strong className="not-italic text-[#1f1823]">Truth Source: </strong>
                          {issue.citation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/review?id=${result.document.id}`)}
                className="clay-pill-primary w-full sm:flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Open in Collaborative Review Studio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setSelectedImage(null);
                  setVisualResult(null);
                  setFormData({ title: "", content: "", content_type: "text", author: "" });
                }}
                className="clay-pill-secondary w-full sm:w-auto px-6 py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Upload Another Document</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}