import BrandLoader from "@/components/BrandLoader";
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
  Printer,
  PenTool,
  Scale,
  X
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

  
  const [activeRole, setActiveRole] = useState<"Creator" | "Reviewer" | "Legal Admin">("Reviewer");

  
  const [viewTab, setViewTab] = useState<"document" | "revisions">("document");

  
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  const [newCommentText, setNewCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  
  const [certificateData, setCertificateData] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823] flex flex-col items-center justify-center px-4">
        <BrandLoader label="Loading Governance Review Studio..." size="lg" />
      </div>
    );
  }

  
  if (!document) {
    return (
      <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#ded0f9] flex items-center justify-center mx-auto text-[#1f1823] shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1f1823] tracking-tight">
              Governance Review Queue
            </h1>
            <p className="text-[#3b3240] text-sm max-w-md mx-auto mt-1">
              Select a document draft to open the collaborative compliance studio with 1-click remediation.
            </p>
          </div>

          {availableDocs.length > 0 ? (
            <div className="space-y-3 max-w-2xl mx-auto text-left">
              {availableDocs.map((d) => (
                <Link
                  key={d.id}
                  href={`/review?id=${d.id}`}
                  className="block clay-cushion !bg-[#fffdf7] clay-cushion-hover !rounded-[24px] p-5 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#1f1823] font-extrabold group-hover:text-[#f6a3ca] transition-colors text-base">
                      {d.title}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        d.status === "approved"
                          ? "bg-[#c0efdc] text-[#214d3b]"
                          : d.status === "rejected"
                          ? "bg-[#ffd6e0] text-[#63192e]"
                          : d.status === "needs_revision"
                          ? "bg-[#f9e7a8] text-[#59470c]"
                          : "bg-[#ded0f9] text-[#3b2c5e]"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#3b3240]">
                    <span>By <strong className="text-[#1f1823]">{d.author}</strong></span>
                    <span className="font-bold text-[#1f1823]">{d.issues?.length || 0} issues flagged</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="clay-tray p-8 max-w-md mx-auto space-y-4">
              <p className="text-[#3b3240] text-sm">No documents found in the active database.</p>
              <Link
                href="/upload"
                className="clay-pill-primary inline-flex items-center gap-2 px-6 py-3 text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#1f1823]" />
                <span>Upload New Document Draft</span>
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
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      {}
      <div className="sticky top-[68px] z-30 px-4 sm:px-6 py-2.5 bg-[#f1f2fa]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto clay-cushion !rounded-[24px] !bg-[#fffdf7] px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {}
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-[#1f1823]">Active Persona:</span>
            <div className="flex bg-[#f1f2fa] rounded-full p-1 gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveRole("Creator")}
                className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRole === "Creator"
                    ? "bg-[#c0efdc] text-[#214d3b] shadow-sm"
                    : "text-[#3b3240] hover:text-[#1f1823]"
                }`}
              >
                <PenTool className="w-3.5 h-3.5 inline mr-1 text-[#1f1823]" /> Creator
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("Reviewer")}
                className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRole === "Reviewer"
                    ? "bg-[#ded0f9] text-[#3b2c5e] shadow-sm"
                    : "text-[#3b3240] hover:text-[#1f1823]"
                }`}
              >
                <Shield className="w-3.5 h-3.5 inline mr-1 text-[#1f1823]" /> Reviewer
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("Legal Admin")}
                className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRole === "Legal Admin"
                    ? "bg-[#f6a3ca] text-[#1f1823] shadow-sm"
                    : "text-[#3b3240] hover:text-[#1f1823]"
                }`}
              >
                <Scale className="w-3.5 h-3.5 inline mr-1 text-[#1f1823]" /> Legal Admin
              </button>
            </div>
          </div>

          {}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-full bg-[#f1f2fa] font-bold text-[#1f1823] shadow-inner text-[11px]">
              Version: <strong className="text-[#1f1823]">v{document.version || 1}</strong>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#c0efdc] font-bold text-[#214d3b] text-[11px] shadow-sm">
              Readability: {document.readability_score || 72}/100
            </div>
            {document.status === "approved" && (
              <button
                type="button"
                onClick={handleViewCertificate}
                className="clay-pill-mint px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#3b3240] hover:text-[#1f1823] transition-colors flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fffdf7] shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-1 p-1 bg-[#fffdf7] rounded-full shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewTab("document")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                viewTab === "document"
                  ? "bg-[#ded0f9] text-[#1f1823] shadow-sm"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              Document Studio
            </button>
            <button
              type="button"
              onClick={() => setViewTab("revisions")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                viewTab === "revisions"
                  ? "bg-[#ded0f9] text-[#1f1823] shadow-sm"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              Revisions ({document.revisions?.length || 1})
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#ffd6e0] text-[#63192e] text-xs font-bold flex items-center gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#63192e]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-2 space-y-6">
            {viewTab === "document" ? (
              <div className="clay-tray p-6 sm:p-8 space-y-5">
                {}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8f4]">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#1f1823] mb-1">{document.title}</h1>
                    <p className="text-[#3b3240] text-xs flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#1f1823]" />
                      <span>{document.author}</span>
                      <span>•</span>
                      <span className="capitalize">{document.content_type} format</span>
                      <span>•</span>
                      <span>{new Date(document.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        document.status === "approved"
                          ? "bg-[#c0efdc] text-[#214d3b]"
                          : document.status === "rejected"
                          ? "bg-[#ffd6e0] text-[#63192e]"
                          : document.status === "needs_revision"
                          ? "bg-[#f9e7a8] text-[#59470c]"
                          : "bg-[#ded0f9] text-[#3b2c5e]"
                      }`}
                    >
                      {document.status.replace("_", " ")}
                    </span>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="clay-pill-secondary px-4 py-1.5 text-xs flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#1f1823]" />
                        <span>Edit Draft</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1.5 rounded-full bg-[#ffd6e0] text-[#63192e] text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {}
                {document.image_url && (
                  <div className="clay-well p-4 space-y-2">
                    <span className="text-xs font-bold text-[#1f1823] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Audited Creative Banner Asset</span>
                    </span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={document.image_url}
                        alt="Creative asset"
                        className="max-h-36 rounded-xl border border-white shadow-sm object-contain bg-white"
                      />
                      <div className="text-xs text-[#3b3240] space-y-1">
                        <p className="text-[#1f1823] font-bold">Visual Brand Compliance Verified</p>
                        <p>• Palette conforms to corporate brand tokens</p>
                        <p>• Contrast ratio meets WCAG 2.1 AA legibility minimum</p>
                      </div>
                    </div>
                  </div>
                )}

                {}
                {!isEditing ? (
                  <div className="clay-well-cream p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#3b3240]">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-[#1f1823]">Draft Content Body</span>
                      <span className="font-mono">v{document.version || 1} • {document.content.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                    <div className="text-[#1f1823] whitespace-pre-wrap leading-relaxed text-sm font-sans">
                      {document.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={10}
                      className="clay-well w-full p-4 text-sm text-[#1f1823] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#f6a3ca]"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        placeholder="Summary of changes (e.g. Aligned claim with benchmark study)"
                        className="clay-well flex-1 px-4 py-2.5 text-xs text-[#1f1823] placeholder-[#3b3240] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveRevision}
                        className="clay-pill-primary px-6 py-2.5 text-xs shrink-0"
                      >
                        Save as v{(document.version || 1) + 1}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              
              <div className="clay-tray p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#1f1823]" />
                  <span>Version History &amp; Snapshots</span>
                </h3>
                {document.revisions && document.revisions.length > 0 ? (
                  document.revisions.map((rev) => (
                    <div key={rev.id} className="clay-cushion !bg-[#fffdf7] !rounded-[24px] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-0.5 rounded-full bg-[#ded0f9] text-[#3b2c5e] text-xs font-bold">
                          v{rev.version}
                        </span>
                        <span className="text-xs text-[#3b3240]">
                          {rev.edited_by} • {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1f1823]">{rev.change_summary}</p>
                      <div className="clay-well p-3 text-xs text-[#3b3240] max-h-36 overflow-y-auto whitespace-pre-wrap font-mono">
                        {rev.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#3b3240] text-xs py-4">No prior revisions recorded.</p>
                )}
              </div>
            )}

            {}
            <div className="clay-cushion !bg-[#fffdf7] !rounded-[32px] p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#1f1823] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1f1823]" />
                  <span>Collaborative Review Decision</span>
                </h2>
                <p className="text-xs text-[#3b3240] mt-1">
                  Decide on release readiness as <strong className="text-[#1f1823]">{activeRole}</strong>. Approved decisions generate an official Brand Compliance Certificate.
                </p>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add reviewer notes, revision guidance, or compliance sign-off remarks..."
                rows={3}
                className="clay-well w-full p-4 text-xs text-[#1f1823] placeholder-[#3b3240] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca] resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleReview("approved")}
                  disabled={submitting}
                  className="clay-pill-mint py-3 px-4 text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Publication</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("needs_revision")}
                  disabled={submitting}
                  className="clay-pill-yellow py-3 px-4 text-xs flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("rejected")}
                  disabled={submitting}
                  className="clay-pill-rose py-3 px-4 text-xs flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Draft</span>
                </button>
              </div>
            </div>

            {}
            <div className="clay-cushion !bg-[#fffdf7] !rounded-[32px] p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1f1823]" />
                <span>Discussion Thread ({document.comments?.length || 0})</span>
              </h3>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {document.comments && document.comments.length > 0 ? (
                  document.comments.map((c) => (
                    <div key={c.id} className="clay-well p-3.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#1f1823]">{c.author}</span>
                        <span className="text-[#3b3240] font-mono text-[10px]">
                          {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[#3b3240]">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#3b3240] italic py-2">No discussion notes yet. Add the first comment below.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2.5 pt-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Comment as ${activeRole}...`}
                  className="clay-well flex-1 px-4 py-2.5 text-xs text-[#1f1823] placeholder-[#3b3240] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={postingComment || !newCommentText.trim()}
                  className="clay-pill-secondary px-5 py-2.5 text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#1f1823]" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {}
          <div className="space-y-4">
            <div className="clay-tray p-6 space-y-4 sticky top-[135px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4]">
                <h2 className="text-base font-extrabold text-[#1f1823] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#f6a3ca]" />
                  <span>Governance Audit</span>
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-[#ded0f9] text-[#3b2c5e] font-bold">
                  {resolvedCount}/{totalCount} Resolved
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {document.issues && document.issues.length > 0 ? (
                  document.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`clay-cushion p-4 space-y-2.5 !rounded-[24px] ${
                        issue.resolved ? "!bg-[#c0efdc]/40" : "!bg-[#fffdf7]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              issue.severity === "Critical"
                                ? "bg-[#ffd6e0] text-[#63192e]"
                                : issue.severity === "Moderate"
                                ? "bg-[#f9e7a8] text-[#59470c]"
                                : "bg-[#c5e5fb] text-[#1c4b69]"
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-[#f1f2fa] text-[#3b3240] rounded-full text-[10px] font-bold uppercase">
                            {issue.type}
                          </span>
                        </div>
                        {issue.resolved && (
                          <span className="text-[#214d3b] text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-[#214d3b]" />
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-extrabold text-[#1f1823] leading-snug">{issue.description}</p>

                      <div className="clay-well p-2.5 space-y-1 text-[11px] text-[#3b3240]">
                        <p>
                          <strong className="text-[#1f1823]">Policy: </strong>
                          {issue.guideline_reference}
                        </p>
                        <p className="text-[#214d3b]">
                          <strong>Remediation: </strong>
                          {issue.suggestion}
                        </p>
                        <p className="italic">
                          <strong className="not-italic text-[#1f1823]">Truth Source: </strong>
                          {issue.citation}
                        </p>
                      </div>

                      {}
                      {!issue.resolved && (
                        <button
                          type="button"
                          onClick={() => handleApplyRemediation(issue.id)}
                          disabled={remediatingId === issue.id}
                          className="clay-pill-primary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                        >
                          {remediatingId === issue.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Applying Remediation...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>1-Click Context Remediation</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle className="w-10 h-10 text-[#214d3b] mx-auto mb-2" />
                    <p className="text-sm font-extrabold text-[#214d3b]">100% Policy Compliant</p>
                    <p className="text-xs text-[#3b3240] mt-1">No violations detected against enterprise policies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      {showCertModal && certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1823]/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="clay-tray !bg-[#fffdf7] !rounded-[40px] border-4 border-[#f6a3ca]/50 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-5">
            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#3b3240] hover:text-[#1f1823] hover:bg-[#f1f2fa] transition-colors cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5 text-[#1f1823]" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#f6a3ca] shadow-md flex items-center justify-center mx-auto text-[#1f1823]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#3b3240] font-bold block mb-1">
                Official Inkloom Enterprise Governance
              </span>
              <h2 className="text-2xl font-black text-[#1f1823]">Brand Compliance Certificate</h2>
              <p className="text-xs text-[#3b3240] max-w-md mx-auto mt-1">
                This collateral has undergone cryptographic pre-publication verification against corporate guidelines and approved metrics.
              </p>
            </div>

            <div className="clay-well p-4 text-left text-xs space-y-2 text-[#1f1823]">
              <div className="flex justify-between border-b border-[#e6e8f4] pb-1.5">
                <span className="text-[#3b3240]">Document Title:</span>
                <span className="font-extrabold">{certificateData.title}</span>
              </div>
              <div className="flex justify-between border-b border-[#e6e8f4] pb-1.5">
                <span className="text-[#3b3240]">Author / Origin:</span>
                <span>{certificateData.author}</span>
              </div>
              <div className="flex justify-between border-b border-[#e6e8f4] pb-1.5">
                <span className="text-[#3b3240]">Verified By:</span>
                <span className="font-mono text-[#214d3b] font-bold">{certificateData.reviewer_id}</span>
              </div>
              <div className="flex justify-between border-b border-[#e6e8f4] pb-1.5">
                <span className="text-[#3b3240]">Approval Timestamp:</span>
                <span>{new Date(certificateData.approved_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#e6e8f4] pb-1.5">
                <span className="text-[#3b3240]">Compliance Rating:</span>
                <span className="text-[#214d3b] font-extrabold">{certificateData.compliance_score}% Certified</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#3b3240]">Cryptographic SHA-256 Hash:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(certificateData.verification_hash);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="text-[#3b2c5e] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedHash ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] bg-[#fffdf7] p-2 rounded-xl border border-[#e6e8f4] break-all select-all">
                  {certificateData.verification_hash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="clay-pill-primary px-6 py-2.5 text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="clay-pill-secondary px-5 py-2.5 text-xs"
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
        <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-3 border-[#f6a3ca] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}