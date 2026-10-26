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
  Sparkles,
  Search,
  Filter,
  Check,
  Tag,
  ArrowRight,
  Info,
  Loader2,
  X
} from "lucide-react";
import Navbar from "@/components/Navbar";
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
  const [searchQuery, setSearchQuery] = useState("");

  // New item modal form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingModal, setSubmittingModal] = useState(false);
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
    setSubmittingModal(true);
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
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingModal(true);
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
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingModal(true);
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
    } finally {
      setSubmittingModal(false);
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

  // Filtered lists based on search
  const filteredGuidelines = guidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacts = facts.filter(
    (f) =>
      f.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.claim_statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.source_citation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlossary = glossary.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.replacement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = assets.filter(
    (a) =>
      a.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      <div className="fixed inset-0 bg-ambient-mesh pointer-events-none" />

      {/* Reusable Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Canonical Governance Truth Sources
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-7 h-7 text-cyan-400" />
              Brand Knowledge Base & Policy Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Centralized repository for corporate governance policies, certified factual claims, terminology glossary, and brand design tokens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Entry</span>
            </button>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "guidelines"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Policies ({guidelines.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("facts")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "facts"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Facts Library ({facts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("glossary")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "glossary"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Glossary ({glossary.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "assets"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Design Tokens ({assets.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm">Loading knowledge base records...</span>
          </div>
        ) : (
          <div>
            {/* TAB 1: GUIDELINES */}
            {activeTab === "guidelines" && (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredGuidelines.map((g) => (
                  <div
                    key={g.id}
                    className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {g.name}
                            </h3>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 rounded-md text-[10px] font-mono font-semibold">
                              {g.version}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 uppercase tracking-wider border border-indigo-500/20">
                            {g.category}
                          </span>
                        </div>
                        {g.id !== "1" && g.id !== "2" && g.id !== "3" && g.id !== "4" && g.id !== "5" && (
                          <button
                            onClick={() => handleDeleteGuideline(g.id)}
                            className="text-slate-600 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                            title="Delete guideline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed mb-3">{g.description}</p>

                      {g.rule_pattern && (
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-xs mb-2">
                          <span className="text-slate-500 font-mono text-[11px] block mb-0.5">Flag Trigger Pattern:</span>
                          <span className="text-cyan-300 font-mono text-[11px]">{g.rule_pattern}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs">
                      {g.rationale && (
                        <p className="text-slate-400">
                          <span className="text-indigo-400 font-semibold">Governance Rationale: </span>
                          {g.rationale}
                        </p>
                      )}
                      {g.remediation_template && (
                        <p className="text-emerald-300">
                          <span className="text-emerald-400 font-semibold">Remediation Template: </span>
                          {g.remediation_template}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: FACTS */}
            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    Canonical facts ground claims in BrandSphere AI and demand certified metric citations before release.
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold self-start sm:self-auto shrink-0">
                    SOC 2 Audited Truth Base
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredFacts.map((fact) => (
                    <div
                      key={fact.id}
                      className="glass-panel p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 rounded-md text-xs font-semibold">
                            {fact.topic}
                          </span>
                          <span className="text-xs text-emerald-400 font-medium">
                            ● Approved Metric: <strong className="text-white">{fact.approved_metric}</strong>
                          </span>
                        </div>
                        <p className="text-white text-sm font-semibold">{fact.claim_statement}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>Approved Citation: </span>
                          <span className="text-indigo-300 font-mono text-[11px]">{fact.source_citation}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteFact(fact.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-slate-800 self-start md:self-center cursor-pointer"
                        title="Delete fact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: GLOSSARY */}
            {activeTab === "glossary" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGlossary.map((term) => (
                  <div
                    key={term.id}
                    className="glass-panel p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            term.category === "prohibited"
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {term.category}
                        </span>
                        <button
                          onClick={() => handleDeleteTerm(term.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Delete term"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="text-[11px] text-slate-500 mb-0.5">Deprecated Phrase:</div>
                        <div className="text-rose-300 line-through font-mono text-xs">{term.term}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-[11px] text-slate-500 mb-0.5">Approved Replacement:</div>
                        <div className="text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{term.replacement}</span>
                        </div>
                      </div>
                    </div>
                    {term.note && (
                      <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">{term.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: ASSETS & DESIGN TOKENS */}
            {activeTab === "assets" && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="glass-panel p-5 rounded-xl border border-slate-800/80 bg-slate-900/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded uppercase tracking-wider border border-slate-700">
                        {asset.asset_type}
                      </span>
                    </div>

                    {asset.asset_type === "color" && (
                      <div
                        className="w-full h-16 rounded-xl border border-white/10 shadow-lg flex items-center justify-center font-mono text-xs font-bold text-white shadow-inner"
                        style={{ backgroundColor: asset.value }}
                      >
                        {asset.value}
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-white text-sm mb-0.5">{asset.asset_name}</h4>
                      <p className="text-xs font-mono text-cyan-300">{asset.value}</p>
                    </div>

                    {asset.description && <p className="text-[11px] text-slate-400">{asset.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-panel bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Add to Brand Knowledge Base ({activeTab.toUpperCase()})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeTab === "guidelines" && (
              <form onSubmit={handleCreateGuideline} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Guideline Title <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuideline.name}
                    onChange={(e) => setNewGuideline({ ...newGuideline, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., Executive Social Media Policy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={newGuideline.category}
                      onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/60"
                    >
                      <option value="claims">claims</option>
                      <option value="tone">tone</option>
                      <option value="terminology">terminology</option>
                      <option value="visual">visual</option>
                      <option value="accessibility">accessibility</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">Version</label>
                    <input
                      type="text"
                      value={newGuideline.version}
                      onChange={(e) => setNewGuideline({ ...newGuideline, version: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                      placeholder="v1.0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Description <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newGuideline.description}
                    onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 resize-none"
                    placeholder="Explain the policy requirement and scope..."
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Trigger Patterns / Keywords
                  </label>
                  <input
                    type="text"
                    value={newGuideline.rule_pattern}
                    onChange={(e) => setNewGuideline({ ...newGuideline, rule_pattern: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="Comma separated words (e.g. unbeatable, 100% zero downtime)"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    {submittingModal ? "Saving..." : "Save Guideline"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "facts" && (
              <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Topic <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newFact.topic}
                    onChange={(e) => setNewFact({ ...newFact, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., Latency Benchmark"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Canonical Statement <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newFact.claim_statement}
                    onChange={(e) => setNewFact({ ...newFact, claim_statement: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 resize-none"
                    placeholder="Verifiable factual claim approved by compliance..."
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Approved Metric <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newFact.approved_metric}
                    onChange={(e) => setNewFact({ ...newFact, approved_metric: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., 99.99% uptime guarantee"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Verified Source Citation <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newFact.source_citation}
                    onChange={(e) => setNewFact({ ...newFact, source_citation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., SLA Audit Report 2026, Section 2"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    {submittingModal ? "Saving..." : "Save Verified Fact"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "glossary" && (
              <form onSubmit={handleCreateTerm} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Deprecated / Flagged Term <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., legacy dashboard"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Approved Replacement <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTerm.replacement}
                    onChange={(e) => setNewTerm({ ...newTerm, replacement: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="e.g., Enterprise Governance Hub"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newTerm.category}
                    onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/60"
                  >
                    <option value="deprecated">deprecated</option>
                    <option value="prohibited">prohibited</option>
                    <option value="preferred">preferred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">Usage Note</label>
                  <input
                    type="text"
                    value={newTerm.note}
                    onChange={(e) => setNewTerm({ ...newTerm, note: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                    placeholder="Why this replacement is mandatory"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    {submittingModal ? "Saving..." : "Save Term"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "assets" && (
              <div className="text-xs text-slate-400 py-6 text-center space-y-3">
                <p>Design tokens are defined in the global brand theme configuration. You can manage policy guidelines and verified facts above.</p>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 border border-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
