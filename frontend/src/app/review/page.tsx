"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, XCircle, AlertTriangle, MessageSquare, User } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Issue {
  id: string;
  type: string;
  severity: string;
  description: string;
  guideline_reference: string;
  suggestion: string;
  citation: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  author: string;
  status: string;
  created_at: string;
  issues: Issue[];
}

function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const [document, setDocument] = useState<Document | null>(null);
  const [availableDocs, setAvailableDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    if (docId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/documents/${docId}`)
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.detail || `Document fetch failed with status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setDocument(data.document);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading document:", err);
          setErrorMessage(err.message || "Unable to load document");
          setLoading(false);
        });
    } else {
      // If no ID provided, fetch recent documents for the queue selector
      fetch(`${API_BASE_URL}/api/documents`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableDocs(data.documents || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [docId]);

  const handleReview = async (status: string) => {
    if (!document) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: document.id,
          reviewer_id: "reviewer-001",
          status: status,
          comments: reviewComment.trim() || undefined
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Review action failed with status ${response.status}`);
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Review submission error:", error);
      setErrorMessage(error.message || "Failed to record review action. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Moderate": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">BrandSphere AI</span>
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-400 mb-4">No document selected</p>
          <Link href="/dashboard" className="text-cyan-400 hover:underline">Go to Dashboard</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <header className="border-b border-indigo-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">BrandSphere AI</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">Upload Content</Link>
            <Link href="/review" className="text-white">Review Queue</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/dashboard" className="text-cyan-400 hover:underline text-sm">← Back to Dashboard</Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{document.title}</h1>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <User className="w-4 h-4" /> {document.author} • {new Date(document.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs">
                  {document.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-lg border border-indigo-500/20">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Content</h3>
                <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{document.content}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Review Decision
              </h2>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add review comments (optional)..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleReview("approved")}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={() => handleReview("needs_revision")}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Request Revision
                </button>
                <button
                  onClick={() => handleReview("rejected")}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">
                AI Analysis ({document.issues?.length || 0} Issues)
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {document.issues && document.issues.length > 0 ? (
                  document.issues.map((issue) => (
                    <div key={issue.id} className="p-3 rounded-lg border border-indigo-500/20 bg-slate-950/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">
                          {issue.type}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium mb-2">{issue.description}</p>
                      <p className="text-xs text-gray-400 mb-1"><span className="text-cyan-400">Ref:</span> {issue.guideline_reference}</p>
                      <p className="text-xs text-green-400 mb-1"><span className="text-green-300">Fix:</span> {issue.suggestion}</p>
                      <p className="text-xs text-gray-500 italic">{issue.citation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">No issues detected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-gray-400">Loading...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
