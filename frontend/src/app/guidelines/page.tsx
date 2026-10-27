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
  Check,
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
    <div className="min-h-screen bg-[#f1f2fa] text-[#1f1823]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f6a3ca] text-[#1f1823] text-xs font-bold shadow-sm mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Canonical Governance Truth Sources</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1f1823] tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#1f1823]" />
              Brand Knowledge Base &amp; Policy Engine
            </h1>
            <p className="text-[#3b3240] text-sm mt-1 max-w-2xl">
              Centralized repository for corporate governance policies, certified facts, and brand design tokens.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="clay-pill-primary px-6 py-3 text-xs flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Entry</span>
          </button>
        </div>

        {}
        <div className="clay-cushion !bg-[#fffdf7] !rounded-[28px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#f1f2fa] rounded-full shadow-inner overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("guidelines")}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "guidelines"
                  ? "bg-[#ded0f9] text-[#1f1823] shadow-sm font-extrabold"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Policies ({guidelines.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("facts")}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "facts"
                  ? "bg-[#c0efdc] text-[#214d3b] shadow-sm font-extrabold"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Facts Library ({facts.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("glossary")}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "glossary"
                  ? "bg-[#f6a3ca] text-[#1f1823] shadow-sm font-extrabold"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Glossary ({glossary.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("assets")}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "assets"
                  ? "bg-[#f9e7a8] text-[#59470c] shadow-sm font-extrabold"
                  : "text-[#3b3240] hover:text-[#1f1823]"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Tokens ({assets.length})</span>
            </button>
          </div>

          {}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#3b3240] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="clay-well w-full pl-10 pr-4 py-2.5 text-xs text-[#1f1823] placeholder-[#3b3240] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="clay-tray p-20 text-center text-[#3b3240] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-[#f6a3ca] border-t-transparent animate-spin" />
            <span className="text-sm font-bold">Loading knowledge base records...</span>
          </div>
        ) : (
          <div>
            {}
            {activeTab === "guidelines" && (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredGuidelines.map((g) => (
                  <div
                    key={g.id}
                    className="clay-cushion !bg-[#fffdf7] clay-cushion-hover !rounded-[28px] p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-base sm:text-lg font-extrabold text-[#1f1823]">
                              {g.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#f1f2fa] text-[#1f1823] text-[10px] font-mono font-bold shadow-inner">
                              {g.version}
                            </span>
                          </div>
                          <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ded0f9] text-[#3b2c5e] uppercase">
                            {g.category}
                          </span>
                        </div>
                        {g.id !== "1" && g.id !== "2" && g.id !== "3" && g.id !== "4" && g.id !== "5" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteGuideline(g.id)}
                            className="p-1.5 rounded-full bg-[#ffd6e0] text-[#63192e] hover:brightness-95 cursor-pointer"
                            title="Delete guideline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[#3b3240] text-xs leading-relaxed mb-3">{g.description}</p>

                      {g.rule_pattern && (
                        <div className="clay-well p-2.5 text-xs mb-2">
                          <span className="text-[#3b3240] text-[10px] uppercase font-bold block mb-0.5">Flag Trigger Pattern:</span>
                          <span className="text-[#1f1823] font-mono text-xs font-bold">{g.rule_pattern}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-[#e6e8f4] text-xs">
                      {g.rationale && (
                        <p className="text-[#3b3240]">
                          <strong className="text-[#1f1823]">Rationale: </strong>
                          {g.rationale}
                        </p>
                      )}
                      {g.remediation_template && (
                        <p className="text-[#214d3b]">
                          <strong>Remediation Template: </strong>
                          {g.remediation_template}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {}
            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="clay-cushion-mint p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#214d3b]">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#214d3b] shrink-0" />
                    <span>Canonical facts ground assertions in BrandSphere AI and demand certified metric citations before release.</span>
                  </span>
                  <span className="px-3 py-1 bg-[#fffdf7] rounded-full font-bold self-start sm:self-auto shrink-0 shadow-sm">
                    SOC 2 Audited
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredFacts.map((fact) => (
                    <div
                      key={fact.id}
                      className="clay-cushion !bg-[#fffdf7] clay-cushion-hover !rounded-[24px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-0.5 rounded-full bg-[#c0efdc] text-[#214d3b] text-xs font-bold">
                            {fact.topic}
                          </span>
                          <span className="text-xs text-[#214d3b] font-bold">
                            ● Approved Metric: <strong className="text-[#1f1823]">{fact.approved_metric}</strong>
                          </span>
                        </div>
                        <p className="text-[#1f1823] text-sm font-extrabold">{fact.claim_statement}</p>
                        <p className="text-xs text-[#3b3240] flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-[#1f1823]" />
                          <span>Approved Citation: </span>
                          <span className="font-mono text-[11px] text-[#1f1823] font-bold">{fact.source_citation}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFact(fact.id)}
                        className="p-2 rounded-full bg-[#ffd6e0] text-[#63192e] self-start md:self-center cursor-pointer"
                        title="Delete fact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {activeTab === "glossary" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGlossary.map((term) => (
                  <div
                    key={term.id}
                    className="clay-cushion !bg-[#fffdf7] !rounded-[24px] p-5 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            term.category === "prohibited"
                              ? "bg-[#ffd6e0] text-[#63192e]"
                              : "bg-[#f9e7a8] text-[#59470c]"
                          }`}
                        >
                          {term.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTerm(term.id)}
                          className="text-[#3b3240] hover:text-[#63192e] cursor-pointer"
                          title="Delete term"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="text-[11px] text-[#3b3240] font-bold mb-0.5">Deprecated Phrase:</div>
                        <div className="text-[#63192e] line-through font-mono text-xs font-bold">{term.term}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-[11px] text-[#3b3240] font-bold mb-0.5">Approved Replacement:</div>
                        <div className="text-[#214d3b] font-extrabold text-xs flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#214d3b]" />
                          <span>{term.replacement}</span>
                        </div>
                      </div>
                    </div>
                    {term.note && (
                      <p className="text-[11px] text-[#3b3240] italic pt-2 border-t border-[#e6e8f4]">{term.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {}
            {activeTab === "assets" && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="clay-cushion !bg-[#fffdf7] !rounded-[24px] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-[#f1f2fa] text-[#1f1823] rounded-full uppercase">
                        {asset.asset_type}
                      </span>
                    </div>

                    {asset.asset_type === "color" && (
                      <div
                        className="w-full h-16 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),2px_4px_8px_rgba(56,49,57,0.1)] flex items-center justify-center font-mono text-xs font-bold text-white"
                        style={{ backgroundColor: asset.value }}
                      >
                        {asset.value}
                      </div>
                    )}

                    <div>
                      <h4 className="font-extrabold text-[#1f1823] text-sm mb-0.5">{asset.asset_name}</h4>
                      <p className="text-xs font-mono font-bold text-[#3b3240]">{asset.value}</p>
                    </div>

                    {asset.description && <p className="text-[11px] text-[#3b3240]">{asset.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1823]/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="clay-tray !bg-[#fffdf7] !rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e8f4]">
              <h3 className="text-lg font-extrabold text-[#1f1823] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#f6a3ca]" />
                <span>Add to Knowledge Base ({activeTab.toUpperCase()})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#3b3240] hover:text-[#1f1823] hover:bg-[#fffdf7] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#1f1823]" />
              </button>
            </div>

            {activeTab === "guidelines" && (
              <form onSubmit={handleCreateGuideline} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">
                    Guideline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuideline.name}
                    onChange={(e) => setNewGuideline({ ...newGuideline, name: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g. Executive Social Media Policy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={newGuideline.category}
                      onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value })}
                      className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    >
                      <option value="claims">claims</option>
                      <option value="tone">tone</option>
                      <option value="terminology">terminology</option>
                      <option value="visual">visual</option>
                      <option value="accessibility">accessibility</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Version</label>
                    <input
                      type="text"
                      value={newGuideline.version}
                      onChange={(e) => setNewGuideline({ ...newGuideline, version: e.target.value })}
                      className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                      placeholder="v1.0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={newGuideline.description}
                    onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none resize-none"
                    placeholder="Explain the policy requirement..."
                  />
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Trigger Pattern</label>
                  <input
                    type="text"
                    value={newGuideline.rule_pattern}
                    onChange={(e) => setNewGuideline({ ...newGuideline, rule_pattern: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="Comma separated words (e.g. unbeatable, 100% zero downtime)"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="clay-pill-secondary px-5 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="clay-pill-primary px-6 py-2 text-xs"
                  >
                    {submittingModal ? "Saving..." : "Save Guideline"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "facts" && (
              <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Topic *</label>
                  <input
                    type="text"
                    required
                    value={newFact.topic}
                    onChange={(e) => setNewFact({ ...newFact, topic: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g., Latency Benchmark"
                  />
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Canonical Statement *</label>
                  <textarea
                    required
                    rows={2}
                    value={newFact.claim_statement}
                    onChange={(e) => setNewFact({ ...newFact, claim_statement: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none resize-none"
                    placeholder="Verifiable factual claim..."
                  />
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Approved Metric *</label>
                  <input
                    type="text"
                    required
                    value={newFact.approved_metric}
                    onChange={(e) => setNewFact({ ...newFact, approved_metric: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g., 99.99% uptime"
                  />
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Citation *</label>
                  <input
                    type="text"
                    required
                    value={newFact.source_citation}
                    onChange={(e) => setNewFact({ ...newFact, source_citation: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g., SLA Audit Report 2026, Section 2"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="clay-pill-secondary px-5 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="clay-pill-primary px-6 py-2 text-xs"
                  >
                    {submittingModal ? "Saving..." : "Save Verified Fact"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "glossary" && (
              <form onSubmit={handleCreateTerm} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Deprecated Phrase *</label>
                  <input
                    type="text"
                    required
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g., legacy dashboard"
                  />
                </div>
                <div>
                  <label className="block text-[#1f1823] font-bold uppercase tracking-wider mb-1.5">Approved Replacement *</label>
                  <input
                    type="text"
                    required
                    value={newTerm.replacement}
                    onChange={(e) => setNewTerm({ ...newTerm, replacement: e.target.value })}
                    className="clay-well w-full px-3.5 py-2.5 text-[#1f1823] focus:outline-none"
                    placeholder="e.g., Enterprise Governance Hub"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="clay-pill-secondary px-5 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingModal}
                    className="clay-pill-primary px-6 py-2 text-xs"
                  >
                    {submittingModal ? "Saving..." : "Save Term"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "assets" && (
              <div className="text-xs text-[#3b3240] py-6 text-center space-y-3">
                <p>Design tokens are configured in the global brand theme. You can manage policies and facts above.</p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="clay-pill-secondary px-6 py-2.5 text-xs"
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