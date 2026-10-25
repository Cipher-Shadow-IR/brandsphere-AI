"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Document {
  id: string;
  title: string;
  author: string;
  status: string;
  created_at: string;
  issues: any[];
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/documents")
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
            <Link href="/dashboard" className="text-white">
              Dashboard
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
              Upload Content
            </Link>
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">
              Review Queue
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Dashboard</h1>
            <p className="text-gray-400">Overview of all submitted content and review status</p>
          </div>
          <Link
            href="/upload"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Upload New Content
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20 border border-indigo-500/30 rounded-xl bg-slate-900/30">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No documents uploaded yet</p>
            <Link href="/upload" className="text-cyan-400 hover:underline">
              Upload your first document
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{doc.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      By {doc.author} • {new Date(doc.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/review?id=${doc.id}`}
                    className="px-4 py-2 border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-500/10 transition-all"
                  >
                    View Details
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">
                    <span className="text-white font-semibold">{doc.issues?.length || 0}</span> issues flagged
                  </span>
                  {doc.issues && doc.issues.length > 0 && (
                    <div className="flex items-center gap-2">
                      {doc.issues.filter((i: any) => i.severity === "Critical").length > 0 && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                          {doc.issues.filter((i: any) => i.severity === "Critical").length} Critical
                        </span>
                      )}
                      {doc.issues.filter((i: any) => i.severity === "Moderate").length > 0 && (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                          {doc.issues.filter((i: any) => i.severity === "Moderate").length} Moderate
                        </span>
                      )}
                      {doc.issues.filter((i: any) => i.severity === "Advisory").length > 0 && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                          {doc.issues.filter((i: any) => i.severity === "Advisory").length} Advisory
                        </span>
                      )}
                    </div>
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
