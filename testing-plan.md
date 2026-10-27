# 🧪 BrandSphere AI — Comprehensive Testing & Quality Assurance Plan

> **Platform**: BrandSphere AI — Intelligent Pre-Publication Brand Governance Platform
> **Team**: CIPHER CODERS (Ishaan Ray & Rishi Prajapati)
> **Version**: 1.1.0
> **Test Status**: 20/20 Automated Tests Passing (100% Pass Rate)

---

## 🎯 1. Testing Objectives & Strategy

The BrandSphere AI test harness guarantees:

1. **Zero Silent Failures**: Every upload, revision, or review decision returns an explicit HTTP status and structured payload.
2. **ACID Persistence Across Restarts**: Document status, issues, and audit records survive backend server restarts.
3. **Data Integrity & Cascading Cleanups**: Deleting documents cascades cleanly across all child issues, reviews, revisions, and threaded comments.
4. **Validation & Security**: Rejects empty payloads, malformed JSON, and invalid review state transitions with proper 422/404 HTTP codes.
5. **Frontend Zero-Regression**: Enforced with strict TypeScript compilation (`tsc --noEmit`) and clean Next.js production builds (`next build`).

---

## 📊 2. Automated Test Suite Matrix (`backend/tests/`)

Run the complete test suite anytime with:

```bash
python -m pytest backend/tests/ -v
```

### Test Coverage Summary:


| Test File                   | Test Case                                             | Purpose & Verification Scope                                                      | Status |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- | :-------: |
| `test_api.py`               | `test_root_endpoint`                                  | Verifies API health, version string, and persistent database flag                 | ✅ PASS |
| `test_api.py`               | `test_upload_document_success`                        | Validates document scanning, Flesch readability, and issue generation             | ✅ PASS |
| `test_api.py`               | `test_upload_document_validation_errors`              | Rejects missing title, content, or author with HTTP 422                           | ✅ PASS |
| `test_api.py`               | `test_get_documents_list`                             | Asserts document list enumeration and sorting                                     | ✅ PASS |
| `test_api.py`               | `test_get_document_by_id_success`                     | Verifies fetching a specific document with populated issues array                 | ✅ PASS |
| `test_api.py`               | `test_get_document_nonexistent_returns_404`           | Non-existent UUID returns HTTP 404 with structured detail                         | ✅ PASS |
| `test_api.py`               | `test_review_status_transitions`                      | Validates status transitions (`pending_review` -> `approved`)                     | ✅ PASS |
| `test_api.py`               | `test_submit_review_nonexistent_document_returns_404` | Reviewing a ghost document raises HTTP 404                                        | ✅ PASS |
| `test_api.py`               | `test_submit_review_invalid_status_returns_422`       | Submitting invalid review state (e.g. `invalid_state`) raises HTTP 422            | ✅ PASS |
| `test_api.py`               | `test_analytics_metrics`                              | Validates compliance rate, total documents, and severity distribution             | ✅ PASS |
| `test_api.py`               | `test_guidelines_endpoint`                            | Validates retrieval of default corporate governance guidelines                    | ✅ PASS |
| `test_extended_features.py` | `test_guideline_crud_and_seeding`                     | Verifies adding, reading, and deleting custom brand policies                      | ✅ PASS |
| `test_extended_features.py` | `test_approved_facts_library`                         | Tests CRUD operations on the canonical enterprise facts base                      | ✅ PASS |
| `test_extended_features.py` | `test_glossary_terms_and_enforcement`                 | Tests terminology dictionary and replacement rules                                | ✅ PASS |
| `test_extended_features.py` | `test_remediation_and_revision_flow`                  | Tests 1-click remediation, version increment (`v1` -> `v2`), and issue resolution | ✅ PASS |
| `test_extended_features.py` | `test_collaborative_threaded_comments`                | Verifies threaded discussion notes attached to document IDs                       | ✅ PASS |
| `test_extended_features.py` | `test_certified_publication_export`                   | Verifies SHA-256 hash generation on approved documents                            | ✅ PASS |
| `test_extended_features.py` | `test_delete_document_and_cascading_cleanup`          | Verifies cascading deletion of issues, reviews, and revisions                     | ✅ PASS |
| `test_extended_features.py` | `test_seed_demo_documents_endpoint`                   | Verifies `POST /api/demo/seed` creates 3 realistic sample documents               | ✅ PASS |
| `test_persistence.py`       | `test_persistence_across_restarts`                    | Simulates database engine reboot and asserts state persistence                    | ✅ PASS |

---

## 🖥️ 3. Frontend Compilation & Type Integrity

Run both checks before pushing code or submitting:

```bash
# 1. TypeScript Strict Typecheck
cd frontend
npm run typecheck
# Output: tsc --noEmit (0 errors)

# 2. Production Build & Static Prerendering
cd frontend
npm run build
# Output:
# ✓ Compiled successfully in 3.1s
# ✓ Generating static pages (9/9)
# Route (app): /, /_not-found, /analytics, /dashboard, /guidelines, /review, /upload
```

---

## 📋 4. User Acceptance Testing (UAT) Manual Scenarios

Use this checklist to verify the full user journey:

### Scenario 1: Unsubstantiated Claim Detection & 1-Click Remediation

- [ ]  Submit copy containing *"fastest platform in the world with 100% zero downtime"*.
- [ ]  Verify the scanner flags both issues as **Critical** and **Moderate**.
- [ ]  Verify the issue displays the rule citation (`Claims Policy v1.0`).
- [ ]  Click **"1-Click Context Remediation"** in the review studio.
- [ ]  Verify the copy updates in place, version updates from `v1` to `v2`, and issue marks as resolved.

### Scenario 2: Multimodal Creative Asset & WCAG Legibility

- [ ]  Upload an image with yellow text on white background (bad contrast).
- [ ]  Verify the vision engine flags `WCAG AA: FAIL (<4.5:1)`.
- [ ]  Upload an image with high-contrast palette (indigo/slate).
- [ ]  Verify the vision engine flags `WCAG AA: PASS (>=4.5:1)` and extracts HEX swatches.

### Scenario 3: Persona-Driven Governance Review

- [ ]  Select **✍️ Content Creator**: Can edit draft and request review.
- [ ]  Select **🛡️ Brand Reviewer**: Can approve, reject, or request revision with comments.
- [ ]  Select **⚖️ Legal & Compliance**: Approving generates official certificate.
- [ ]  Verify certificate displays a 64-character SHA-256 verification hash.

### Scenario 4: Guideline Clarity Index (GCI) Telemetry

- [ ]  Navigate to `/analytics`.
- [ ]  Verify that policies with repeated violations appear in the **Guideline Clarity Index** with actionable advice.
- [ ]  Click **"Export Audit Report (JSON)"** and verify valid JSON downloads.

---

## ⚡ 5. Edge Cases & Boundary Handling

1. **Empty Input Fields**: Submitting whitespace-only titles or content triggers client-side validation and HTTP 422 on the backend.
2. **Massive Content Ingestion**: Tested with documents up to 50,000 words; regex scanner and readability formula execute in sub-100ms.
3. **Special Characters & Unicode**: Tested with emojis, quotes (`“`, `”`, `—`), and non-Latin scripts without encoding corruption.
4. **Orphan Document Navigation**: Navigating to `/review?id=non-existent-uuid` displays a graceful error banner rather than a crash.
