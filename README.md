# BrandSphere AI — Intelligent Pre-Publication Brand Governance Platform
> **Hackathon Submission by Team CIPHER CODERS**  
> **Team Members**: Ishaan Ray (Team Leader) & Rishi Prajapati  
> **Event**: Inkloom AI Hackathon — Round 2 (The Build)

---

## 🌟 Executive Summary & Vision

Growing modern enterprises deploy dozens of internal authors, regional teams, external PR/marketing agencies, and autonomous AI copilot tools. This velocity inevitably introduces **Brand Entropy**:
- **Unsupported Promotional Claims**: Unverified statistics and regulatory risks slip into public copy.
- **Outdated Terminology & Naming**: Deprecated product names published without notice.
- **Tone & Voice Drift**: Inconsistent tone across decentralised global channels.
- **Visual & Design Discord**: Off-brand color palettes and WCAG accessibility contrast failures.

**BrandSphere AI** is an intelligent pre-publication brand-governance copilot that validates content *before* release against approved enterprise guidelines, canonical truth bases, and design design tokens.

Instead of blunt rejections, BrandSphere **educates rather than gates**: it explains each issue, cites the exact corporate policy, and provides **1-click context-preserving remediation** that upholds author intent while preserving human-in-the-loop sovereignty.

---

## 🚀 Key Features & Capabilities (Round 2 Deliverables)

### 1. 📚 Dynamic Brand Knowledge Base & Truth Library (`/guidelines`)
- **Interactive Policy Manager**: Define, import, and manage enterprise brand policies across Claims, Tone, Terminology, Visuals, and Accessibility.
- **Canonical Fact Sheet Library**: Verifiable enterprise truth sources cross-referenced with approved metrics and citations.
- **Terminology & Glossary Harmonizer**: Active vs. deprecated product naming standards.
- **Design Tokens**: Standardized HEX palettes, logo clearance, and contrast tokens.

### 2. 🎨 Multi-Modal Visual Brand Asset Auditor
- Built-in **Computer Vision Engine** (via Pillow) analyzing creative banners and ad graphics.
- Extracts dominant HEX color palettes and calculates Euclidean color distance against brand tokens.
- Verifies **WCAG 2.1 AA / AAA contrast ratios** (minimum 4.5:1 / 3:1) with instant pass/fail telemetry.

### 3. 🧠 Deep Pre-Publication Governance Engine
- **Promotional Superlative & Claim Guard**: Flags ungrounded claims (`fastest`, `#1`, `guaranteed 100%`) and demands citation from the canonical fact library.
- **Tone & Enterprise Voice Scanner**: Detects informal colloquialisms and aggressive hyperbole.
- **Readability & Cognitive Accessibility**: Computes Flesch Reading Ease and Flesch-Kincaid Grade Level, flagging overly dense sentences (>35 words).

### 4. ⚡ 1-Click Context-Preserving Remediation & Version Snapshots
- Authors and reviewers can click **"1-Click Context Remediation"** to immediately patch the document text.
- Automatically saves new version snapshots (`v1`, `v2`, `v3`) with full diff tracking and audit logging.

### 5. 👥 Multi-Tier Collaborative Review Studio (`/review`)
- **Persona Switcher**: Switch seamlessly between **Content Creator**, **Brand Reviewer**, and **Legal & Compliance Admin**.
- **Threaded Review Collaboration**: Leave discussion notes and revision feedback directly on the draft.
- **Audit Trail**: Cryptographic, chronological audit trail recording every event (upload, scan, edit, remediation, review).

### 6. 🏆 Certified Publication with Cryptographic Verification
- Approved releases generate an official **Brand Compliance Certificate**.
- Features a **SHA-256 tamper-evident verification hash**, reviewer signature, audit timestamp, and compliance scores.

### 7. 📊 Guideline Clarity Index (GCI) & Telemetry (`/analytics`)
- Dynamic analytics calculating compliance pass rates, severity breakdown, and recurring friction points.
- **Guideline Clarity Index**: Identifies which policies generate the highest employee confusion and provides AI recommendations for policy refinement.

---

## 🛠️ System Architecture & Technology Stack

| Layer | Technologies Used | Key Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons | Responsive obsidian dark-mode UX, review studio, diffs |
| **Backend API** | FastAPI, Uvicorn, Python 3.13, Pydantic v2 | High-throughput async REST endpoints, JSON schema validation |
| **Persistence** | SQLite, SQLAlchemy 2.0 ORM | ACID-compliant storage for documents, issues, guidelines, audit logs |
| **Multi-Modal Vision** | Pillow (PIL), NumPy | Dominant color quantization, WCAG contrast calculation |
| **Testing** | Pytest, Pytest-Asyncio, HTTPX | 18 automated unit and persistence tests (100% pass rate) |

---

## 🏃 Getting Started & Local Setup

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js 25.6)
- Git

---

### Step 1: Run the Backend API

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start the FastAPI backend server:
   ```bash
   python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
3. The API will be live at:
   - API Root: `http://localhost:8001`
   - Interactive Swagger Docs: `http://localhost:8001/docs`

---

### Step 2: Run the Frontend UI

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser to:
   - `http://localhost:3000`

---

## 🧪 Running Automated Tests

Run the backend test suite:
```bash
python -m pytest backend/tests/ -v
```
**Test Results: 18 / 18 Tests Passed (100%)**
- `test_root_endpoint`: Health and persistence status verification.
- `test_upload_document_success`: End-to-end multi-issue scanning.
- `test_upload_document_validation_errors`: 422 schema input validation.
- `test_get_documents_list` & `test_get_document_by_id_success`: Document retrieval.
- `test_review_status_transitions`: Multi-stage approval lifecycle.
- `test_guidelines_endpoint`: Policy catalog verification.
- `test_guideline_crud_and_seeding`: Knowledge base CRUD.
- `test_approved_facts_library`: Canonical fact assertions.
- `test_glossary_terms_and_enforcement`: Deprecated terminology detection.
- `test_remediation_and_revision_flow`: 1-click remediation & v2 snapshot generation.
- `test_collaborative_threaded_comments`: Reviewer discussion threads.
- `test_certified_publication_export`: SHA-256 compliance certificate generation.
- `test_persistence_across_restarts`: Process-restart SQLite disk persistence.

---

## 🛡️ Responsible AI, Privacy & Security

- **Zero-Retention Inference**: Enterprise assets and draft marketing materials are never stored or used to train external public models.
- **Human-in-the-Loop Sovereignty**: Machine recommendations assist decision-making; final sign-off is retained exclusively by authorized human reviewers.
- **Auditable Paper Trail**: Every edit and approval is logged in the immutable audit trail.

---

## 👥 Team CIPHER CODERS
- **Ishaan Ray** — AI Systems Architecture, RAG Compliance Engine, Grounding & Evaluation Pipelines
- **Rishi Prajapati** — Full-Stack Development, Collaborative Review UI/UX, Real-Time Approval Workflows, Analytics Dashboard
