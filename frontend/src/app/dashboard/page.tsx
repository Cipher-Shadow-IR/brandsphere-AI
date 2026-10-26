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
  Image as ImageIcon
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Document {
  id: string;
  title: string;
  author: string;
  status: string;
  created_at: string;
  version?: number;
  readability_score?: number;
  image_url?: string;
  issues: any[];
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/documents`)
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "needs_revision":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "needs_revision":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">Upload Content</Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">Review Queue</Link>
            <Link href="/guidelines" className="text-gray-300 hover:text-white transition-colors">Guidelines & KB</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Governance Dashboard</h1>
            <p className="text-gray-400">
              Overview of all pre-publication submissions, compliance evaluations, and review decisions
            </p>
          </div>
          <Link
            href="/upload"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            Upload New Content
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {["all", "pending_review", "approved", "needs_revision", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border transition-all capitalize ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white border-indigo-400 shadow"
                    : "bg-slate-900/60 text-gray-400 border-indigo-500/20 hover:text-white"
                }`}
              >
                {st === "all" ? "All Submissions" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or author..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950/60 border border-indigo-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading submissions...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20 border border-indigo-500/30 rounded-xl bg-slate-900/30">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 font-medium mb-1">
              {documents.length === 0 ? "No documents uploaded yet" : "No matching documents found"}
            </p>
            <p className="text-gray-500 text-xs mb-4">
              {documents.length === 0
                ? "Start by uploading copy to run the intelligent pre-publication governance scan"
                : "Try clearing your search query or switching status filters"}
            </p>
            <Link
              href="/upload"
              className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-400 transition-all inline-block"
            >
              Upload First Document
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm hover:border-indigo-400/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{doc.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold">
                        v{doc.version || 1}
                      </span>
                      {doc.image_url && (
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Visual Asset
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      By <span className="text-gray-200 font-medium">{doc.author}</span> • {new Date(doc.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/review?id=${doc.id}`}
                    className="px-4 py-2 bg-slate-900 border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-600 hover:border-indigo-500 transition-all text-xs font-semibold flex items-center gap-1.5 self-start"
                  >
                    Review Studio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-indigo-500/10">
                  <span className="text-gray-400">
                    <span className="text-white font-semibold">{doc.issues?.length || 0}</span> issues flagged
                  </span>
                  {doc.issues && doc.issues.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {doc.issues.filter((i: any) => i.severity === "Critical").length > 0 && (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                          {doc.issues.filter((i: any) => i.severity === "Critical").length} Critical
                        </span>
                      )}
                      {doc.issues.filter((i: any) => i.severity === "Moderate").length > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                          {doc.issues.filter((i: any) => i.severity === "Moderate").length} Moderate
                        </span>
                      )}
                      {doc.issues.filter((i: any) => i.severity === "Advisory").length > 0 && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                          {doc.issues.filter((i: any) => i.severity === "Advisory").length} Advisory
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-green-400 font-medium">● 100% Policy Compliant</span>
                  )}

                  {doc.readability_score && (
                    <span className="text-gray-400 ml-auto font-mono">
                      Readability: <span className="text-cyan-300 font-bold">{doc.readability_score}</span>/100
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
