"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Palette,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Guideline {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
  rule_pattern?: string;
  rationale?: string;
  remediation_template?: string;
  is_active?: boolean;
}

interface Fact {
  id: string;
  topic: string;
  claim_statement: string;
  approved_metric: string;
  source_citation: string;
  status: string;
}

interface GlossaryTerm {
  id: string;
  term: string;
  replacement: string;
  category: string;
  note?: string;
}

interface BrandAsset {
  id: string;
  asset_name: string;
  asset_type: string;
  value: string;
  description?: string;
}

export default function GuidelinesPage() {
  const [activeTab, setActiveTab] = useState<"guidelines" | "facts" | "glossary" | "assets">("guidelines");
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // New item modal form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuideline, setNewGuideline] = useState({
    name: "",
    category: "claims",
    version: "v1.0",
    description: "",
    rule_pattern: "",
    rationale: "",
    remediation_template: ""
  });
  const [newFact, setNewFact] = useState({
    topic: "",
    claim_statement: "",
    approved_metric: "",
    source_citation: ""
  });
  const [newTerm, setNewTerm] = useState({
    term: "",
    replacement: "",
    category: "deprecated",
    note: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resG, resF, resGl, resA] = await Promise.all([
        fetch(`${API_BASE_URL}/api/guidelines`).then((r) => r.json()).catch(() => ({ guidelines: [] })),
        fetch(`${API_BASE_URL}/api/facts`).then((r) => r.json()).catch(() => ({ facts: [] })),
        fetch(`${API_BASE_URL}/api/glossary`).then((r) => r.json()).catch(() => ({ glossary: [] })),
        fetch(`${API_BASE_URL}/api/brand-assets`).then((r) => r.json()).catch(() => ({ brand_assets: [] }))
      ]);
      setGuidelines(resG.guidelines || []);
      setFacts(resF.facts || []);
      setGlossary(resGl.glossary || []);
      setAssets(resA.brand_assets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/guidelines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGuideline)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewGuideline({
          name: "",
          category: "claims",
          version: "v1.0",
          description: "",
          rule_pattern: "",
          rationale: "",
          remediation_template: ""
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/facts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFact)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewFact({ topic: "", claim_statement: "", approved_metric: "", source_citation: "" });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/glossary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTerm)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewTerm({ term: "", replacement: "", category: "deprecated", note: "" });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuideline = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guideline?")) return;
    await fetch(`${API_BASE_URL}/api/guidelines/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDeleteFact = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/facts/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleDeleteTerm = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/glossary/${id}`, { method: "DELETE" });
    fetchData();
  };

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
            <Link href="/review" className="text-gray-300 hover:text-white transition-colors">Review Queue</Link>
            <Link href="/guidelines" className="text-white font-medium">Guidelines & KB</Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              Brand Knowledge Base & Guidelines
            </h1>
            <p className="text-gray-400 mt-1">
              Canonical enterprise truth sources, approved claims, terminology glossary, and brand design tokens
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            Add New Entry
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-500/30 gap-6 mb-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "guidelines"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            Brand Policies ({guidelines.length})
          </button>
          <button
            onClick={() => setActiveTab("facts")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "facts"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Approved Facts Library ({facts.length})
          </button>
          <button
            onClick={() => setActiveTab("glossary")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "glossary"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Terminology Glossary ({glossary.length})
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "assets"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            Brand Design Tokens ({assets.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading knowledge base...</div>
        ) : (
          <div>
            {/* TAB 1: GUIDELINES */}
            {activeTab === "guidelines" && (
              <div className="grid md:grid-cols-2 gap-6">
                {guidelines.map((g) => (
                  <div
                    key={g.id}
                    className="p-6 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 backdrop-blur-sm relative group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{g.name}</h3>
                          <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded text-xs">
                            {g.version}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 uppercase tracking-wide">
                          {g.category}
                        </span>
                      </div>
                      {g.id !== "1" && g.id !== "2" && g.id !== "3" && g.id !== "4" && g.id !== "5" && (
                        <button
                          onClick={() => handleDeleteGuideline(g.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{g.description}</p>
                    {g.rule_pattern && (
                      <div className="mb-2 p-2.5 rounded bg-slate-950/60 border border-indigo-500/20 text-xs">
                        <span className="text-gray-400 font-mono">Flag Criteria: </span>
                        <span className="text-cyan-300 font-mono">{g.rule_pattern}</span>
                      </div>
                    )}
                    {g.rationale && (
                      <p className="text-xs text-gray-400 mb-1">
                        <span className="text-indigo-400 font-semibold">Governance Rationale: </span>
                        {g.rationale}
                      </p>
                    )}
                    {g.remediation_template && (
                      <p className="text-xs text-green-400">
                        <span className="text-green-500 font-semibold">Remediation: </span>
                        {g.remediation_template}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: FACTS */}
            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/30 flex items-center justify-between text-sm text-gray-300 mb-4">
                  <span>Canonical facts are used by BrandSphere AI to ground claim verification and demand verified citations.</span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                    Verified Truth Base
                  </span>
                </div>
                {facts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded text-xs font-semibold">
                          {fact.topic}
                        </span>
                        <span className="text-xs text-green-400 font-medium">● Verified Metric: {fact.approved_metric}</span>
                      </div>
                      <p className="text-white font-medium">{fact.claim_statement}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                        Approved Citation: <span className="text-indigo-300 font-mono">{fact.source_citation}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFact(fact.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-2 self-start md:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: GLOSSARY */}
            {activeTab === "glossary" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {glossary.map((term) => (
                  <div
                    key={term.id}
                    className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                            term.category === "prohibited"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {term.category}
                        </span>
                        <button
                          onClick={() => handleDeleteTerm(term.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="text-xs text-gray-400 mb-0.5">Deprecated Phrase:</div>
                        <div className="text-red-300 line-through font-mono text-sm">{term.term}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-0.5">Approved Replacement:</div>
                        <div className="text-green-400 font-semibold text-sm">{term.replacement}</div>
                      </div>
                    </div>
                    {term.note && <p className="text-xs text-gray-400 italic pt-2 border-t border-indigo-500/10">{term.note}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: ASSETS & TOKENS */}
            {activeTab === "assets" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/50 to-indigo-900/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded uppercase">
                        {asset.asset_type}
                      </span>
                    </div>
                    {asset.asset_type === "color" && (
                      <div
                        className="w-full h-16 rounded-lg mb-3 border border-white/10 shadow-inner flex items-center justify-center font-mono text-xs font-bold text-white shadow"
                        style={{ backgroundColor: asset.value }}
                      >
                        {asset.value}
                      </div>
                    )}
                    <h4 className="font-semibold text-white mb-1">{asset.asset_name}</h4>
                    <p className="text-xs font-mono text-cyan-300 mb-2">{asset.value}</p>
                    {asset.description && <p className="text-xs text-gray-400">{asset.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-4">
              Add to Brand Knowledge Base ({activeTab.toUpperCase()})
            </h3>

            {activeTab === "guidelines" && (
              <form onSubmit={handleCreateGuideline} className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-300 mb-1">Guideline Title</label>
                  <input
                    type="text"
                    required
                    value={newGuideline.name}
                    onChange={(e) => setNewGuideline({ ...newGuideline, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., Executive Social Media Policy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Category</label>
                    <select
                      value={newGuideline.category}
                      onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    >
                      <option value="claims">claims</option>
                      <option value="tone">tone</option>
                      <option value="terminology">terminology</option>
                      <option value="visual">visual</option>
                      <option value="accessibility">accessibility</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Version</label>
                    <input
                      type="text"
                      value={newGuideline.version}
                      onChange={(e) => setNewGuideline({ ...newGuideline, version: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                      placeholder="v1.0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newGuideline.description}
                    onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="Explain the policy requirement..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Keywords / Patterns</label>
                  <input
                    type="text"
                    value={newGuideline.rule_pattern}
                    onChange={(e) => setNewGuideline({ ...newGuideline, rule_pattern: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="Comma separated words or trigger patterns"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-indigo-500/30 text-gray-400 rounded hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded font-medium"
                  >
                    Save Guideline
                  </button>
                </div>
              </form>
            )}

            {activeTab === "facts" && (
              <form onSubmit={handleCreateFact} className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-300 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={newFact.topic}
                    onChange={(e) => setNewFact({ ...newFact, topic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., Latency Benchmark"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Canonical Statement</label>
                  <textarea
                    required
                    rows={2}
                    value={newFact.claim_statement}
                    onChange={(e) => setNewFact({ ...newFact, claim_statement: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="Verifiable factual claim..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Approved Metric</label>
                  <input
                    type="text"
                    required
                    value={newFact.approved_metric}
                    onChange={(e) => setNewFact({ ...newFact, approved_metric: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., 99.99% uptime guarantee"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Verified Source Citation</label>
                  <input
                    type="text"
                    required
                    value={newFact.source_citation}
                    onChange={(e) => setNewFact({ ...newFact, source_citation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., SLA Audit Report 2026, Section 2"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-indigo-500/30 text-gray-400 rounded hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded font-medium"
                  >
                    Save Verified Fact
                  </button>
                </div>
              </form>
            )}

            {activeTab === "glossary" && (
              <form onSubmit={handleCreateTerm} className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-300 mb-1">Deprecated / Flagged Term</label>
                  <input
                    type="text"
                    required
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., legacy dashboard"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Approved Replacement</label>
                  <input
                    type="text"
                    required
                    value={newTerm.replacement}
                    onChange={(e) => setNewTerm({ ...newTerm, replacement: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="e.g., Enterprise Governance Hub"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Category</label>
                  <select
                    value={newTerm.category}
                    onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                  >
                    <option value="deprecated">deprecated</option>
                    <option value="prohibited">prohibited</option>
                    <option value="preferred">preferred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Usage Note</label>
                  <input
                    type="text"
                    value={newTerm.note}
                    onChange={(e) => setNewTerm({ ...newTerm, note: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/30 rounded text-white"
                    placeholder="Why this replacement is required"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-indigo-500/30 text-gray-400 rounded hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded font-medium"
                  >
                    Save Term
                  </button>
                </div>
              </form>
            )}

            {activeTab === "assets" && (
              <div className="text-sm text-gray-400 py-4 text-center">
                Design tokens are configured in the global brand theme file. You can manage guidelines and facts above.
                <div className="mt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-indigo-500/30 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
