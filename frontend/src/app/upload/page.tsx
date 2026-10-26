"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "text",
    author: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detailMsg = errorData?.detail
          ? (typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail))
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
            <Link href="/upload" className="text-white">Upload Content</Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">Review Queue</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Content for Review</h1>
          <p className="text-gray-400">Submit your content for AI-powered brand governance analysis</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="e.g., Q4 Product Launch Announcement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="text">Text/Copy</option>
                  <option value="document">Document</option>
                  <option value="social">Social Media Post</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                  placeholder="Paste your content here for brand governance review..."
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit for Review
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Analysis Complete</h2>
              </div>
              <p className="text-gray-300">
                {result.issues_count} issue{result.issues_count !== 1 ? 's' : ''} flagged for review
              </p>
            </div>

            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Document Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">Title: <span className="text-white">{result.document.title}</span></p>
                <p className="text-gray-400">Author: <span className="text-white">{result.document.author}</span></p>
                <p className="text-gray-400">Status: <span className="text-blue-400">{result.document.status.replace('_', ' ')}</span></p>
              </div>
            </div>

            {result.document.issues && result.document.issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Flagged Issues</h3>
                {result.document.issues.map((issue: any) => (
                  <div key={issue.id} className="p-4 rounded-xl border border-indigo-500/30 bg-slate-900/30">
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                        issue.severity === 'Moderate' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                        {issue.type}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{issue.description}</p>
                    <p className="text-sm text-gray-400 mb-2"><span className="text-cyan-400">Guideline:</span> {issue.guideline_reference}</p>
                    <p className="text-sm text-gray-300 mb-2"><span className="text-green-400">Suggestion:</span> {issue.suggestion}</p>
                    <p className="text-xs text-gray-500"><span className="text-indigo-400">Citation:</span> {issue.citation}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/review?id=${result.document.id}`)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                View in Review Queue
              </button>
              <button
                onClick={() => { setResult(null); setFormData({ title: "", content: "", content_type: "text", author: "" }); }}
                className="px-6 py-3 border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-500/10 transition-all"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
