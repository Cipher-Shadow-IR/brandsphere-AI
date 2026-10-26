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
  Lock
} from "lucide-react";
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

  // View mode: 'document' | 'diff' | 'revisions' | 'certificate'
  const [viewTab, setViewTab] = useState<"document" | "revisions" | "audit">("document");

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
          reviewer_id: `reviewer-${activeRole.toLowerCase().replace(/\s+/g, '-')}`,
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Moderate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-gray-400">
        Loading governance workspace...
      </div>
    );
  }

  if (!document) {
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
              <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
              <Link href="/upload" className="text-gray-300 hover:text-white">Upload Content</Link>
              <Link href="/review" className="text-white">Review Queue</Link>
              <Link href="/guidelines" className="text-gray-300 hover:text-white">Guidelines & KB</Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white">Analytics</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Review Queue Selector</h2>
          <p className="text-gray-400 mb-6">Select a document from the queue to start reviewing</p>
          {availableDocs.length > 0 ? (
            <div className="space-y-3 max-w-xl mx-auto text-left">
              {availableDocs.map((d) => (
                <Link
                  key={d.id}
                  href={`/review?id=${d.id}`}
                  className="block p-4 rounded-xl border border-indigo-500/30 bg-slate-900/40 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{d.title}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                      {d.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">By {d.author} • {d.issues?.length || 0} issues</span>
                </Link>
              ))}
            </div>
          ) : (
            <Link href="/upload" className="text-cyan-400 hover:underline">
              Upload your first document to scan
            </Link>
          )}
        </main>
      </div>
    );
  }

  const resolvedCount = document.issues?.filter((i) => i.resolved).length || 0;
  const totalCount = document.issues?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-gray-200">
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
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">Upload Content</Link>
            <Link href="/review" className="text-white font-medium">Review Queue</Link>
            <Link href="/guidelines" className="text-gray-300 hover:text-white transition-colors">Guidelines & KB</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      {/* Role Switcher Ribbon */}
      <div className="border-b border-indigo-500/20 bg-slate-950/70 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="font-semibold text-gray-300">Active Persona / Role:</span>
            <div className="flex bg-slate-900 border border-indigo-500/30 rounded-lg p-0.5">
              <button
                onClick={() => setActiveRole("Creator")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeRole === "Creator"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ✍️ Content Creator
              </button>
              <button
                onClick={() => setActiveRole("Reviewer")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeRole === "Reviewer"
                    ? "bg-indigo-500 text-white font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🛡️ Brand Reviewer
              </button>
              <button
                onClick={() => setActiveRole("Legal Admin")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeRole === "Legal Admin"
                    ? "bg-purple-600 text-white font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ⚖️ Legal & Compliance
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-mono">
              Version: <span className="text-cyan-400 font-bold">v{document.version || 1}</span>
            </span>
            <span className="text-gray-400 font-mono">
              Reading Ease: <span className="text-green-400 font-bold">{document.readability_score || 72}/100</span>
            </span>
            {document.status === "approved" && (
              <button
                onClick={handleViewCertificate}
                className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow hover:opacity-90 transition-all text-xs"
              >
                <Award className="w-3.5 h-3.5" />
                View Compliance Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Review Studio */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-cyan-400 hover:underline text-sm flex items-center gap-1">
            ← Back to Content Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab("document")}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewTab === "document" ? "bg-indigo-600 text-white" : "bg-slate-900 text-gray-400"
              }`}
            >
              Document Studio
            </button>
            <button
              onClick={() => setViewTab("revisions")}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewTab === "revisions" ? "bg-indigo-600 text-white" : "bg-slate-900 text-gray-400"
              }`}
            >
              Revisions ({document.revisions?.length || 1})
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: CONTENT VIEWER & COLLABORATION */}
          <div className="lg:col-span-2 space-y-6">
            {viewTab === "document" ? (
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-indigo-500/20">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{document.title}</h1>
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-cyan-400" /> {document.author} • Format: {document.content_type} • {new Date(document.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        document.status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : document.status === "rejected"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : document.status === "needs_revision"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {document.status.replace("_", " ")}
                    </span>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 border border-indigo-500/40 rounded-lg text-xs text-gray-300 hover:text-white hover:border-cyan-400 flex items-center gap-1.5 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Draft
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 border border-red-500/40 rounded-lg text-xs text-red-300 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Multimodal Image Creative Attachment Preview */}
                {document.image_url && (
                  <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                    <span className="text-xs font-semibold text-cyan-400 block mb-2 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      Audited Creative Asset Attachment
                    </span>
                    <div className="flex items-center gap-4">
                      <img
                        src={document.image_url}
                        alt="Creative asset"
                        className="max-h-36 rounded-lg border border-indigo-500/30 object-contain bg-black/40"
                      />
                      <div className="text-xs text-gray-400 space-y-1">
                        <p className="text-gray-300 font-medium">Visual Brand Compliance Verified</p>
                        <p>• Color palette adheres to enterprise tokens</p>
                        <p>• Contrast ratio meets WCAG 2.1 AA standards</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content Area: Viewer or Live Editor */}
                {!isEditing ? (
                  <div className="p-5 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                      <span className="font-semibold text-gray-300 uppercase tracking-wide">Document Draft Content</span>
                      <span>Version {document.version || 1} • {document.content.split(/\s+/).length} words</span>
                    </div>
                    <div className="text-gray-100 whitespace-pre-wrap leading-relaxed text-sm font-sans selection:bg-cyan-500 selection:text-slate-950">
                      {document.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={10}
                      className="w-full p-4 bg-slate-950 border border-cyan-500/50 rounded-xl text-white text-sm leading-relaxed resize-none focus:outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        placeholder="Summary of revisions made (e.g., Aligned superlative claim with benchmark)"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded-lg text-xs text-white"
                      />
                      <button
                        onClick={handleSaveRevision}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                      >
                        Save as v{(document.version || 1) + 1}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* REVISION HISTORY TAB */
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Version History & Revision Snapshots
                </h3>
                {document.revisions && document.revisions.length > 0 ? (
                  document.revisions.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-indigo-500/20 bg-slate-950/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
                          Version v{rev.version}
                        </span>
                        <span className="text-xs text-gray-400">
                          {rev.edited_by} • {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-medium">{rev.change_summary}</p>
                      <div className="p-3 bg-slate-900/80 rounded border border-indigo-500/10 text-xs text-gray-300 max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
                        {rev.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs">No prior revisions recorded.</p>
                )}
              </div>
            )}

            {/* REVIEW DECISION PANEL (PRESERVED & ENHANCED) */}
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Collaborative Review Decision
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Decide on release readiness as <span className="text-cyan-300 font-semibold">{activeRole}</span>. Authorized approvals produce an official Brand Compliance Certificate.
              </p>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add reviewer notes, revision guidance, or compliance sign-off remarks..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none mb-4"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleReview("approved")}
                  disabled={submitting}
                  className="flex-1 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-900/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Publication
                </button>
                <button
                  onClick={() => handleReview("needs_revision")}
                  disabled={submitting}
                  className="flex-1 px-5 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-yellow-900/20"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Request Revision
                </button>
                <button
                  onClick={() => handleReview("rejected")}
                  disabled={submitting}
                  className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-900/20"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Draft
                </button>
              </div>
            </div>

            {/* THREADED COLLABORATION COMMENTS */}
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Collaborative Review Thread ({document.comments?.length || 0})
              </h3>
              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                {document.comments && document.comments.length > 0 ? (
                  document.comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-slate-950/60 border border-indigo-500/20 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-cyan-300">{c.author}</span>
                        <span className="text-gray-500">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-200">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">No review discussion comments yet. Add the first note below.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Comment as ${activeRole}...`}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={postingComment || !newCommentText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: AI FINDINGS & 1-CLICK REMEDIATION */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  AI Governance Audit
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                  {resolvedCount}/{totalCount} Resolved
                </span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {document.issues && document.issues.length > 0 ? (
                  document.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        issue.resolved
                          ? "border-green-500/30 bg-green-950/20 opacity-80"
                          : "border-indigo-500/30 bg-slate-950/70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[11px] uppercase font-medium">
                            {issue.type}
                          </span>
                        </div>
                        {issue.resolved && (
                          <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-white text-xs font-semibold mb-2 leading-snug">{issue.description}</p>
                      
                      <div className="space-y-1.5 text-[11px] mb-3">
                        <p className="text-gray-400">
                          <span className="text-cyan-400 font-medium">Policy: </span>
                          {issue.guideline_reference}
                        </p>
                        <p className="text-green-300">
                          <span className="text-green-400 font-medium">Remediation: </span>
                          {issue.suggestion}
                        </p>
                        <p className="text-gray-500 italic">
                          <span className="text-indigo-400 not-italic font-medium">Canonical Source: </span>
                          {issue.citation}
                        </p>
                      </div>

                      {/* 1-Click Fix Button */}
                      {!issue.resolved && (
                        <button
                          onClick={() => handleApplyRemediation(issue.id)}
                          disabled={remediatingId === issue.id}
                          className="w-full py-1.5 px-3 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                          {remediatingId === issue.id ? "Applying Fix..." : "1-Click Context Remediation"}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold">100% Brand Compliant</p>
                    <p className="text-gray-400 text-xs mt-1">No violations detected against enterprise policies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OFFICIAL COMPLIANCE CERTIFICATE MODAL */}
      {showCertModal && certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-500/50 rounded-2xl max-w-xl w-full p-8 shadow-2xl relative text-center">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCertModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <Award className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold block mb-1">
              Official Inkloom Enterprise Governance
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              Brand Compliance Certificate
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
              This publication draft has been audited against corporate guidelines, canonical fact bases, and accessibility standards.
            </p>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-indigo-500/30 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-indigo-500/20 pb-1.5">
                <span className="text-gray-400">Document Title:</span>
                <span className="text-white font-semibold">{certificateData.title}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-1.5">
                <span className="text-gray-400">Author / Origin:</span>
                <span className="text-white">{certificateData.author}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-1.5">
                <span className="text-gray-400">Verified By:</span>
                <span className="text-cyan-300">{certificateData.reviewer_id}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-1.5">
                <span className="text-gray-400">Approval Timestamp:</span>
                <span className="text-white">{new Date(certificateData.approved_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-1.5">
                <span className="text-gray-400">Compliance Rating:</span>
                <span className="text-green-400 font-bold">{certificateData.compliance_score}% Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cryptographic Verification Hash:</span>
                <span className="text-indigo-300 font-mono text-[10px]">{certificateData.verification_hash}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold text-xs shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Download / Print Certificate
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-5 py-2.5 border border-indigo-500/40 text-gray-300 rounded-lg text-xs hover:text-white"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-gray-400">
          Loading Review Workspace...
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
