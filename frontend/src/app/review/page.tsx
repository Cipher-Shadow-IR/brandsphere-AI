"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Wand2,
  History,
  FileCheck2,
  FileText,
  Clock,
  Sparkles,
  Award,
  Send,
  Eye,
  Edit3,
  Check,
  Palette,
  ExternalLink,
  Lock,
  ArrowLeft,
  Loader2,
  Copy,
  Printer
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from "@/lib/api";

interface Issue {
  id: string;
  type: string;
  severity: string;
  description: string;
  guideline_reference: string;
  suggestion: string;
  citation: string;
  location: string;
  resolved?: boolean;
  original_text?: string;
}

interface Revision {
  id: string;
  version: number;
  content: string;
  change_summary: string;
  edited_by: string;
  created_at: string;
}

interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  created_at: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  content_type: string;
  author: string;
  status: string;
  created_at: string;
  version?: number;
  readability_score?: number;
  wcag_score?: number;
  image_url?: string;
  dominant_colors?: string;
  issues: Issue[];
  reviews?: any[];
  revisions?: Revision[];
  comments?: Comment[];
}

function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");

  const [document, setDocument] = useState<Document | null>(null);
  const [availableDocs, setAvailableDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Persona / Role Switcher: Creator, Reviewer, Legal Admin
  const [activeRole, setActiveRole] = useState<"Creator" | "Reviewer" | "Legal Admin">("Reviewer");

  // View mode: 'document' | 'revisions'
  const [viewTab, setViewTab] = useState<"document" | "revisions">("document");

  // Review decision states
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Threaded collaboration comments
  const [newCommentText, setNewCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // Certificate modal
  const [certificateData, setCertificateData] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Direct draft edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editSummary, setEditSummary] = useState("");

  const loadDocument = (id: string) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/documents/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.detail || `Document fetch failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setDocument(data.document);
        setEditedContent(data.document.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading document:", err);
        setErrorMessage(err.message || "Unable to load document");
        setLoading(false);
      });
  };

  useEffect(() => {
    setErrorMessage(null);
    if (docId) {
      loadDocument(docId);
    } else {
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

  // 1-Click Context-Preserving Remediation
  const handleApplyRemediation = async (issueId: string) => {
    if (!document) return;
    setRemediatingId(issueId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${document.id}/apply-remediation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_id: issueId,
          author_name: `${activeRole} Assistant`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDocument(data.document);
        setEditedContent(data.document.content);
      }
    } catch (err) {
      console.error("Remediation error:", err);
    } finally {
      setRemediatingId(null);
    }
  };

  // Submit manual draft revision
  const handleSaveRevision = async () => {
    if (!document) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${document.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editedContent,
          change_summary: editSummary || "Author updated copy for brand compliance",
          edited_by: `${activeRole} (${document.author})`
        })
      });
      if (res.ok) {
        setIsEditing(false);
        setEditSummary("");
        loadDocument(document.id);
      }
    } catch (err) {
      console.error("Save revision error:", err);
    }
  };

  // Add threaded comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document || !newCommentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${document.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newCommentText.trim(),
          author: `${activeRole} Team`,
          role: activeRole
        })
      });
      if (res.ok) {
        setNewCommentText("");
        loadDocument(document.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingComment(false);
    }
  };

  // Submit review decision
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
          reviewer_id: `reviewer-${activeRole.toLowerCase().replace(/\s+/g, "-")}`,
          status: status,
          comments: reviewComment.trim() || undefined,
          role: activeRole
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Review action failed with status ${response.status}`);
      }

      loadDocument(document.id);
      setReviewComment("");
    } catch (error: any) {
      console.error("Review submission error:", error);
      setErrorMessage(error.message || "Failed to record review action. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch certificate
  const handleViewCertificate = async () => {
    if (!document) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${document.id}/certificate`);
      if (res.ok) {
        const cert = await res.json();
        setCertificateData(cert);
        setShowCertModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Moderate":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-slate-400 text-sm">Loading governance review studio...</span>
      </div>
    );
  }

  // Queue Selector View (when no docId specified)
  if (!document) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
        <div className="fixed inset-0 bg-ambient-mesh pointer-events-none" />
        <Navbar />

        <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Governance Review Queue
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Select a document draft to open the collaborative compliance workspace with 1-click remediation suggestions.
          </p>

          {availableDocs.length > 0 ? (
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              {availableDocs.map((d) => (
                <Link
                  key={d.id}
                  href={`/review?id=${d.id}`}
                  className="block glass-panel p-5 rounded-2xl border border-slate-850 hover:border-cyan-500/50 bg-slate-900/60 transition-all group hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold group-hover:text-cyan-300 transition-colors text-base">
                      {d.title}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                        d.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : d.status === "rejected"
                          ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                          : d.status === "needs_revision"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>By <strong className="text-slate-300">{d.author}</strong></span>
                    <span className="font-mono text-cyan-400">{d.issues?.length || 0} issues flagged</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 bg-slate-900/50 max-w-md mx-auto space-y-4">
              <p className="text-slate-400 text-sm">No documents found in the active database.</p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Upload New Document Draft
              </Link>
            </div>
          )}
        </main>
      </div>
    );
  }

  const resolvedCount = document.issues?.filter((i) => i.resolved).length || 0;
  const totalCount = document.issues?.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      <div className="fixed inset-0 bg-ambient-mesh pointer-events-none" />

      {/* Shared Executive Navbar */}
      <Navbar />

      {/* Role Switcher & Telemetry Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 py-2.5 sticky top-[65px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Active Persona Pill Selector */}
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="font-semibold text-slate-300">Active Persona:</span>
            <div className="flex bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveRole("Creator")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeRole === "Creator"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ✍️ Content Creator
              </button>
              <button
                onClick={() => setActiveRole("Reviewer")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeRole === "Reviewer"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🛡️ Brand Reviewer
              </button>
              <button
                onClick={() => setActiveRole("Legal Admin")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeRole === "Legal Admin"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚖️ Legal & Compliance
              </button>
            </div>
          </div>

          {/* Telemetry Chips & Certificate Trigger */}
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-400">
              Version: <span className="text-cyan-400 font-bold">v{document.version || 1}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-400">
              Readability: <span className="text-emerald-400 font-bold">{document.readability_score || 72}/100</span>
            </div>
            {document.status === "approved" && (
              <button
                onClick={handleViewCertificate}
                className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all text-xs cursor-pointer active:scale-95"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Compliance Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Review Studio */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Navigation & Tab Toggle */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewTab("document")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewTab === "document"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Document Studio
            </button>
            <button
              onClick={() => setViewTab("revisions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewTab === "revisions"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Revisions ({document.revisions?.length || 1})
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: CONTENT VIEWER & COLLABORATION */}
          <div className="lg:col-span-2 space-y-6">
            {viewTab === "document" ? (
              <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-5">
                {/* Document Header & State */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{document.title}</h1>
                    <p className="text-slate-400 text-xs flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{document.author}</span>
                      <span>•</span>
                      <span className="capitalize">{document.content_type} format</span>
                      <span>•</span>
                      <span>{new Date(document.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        document.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : document.status === "rejected"
                          ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                          : document.status === "needs_revision"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {document.status.replace("_", " ")}
                    </span>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 border border-slate-700 bg-slate-950/60 rounded-xl text-xs text-slate-300 hover:text-white hover:border-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        Edit Draft
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 border border-rose-500/40 bg-rose-500/10 rounded-xl text-xs text-rose-300 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Multimodal Image Creative Attachment Preview */}
                {document.image_url && (
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      Audited Creative Asset Attachment
                    </span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={document.image_url}
                        alt="Creative asset"
                        className="max-h-36 rounded-lg border border-slate-700 object-contain bg-black/40"
                      />
                      <div className="text-xs text-slate-400 space-y-1">
                        <p className="text-slate-200 font-medium">Visual Brand Compliance Verified</p>
                        <p>• Color palette conforms to corporate branding tokens</p>
                        <p>• Contrast ratio meets WCAG 2.1 AA legibility minimum</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Draft Area: Viewer or Live Editor */}
                {!isEditing ? (
                  <div className="p-5 sm:p-6 bg-slate-950/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300 uppercase tracking-wide">Document Draft Content</span>
                      <span className="font-mono">Version {document.version || 1} • {document.content.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                    <div className="text-slate-100 whitespace-pre-wrap leading-relaxed text-sm font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
                      {document.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={10}
                      className="w-full p-4 bg-slate-950 border border-cyan-500/50 rounded-xl text-white text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-sans"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        placeholder="Summary of revisions made (e.g., Aligned claim with benchmark study)"
                        className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        onClick={handleSaveRevision}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
                      >
                        Save as v{(document.version || 1) + 1}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* REVISION HISTORY TAB */
              <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Version History & Revision Snapshots
                </h3>
                {document.revisions && document.revisions.length > 0 ? (
                  document.revisions.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                          v{rev.version}
                        </span>
                        <span className="text-xs text-slate-500">
                          {rev.edited_by} • {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-medium">{rev.change_summary}</p>
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-850 text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap font-mono">
                        {rev.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs py-4">No prior revisions recorded.</p>
                )}
              </div>
            )}

            {/* REVIEW DECISION ACTION PANEL */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Collaborative Review Decision
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Decide on publication readiness as <strong className="text-cyan-300">{activeRole}</strong>. Authorizations stamp an official Brand Compliance Certificate.
                </p>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add reviewer guidance, compliance conditions, or approval notes..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none placeholder-slate-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleReview("approved")}
                  disabled={submitting}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Publication</span>
                </button>
                <button
                  onClick={() => handleReview("needs_revision")}
                  disabled={submitting}
                  className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-900/30 cursor-pointer active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button
                  onClick={() => handleReview("rejected")}
                  disabled={submitting}
                  className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-lg shadow-rose-900/30 cursor-pointer active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Draft</span>
                </button>
              </div>
            </div>

            {/* THREADED COLLABORATION COMMENTS */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Collaborative Review Thread ({document.comments?.length || 0})
              </h3>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {document.comments && document.comments.length > 0 ? (
                  document.comments.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-cyan-300">{c.author}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">No review discussion notes recorded yet. Add the first comment below.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2.5 pt-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Comment as ${activeRole}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                />
                <button
                  type="submit"
                  disabled={postingComment || !newCommentText.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: AI FINDINGS & 1-CLICK REMEDIATION */}
          <div className="space-y-4">
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4 sticky top-[125px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Governance Audit</span>
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/25">
                  {resolvedCount}/{totalCount} Resolved
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {document.issues && document.issues.length > 0 ? (
                  document.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                        issue.resolved
                          ? "border-emerald-500/30 bg-emerald-950/15 opacity-80"
                          : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadge(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[10px] uppercase font-medium">
                            {issue.type}
                          </span>
                        </div>
                        {issue.resolved && (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-slate-100 text-xs font-semibold leading-snug">{issue.description}</p>

                      <div className="space-y-1.5 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <p className="text-slate-400">
                          <span className="text-cyan-400 font-medium">Policy: </span>
                          {issue.guideline_reference}
                        </p>
                        <p className="text-emerald-300">
                          <span className="text-emerald-400 font-medium">Remediation: </span>
                          {issue.suggestion}
                        </p>
                        <p className="text-slate-400 italic">
                          <span className="text-indigo-400 not-italic font-medium">Canonical Source: </span>
                          {issue.citation}
                        </p>
                      </div>

                      {/* 1-Click Fix Button */}
                      {!issue.resolved && (
                        <button
                          onClick={() => handleApplyRemediation(issue.id)}
                          disabled={remediatingId === issue.id}
                          className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                        >
                          {remediatingId === issue.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                              <span>Applying Remediation...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>1-Click Context Remediation</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2.5" />
                    <p className="text-white text-sm font-bold">100% Brand Compliant</p>
                    <p className="text-slate-400 text-xs mt-1">No violations detected against enterprise policies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OFFICIAL COMPLIANCE CERTIFICATE MODAL */}
      {showCertModal && certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-panel bg-slate-900 border-2 border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-5">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <Award className="w-9 h-9 text-cyan-400" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-300 font-semibold block mb-1">
                Official Inkloom Enterprise Governance
              </span>
              <h2 className="text-2xl font-black text-white">Brand Compliance Certificate</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                This collateral has undergone cryptographic pre-publication verification against corporate guidelines, approved metrics, and accessibility standards.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Document Title:</span>
                <span className="text-white font-semibold">{certificateData.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Author / Origin:</span>
                <span className="text-slate-200">{certificateData.author}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Verified By:</span>
                <span className="text-cyan-300 font-mono">{certificateData.reviewer_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Approval Timestamp:</span>
                <span className="text-slate-200">{new Date(certificateData.approved_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Compliance Rating:</span>
                <span className="text-emerald-400 font-bold">{certificateData.compliance_score}% Certified</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cryptographic SHA-256 Hash:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(certificateData.verification_hash);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedHash ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-cyan-300/90 bg-slate-900 p-2 rounded border border-slate-800 break-all select-all">
                  {certificateData.verification_hash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
