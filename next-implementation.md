# 🚀 BrandSphere AI — Next Implementation & Teammate Contribution Guide

> **Project**: BrandSphere AI — Intelligent Pre-Publication Brand Governance Platform  
> **Team**: CIPHER CODERS (Ishaan Ray & Rishi Prajapati)  
> **Event**: Inkloom AI Hackathon — Round 2 (The Build) & Round 3 (The Finish)  
> **Date**: October 2026  
> **Current Build Status**: Frontend (Next.js 16) & Backend (FastAPI) passing all 20 automated tests and production builds with zero errors.

---

## 📌 Executive Summary for Teammates

Welcome to the BrandSphere AI codebase! This document is designed to give you an immediate, zero-friction onboarding experience. It summarizes what is already built, maps the repository architecture, defines the next high-priority features mandated by the **Inkloom AI Problem Statement (PS)**, and provides copy-pasteable development steps.

---

## 🏗️ Current System Architecture & Status

```
   ┌───────────────────────────────────────────────────────────────┐
   │                  Next.js 16 Frontend (Port 3000)              │
   │  Obsidian Dark Executive Theme (Tailwind CSS v4 + Lucide)     │
   │                                                               │
   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐ │
   │  │  Landing   │ │ Dashboard  │ │  Scanner   │ │   Studio    │ │
   │  │    (/)     │ │(/dashboard)│ │  (/upload) │ │  (/review)  │ │
   │  └────────────┘ └────────────┘ └────────────┘ └─────────────┘ │
   │  ┌───────────────────────────┐ ┌───────────────────────────┐ │
   │  │  Knowledge Base (/guide)  │ │   Analytics (/analytics)  │ │
   │  └───────────────────────────┘ └───────────────────────────┘ │
   └───────────────────────────────┬───────────────────────────────┘
                                   │ REST API (JSON)
                                   ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                   FastAPI Backend (Port 8001)                 │
   │                                                               │
   │  ┌─────────────────────────┐   ┌───────────────────────────┐  │
   │  │ Pre-Publication Engine   │   │ Multi-Modal Vision Engine │  │
   │  │ (Flesch, Claims, Terms) │   │ (Pillow CV, WCAG Contrast)│  │
   │  └─────────────────────────┘   └───────────────────────────┘  │
   │  ┌─────────────────────────┐   ┌───────────────────────────┐  │
   │  │ 1-Click Remediation     │   │ SHA-256 Crypto Certificate│  │
   │  └─────────────────────────┘   └───────────────────────────┘  │
   └───────────────────────────────┬───────────────────────────────┘
                                   │ SQLAlchemy 2.0 ORM
                                   ▼
   ┌───────────────────────────────────────────────────────────────┐
   │                  Persistent SQLite Database                   │
   │   (documents, issues, reviews, revisions, comments, facts)   │
   └───────────────────────────────────────────────────────────────┘
```

### ✅ What is Already Built & Working:
1. **Persistent Database**: SQLite via SQLAlchemy 2.0 ORM (`backend/app/database.py` and `backend/app/models.py`) with models for documents, issues, revisions, threaded comments, reviews, guidelines, facts, glossary terms, and brand tokens.
2. **Pre-Publication Governance Engine**: Regex claim extraction, superlative detectors, readability metrics (Flesch-Kincaid), and terminology checks (`backend/app/governance_engine.py`).
3. **Multimodal Computer Vision Engine**: Extracts dominant colors via Pillow, calculates Euclidean delta from brand tokens, and evaluates WCAG 2.1 AA luminance contrast.
4. **Interactive Review Studio**: 3-persona switcher (Creator, Reviewer, Legal Admin), inline draft editor, version snapshots (`v1`, `v2`, etc.), threaded discussion comments, and 1-click remediation.
5. **Cryptographic Certificate**: SHA-256 tamper-evident compliance certification for approved collateral.
6. **Executive Dark-Mode UI**: Reusable glassmorphic `<Navbar />`, responsive tokens, demo seeding buttons, and GCI analytics.
7. **Automated Test Suite**: 20/20 backend tests passing in `backend/tests/`.

---

## 🛠️ Quick Local Setup

### 1. Backend Setup
```bash
# If you are in the backend directory:
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

# OR if you are in the project root:
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
```
- API Health Check: [http://127.0.0.1:8001/](http://127.0.0.1:8001/)
- Interactive Swagger UI: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

### 2. Frontend Setup
```bash
# In a second terminal:
cd frontend
npm install

# Start Next.js development server (Port 3000)
npm run dev
```
- Web Application: [http://localhost:3000/](http://localhost:3000/)

### 3. Verification Commands
```bash
# Verify backend tests (must always pass 20/20)
python -m pytest backend/tests/ -v

# Verify frontend types and production build
cd frontend
npm run typecheck
npm run build
```

---

## 🗺️ File & Folder Map

```
├── backend/
│   ├── app/
│   │   ├── main.py              # All REST API route handlers
│   │   ├── database.py          # SQLAlchemy engine, session & init_db
│   │   ├── models.py            # ORM DB schemas (Document, Issue, Fact, etc.)
│   │   ├── schemas.py           # Pydantic v2 validation models
│   │   ├── governance_engine.py # Rule scanner, Pillow CV & readability formulas
│   │   └── seed_data.py         # Default enterprise guidelines & fact base
│   └── tests/
│       ├── test_api.py          # Core API & validation tests
│       ├── test_extended_features.py # Multimodal, revision, delete & seed tests
│       └── test_persistence.py  # Application restart persistence verification
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing page with interactive live simulator
│   │   │   ├── dashboard/       # Document management & status filtering
│   │   │   ├── upload/          # Brand scanner with text & multimodal vision
│   │   │   ├── review/          # Persona studio, 1-click fix & certificate modal
│   │   │   ├── guidelines/      # Policies, facts, glossary & token manager
│   │   │   ├── analytics/       # GCI metrics & telemetry
│   │   │   └── globals.css      # Design tokens, ambient mesh & glass styles
│   │   ├── components/
│   │   │   └── Navbar.tsx       # Shared executive navigation bar
│   │   └── lib/
│   │       └── api.ts           # API base URL configuration (port 8001)
│   └── package.json
```

---

## 🎯 Next Implementation Tasks (Prioritized by Problem Statement)

Choose any of the following self-contained tasks to contribute:

---

### 📦 Task 1: Multi-Format Document Ingestion (`.pdf` and `.docx`)
- **Problem Statement Mandate**: *"Review text, images, documents or other supported content formats before publication."*
- **Objective**: Allow users to drag-and-drop `.pdf` or `.docx` files on the `/upload` page in addition to `.txt` and raw copy.
- **Backend Work (`backend/app/`)**:
  1. Add `pypdf` (or `pdfplumber`) and `python-docx` to `backend/requirements.txt`.
  2. Create a utility function `backend/app/document_parser.py`:
     ```python
     def extract_text_from_pdf(file_bytes: bytes) -> str:
         # extracts text, strips headers/footers, preserves paragraphs
         ...

     def extract_text_from_docx(file_bytes: bytes) -> str:
         # extracts paragraph text and headings
         ...
     ```
  3. Create an endpoint `POST /api/documents/upload-file` accepting `UploadFile = File(...)`.
- **Frontend Work (`frontend/src/app/upload/page.tsx`)**:
  - Update the file input `accept` attribute to: `.txt,.md,.json,.pdf,.docx`.
  - Add visual file type badge (e.g. `PDF` or `DOCX` chip) and populate document title automatically from file name.
- **Acceptance Criteria**:
  - Uploading a sample `.pdf` or `.docx` extracts clean text and redirects directly to the `/review` studio with flagged findings.

---

### 🔍 Task 2: Side-by-Side Visual Diff Studio (Before vs. Remediated)
- **Problem Statement Mandate**: *"Support review and approval workflow through which creators, managers and authorised reviewers can collaborate and track changes... explain each issue and suggest corrections."*
- **Objective**: In the `/review` page, provide a toggle between standard draft view and an interactive side-by-side or inline visual diff.
- **Frontend Work (`frontend/src/app/review/page.tsx`)**:
  1. Add a toggle button: `[Document View] | [Visual Diff View]`.
  2. In `Visual Diff View`:
     - Highlight flagged/original text with a light red strikethrough background (`bg-rose-500/20 text-rose-300 line-through`).
     - Highlight the remediated text with an emerald background (`bg-emerald-500/20 text-emerald-300 font-semibold`).
  3. Clicking on any highlighted segment scrolls to and highlights the corresponding finding card on the right panel.
- **Acceptance Criteria**:
  - Reviewers can instantly see exactly what copy was changed between versions `v1` and `v2`.

---

### 🧠 Task 3: Grounded Semantic RAG Engine & Citation Confidence
- **Problem Statement Mandate**: *"Explain why an issue was flagged and identify the guideline or approved source involved... grounded RAG over approved brand guidelines and fact bases."*
- **Objective**: Upgrade the policy matching from simple keyword regex to semantic similarity search.
- **Backend Work (`backend/app/governance_engine.py`)**:
  1. Add vector cosine similarity (using `scikit-learn` TF-IDF or `fastembed` / `sentence-transformers`).
  2. Index all active guidelines and canonical facts into memory on startup.
  3. When analyzing document sentences:
     - Compute cosine similarity between sentence embeddings and guideline/fact embeddings.
     - Attach a `confidence_score` (e.g., `0.94` = 94%) to each issue.
     - Return the exact excerpt of the approved truth source.
- **Frontend Work**:
  - Display the `Confidence: 94%` pill inside the issue card in `/review` and `/upload`.
- **Acceptance Criteria**:
  - Sentences with subtle semantic drift (not just exact keywords) are identified and cited with high accuracy.

---

### 🛡️ Task 4: Client-Side Confidentiality & AI Disclosure Center
- **Problem Statement Mandate**: *"Protect confidential brand materials and clearly disclose the use of AI or external services."*
- **Objective**: Provide enterprise privacy controls and formal AI disclosures.
- **Frontend Work (`frontend/src/components/` & `/upload`)**:
  1. Add a **"Confidentiality & Privacy Shield"** modal or popover disclosing:
     - Zero Data Retention (ZDR) guarantee.
     - Localized rule execution without external model training.
  2. Add a toggle on `/upload`: `[x] Redact PII / Confidential Names Before Analysis` (masks email addresses, phone numbers, and internal IP addresses).
- **Backend Work**:
  - Add a regex-based PII masking pre-processor in `backend/app/governance_engine.py`.
- **Acceptance Criteria**:
  - Checking the redaction toggle replaces detected PII with `[REDACTED_EMAIL]`, etc., before database storage.

---

## 🤝 Contribution Workflow & Best Practices

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Coding Standards**:
   - **Frontend**: Follow Next.js App Router guidelines and the established obsidian dark theme tokens (`#020617` background, `slate-800` borders, `cyan-400` / `indigo-500` accents). Ensure 44x44px touch targets and visible focus rings.
   - **Backend**: Strict Pydantic v2 schemas, proper FastAPI HTTP exception handling (never return raw error tuples), and SQLAlchemy 2.0 ORM conventions.
3. **Always Run Checks Before Committing**:
   ```bash
   # 1. Backend tests
   python -m pytest backend/tests/ -v

   # 2. Frontend typecheck & build
   cd frontend
   npm run typecheck
   npm run build
   ```
4. **Preserve Database Compatibility**:
   - The SQLite database file is located at `backend/brandsphere.db`. If you alter models in `backend/app/models.py`, either update `init_db()` or drop `brandsphere.db` during development so tables recreate cleanly.

---

## 📞 Questions & Support

- **Team Leader**: Ishaan Ray
- **Full-Stack Lead**: Rishi Prajapati
- **Hackathon Context**: Inkloom AI Hackathon / CODESTAR 30

Let's build a winning submission! 🚀
