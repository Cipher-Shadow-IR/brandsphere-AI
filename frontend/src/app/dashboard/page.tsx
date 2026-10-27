"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Document {
  id: string;
  title: string;
  author: string;
  status: string;
  created_at: string;
  content_type?: string;
  version?: number;
  readability_score?: number;
  wcag_score?: number;
  image_url?: string;
  dominant_colors?: string;
  issues: any[];
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/demo/seed`, { method: "POST" });
      if (res.ok) {
        await fetchDocuments();
      }
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document from the review queue?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[#c0efdc] text-[#214d3b] shadow-[2px_3px_6px_rgba(192,239,220,0.5),inset_1px_1px_2px_rgba(255,255,255,0.9)]";
      case "rejected":
        return "bg-[#ffd6e0] text-[#63192e] shadow-[2px_3px_6px_rgba(255,214,224,0.5),inset_1px_1px_2px_rgba(255,255,255,0.9)]";
      case "needs_revision":
        return "bg-[#f9e7a8] text-[#59470c] shadow-[2px_3px_6px_rgba(249,231,168,0.5),inset_1px_1px_2px_rgba(255,255,255,0.9)]";
      default:
        return "bg-[#ded0f9] text-[#3b2c5e] shadow-[2px_3px_6px_rgba(222,208,249,0.5),inset_1px_1px_2px_rgba(255,255,255,0.9)]";
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.content_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const approvedCount = documents.filter((d) => d.status === "approved").length;
  const pendingCount = documents.filter((d) => d.status === "pending_review").length;
  const totalViolations = documents.reduce((acc, d) => acc + (d.issues?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ded0f9] text-[#2d1b54] text-xs font-black shadow-inner mb-2 border border-[#caaef2]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52279c]" />
              <span className="tracking-wide uppercase text-[11px]">Enterprise Content Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1f1823] tracking-tight">
              Governance Operations Dashboard
            </h1>
            <p className="text-[#3b3240] text-sm mt-1 max-w-2xl font-medium">
              Real-time multi-dimensional tracking of brand compliance, revisions, and approval decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedDemo}
              className="clay-pill-secondary px-5 py-2.5 text-xs flex items-center gap-2 text-[#1f1823] font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#1f1823]" />
              <span>Seed Demo Submissions</span>
            </button>
            <Link
              href="/upload"
              className="clay-pill-primary px-5 py-2.5 text-xs flex items-center gap-2 text-[#1f1823] font-bold"
            >
              <Plus className="w-4 h-4 text-[#1f1823]" />
              <span>Scan New Content</span>
            </Link>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="clay-cushion-blue p-5 flex flex-col justify-between space-y-2 border-2 border-[#a8d7fa] min-w-0 overflow-hidden">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#103a5c] truncate">
              Total Submissions
            </span>
            <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-black text-[#0f2e49] [font-variant-numeric:tabular-nums] leading-none">
              {documents.length}
            </div>
            <span className="text-xs font-bold text-[#1a4a73] truncate">Ingested documents</span>
          </div>

          <div className="clay-cushion-mint p-5 flex flex-col justify-between space-y-2 border-2 border-[#9ee2c5] min-w-0 overflow-hidden">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0e3b27] truncate">
              Approved &amp; Certified
            </span>
            <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-black text-[#0e3b27] [font-variant-numeric:tabular-nums] leading-none">
              {approvedCount}
            </div>
            <span className="text-xs font-bold text-[#134e34] truncate">Ready for release</span>
          </div>

          <div className="clay-cushion-yellow p-5 flex flex-col justify-between space-y-2 border-2 border-[#fae089] min-w-0 overflow-hidden">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#473503] truncate">
              Pending Review
            </span>
            <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-black text-[#473503] [font-variant-numeric:tabular-nums] leading-none">
              {pendingCount}
            </div>
            <span className="text-xs font-bold text-[#5e4708] truncate">Awaiting reviewer action</span>
          </div>

          <div className="clay-cushion-pink p-5 flex flex-col justify-between space-y-2 border-2 border-[#f78ec0] min-w-0 overflow-hidden">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#570f25] truncate">
              Violations Flagged
            </span>
            <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-black text-[#570f25] [font-variant-numeric:tabular-nums] leading-none">
              {totalViolations}
            </div>
            <span className="text-xs font-bold text-[#691832] truncate">Across all collateral</span>
          </div>
        </div>

        {}
        <div className="clay-cushion !bg-[#fffdf7] !rounded-[28px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-[#e2dfd5]">
          {}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#e6e8f4] shadow-inner text-xs font-bold">
            {["all", "pending_review", "approved", "needs_revision", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full transition-all capitalize cursor-pointer font-bold ${
                  statusFilter === st
                    ? "bg-[#ded0f9] text-[#1f1823] shadow-sm font-black border border-[#caaef2]"
                    : "text-[#3b3240] hover:text-[#1f1823]"
                }`}
              >
                {st === "all" ? "All" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          {}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#3b3240] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="clay-well w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-[#1f1823] placeholder-[#5a5061] focus:outline-none focus:ring-2 focus:ring-[#f6a3ca]"
            />
          </div>
        </div>

        {}
        {loading ? (
          <div className="clay-tray p-16 text-center text-[#3b3240] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-[#f6a3ca] border-t-transparent animate-spin" />
            <span className="text-sm font-bold">Loading enterprise submissions...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="clay-tray p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ded0f9] flex items-center justify-center mx-auto text-[#1f1823] shadow-inner border border-[#caaef2]">
              <FileText className="w-8 h-8 text-[#1f1823]" />
            </div>
            <h3 className="text-2xl font-black text-[#1f1823]">
              {documents.length === 0 ? "No documents uploaded yet" : "No matching documents found"}
            </h3>
            <p className="text-sm text-[#3b3240] max-w-md mx-auto font-medium">
              {documents.length === 0
                ? "Start by running a pre-publication scan on your marketing collateral or seed realistic demo scenarios."
                : "Try clearing your search query or switching your status filter tab above."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSeedDemo}
                className="clay-pill-secondary px-6 py-3 text-xs flex items-center gap-2 text-[#1f1823] font-black"
              >
                <Sparkles className="w-4 h-4 text-[#1f1823]" />
                <span>Load Sample Submissions</span>
              </button>
              <Link
                href="/upload"
                className="clay-pill-primary px-6 py-3 text-xs inline-flex items-center gap-2 text-[#1f1823] font-black"
              >
                <Plus className="w-4 h-4 text-[#1f1823]" />
                <span>Scan First Document</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="clay-cushion !bg-[#fffdf7] clay-cushion-hover !rounded-[28px] p-6 space-y-4 border border-[#e2dfd5]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-[#1f1823] hover:text-[#b8326e] transition-colors">
                        <Link href={`/review?id=${doc.id}`}>{doc.title}</Link>
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${getStatusBadge(doc.status)}`}>
                        {doc.status.replace("_", " ")}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f1f2fa] text-[#1f1823] text-[11px] font-black shadow-inner border border-[#d6d9ea]">
                        v{doc.version || 1}
                      </span>
                      {doc.content_type && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ded0f9] text-[#2d1b54] text-[10px] font-black uppercase border border-[#caaef2]">
                          {doc.content_type}
                        </span>
                      )}
                      {doc.image_url && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#c5e5fb] text-[#103a5c] text-[10px] font-black flex items-center gap-1 border border-[#a8d7fa]">
                          <ImageIcon className="w-3 h-3" />
                          <span>Image Creative</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#3b3240] font-medium">
                      Author: <strong className="text-[#1f1823] font-bold">{doc.author}</strong> • Ingested on{" "}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {}
                  <div className="flex items-center gap-2 self-start shrink-0">
                    <button
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      title="Delete submission"
                      className="p-2.5 rounded-full bg-[#ffd6e0] text-[#570f25] hover:brightness-95 transition-all shadow-sm cursor-pointer border border-[#f78ec0]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/review?id=${doc.id}`}
                      className="clay-pill-secondary px-5 py-2.5 text-xs font-black inline-flex items-center gap-1.5 text-[#1f1823]"
                    >
                      <span>Review Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2dfd5] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#1f1823]">
                      {doc.issues?.length || 0} policy finding{doc.issues?.length !== 1 ? "s" : ""}
                    </span>

                    {doc.issues && doc.issues.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {doc.issues.filter((i: any) => i.severity === "Critical").length > 0 && (
                          <span className="px-2.5 py-0.5 bg-[#ffd6e0] text-[#570f25] rounded-full text-[10px] font-black border border-[#f78ec0]">
                            {doc.issues.filter((i: any) => i.severity === "Critical").length} Critical
                          </span>
                        )}
                        {doc.issues.filter((i: any) => i.severity === "Moderate").length > 0 && (
                          <span className="px-2.5 py-0.5 bg-[#f9e7a8] text-[#473503] rounded-full text-[10px] font-black border border-[#fae089]">
                            {doc.issues.filter((i: any) => i.severity === "Moderate").length} Moderate
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#0e3b27] font-black flex items-center gap-1 text-[11px] bg-[#c0efdc] px-2.5 py-0.5 rounded-full border border-[#9ee2c5]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Policy Compliant
                      </span>
                    )}
                  </div>

                  {}
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-[#3b3240]">
                    {doc.readability_score !== undefined && (
                      <span className="clay-well px-2.5 py-1 rounded-full font-bold text-[#1f1823]">
                        Reading Ease: <strong className="text-[#1f1823] font-black">{doc.readability_score}</strong>/100
                      </span>
                    )}
                    {doc.wcag_score !== undefined && (
                      <span className="clay-well px-2.5 py-1 rounded-full font-bold text-[#1f1823]">
                        WCAG: <strong className="text-[#0e3b27] font-black">{doc.wcag_score}:1</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}