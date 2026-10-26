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
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case "needs_revision":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
      case "rejected":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]";
      case "needs_revision":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
      default:
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]";
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
    <div className="min-h-screen bg-ambient-mesh text-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Title & Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Enterprise Content Repository
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Governance Operations Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time multi-dimensional tracking of brand compliance, revisions, and approval decisions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleSeedDemo}
              className="px-4 py-2.5 glass-panel glass-panel-hover text-cyan-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              ⚡ Seed Demo Submissions
            </button>
            <Link
              href="/upload"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:brightness-110 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              Scan New Content
            </Link>
          </div>
        </div>

        {/* Top KPI Metric Chips */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl border border-indigo-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Total Submissions</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">{documents.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Approved &amp; Certified</span>
            <div className="text-2xl font-bold text-emerald-300 mt-1 font-mono">{approvedCount}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">Pending Review</span>
            <div className="text-2xl font-bold text-cyan-300 mt-1 font-mono">{pendingCount}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-rose-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400">Violations Logged</span>
            <div className="text-2xl font-bold text-rose-300 mt-1 font-mono">{totalViolations}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-3 rounded-2xl mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-indigo-500/20">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {["all", "pending_review", "approved", "needs_revision", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border transition-all capitalize ${
                  statusFilter === st
                    ? "bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 text-cyan-200 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-bold"
                    : "bg-slate-900/40 text-gray-400 border-transparent hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {st === "all" ? "All Statuses" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, author or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-indigo-500/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center text-gray-400 py-24 glass-panel rounded-2xl">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Loading enterprise submissions...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-2xl border border-indigo-500/20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">
              {documents.length === 0 ? "No documents uploaded yet" : "No matching documents found"}
            </h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto mb-6">
              {documents.length === 0
                ? "Start by running a pre-publication scan on your marketing collateral or load pre-built demo scenarios."
                : "Try clearing your search query or switching your status filter tab above."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSeedDemo}
                className="px-5 py-2.5 glass-panel glass-panel-hover text-cyan-300 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                ⚡ Load Sample Submissions
              </button>
              <Link
                href="/upload"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl text-xs hover:brightness-110 transition-all inline-block shadow-md"
              >
                Scan First Document
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-indigo-500/20"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                        <Link href={`/review?id=${doc.id}`}>{doc.title}</Link>
                      </h3>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusBadge(
                          doc.status
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-[11px] font-bold">
                        v{doc.version || 1}
                      </span>
                      {doc.content_type && (
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 text-gray-300 border border-indigo-500/20 font-mono text-[10px] uppercase">
                          {doc.content_type}
                        </span>
                      )}
                      {doc.image_url && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Visual Creative
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">
                      Author: <span className="text-gray-200 font-semibold">{doc.author}</span> • Ingested on{" "}
                      {new Date(doc.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 self-start shrink-0">
                    <button
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      title="Delete submission"
                      className="p-2.5 bg-slate-900/80 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/review?id=${doc.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      Review Studio
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Metadata & Scores Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-3.5 border-t border-indigo-500/15">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">
                      <strong className="text-white font-mono">{doc.issues?.length || 0}</strong> policy issues
                    </span>

                    {doc.issues && doc.issues.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {doc.issues.filter((i: any) => i.severity === "Critical").length > 0 && (
                          <span className="px-2 py-0.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded text-[11px] font-semibold">
                            {doc.issues.filter((i: any) => i.severity === "Critical").length} Critical
                          </span>
                        )}
                        {doc.issues.filter((i: any) => i.severity === "Moderate").length > 0 && (
                          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded text-[11px] font-semibold">
                            {doc.issues.filter((i: any) => i.severity === "Moderate").length} Moderate
                          </span>
                        )}
                        {doc.issues.filter((i: any) => i.severity === "Advisory").length > 0 && (
                          <span className="px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-semibold">
                            {doc.issues.filter((i: any) => i.severity === "Advisory").length} Advisory
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Policy Compliant
                      </span>
                    )}
                  </div>

                  {/* Quality & Accessibility Scores */}
                  <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
                    {doc.readability_score !== undefined && (
                      <span>
                        Flesch Readability:{" "}
                        <strong className="text-cyan-300">{doc.readability_score}</strong>/100
                      </span>
                    )}
                    {doc.wcag_score !== undefined && (
                      <span>
                        WCAG 2.1:{" "}
                        <strong className="text-emerald-300">{doc.wcag_score}%</strong>
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
