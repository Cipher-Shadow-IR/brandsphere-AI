# 🚀 BrandSphere AI — Execution Runbook & Live Demo Guide

> **Project**: BrandSphere AI — Intelligent Pre-Publication Brand Governance Platform  
> **Team**: CIPHER CODERS (Ishaan Ray & Rishi Prajapati)  
> **Event**: Inkloom AI Hackathon (Round 2 & 3)

---

## ⚡ 1. Rapid Startup (One-Liners)

Open two terminal tabs in the project root directory:

### Terminal 1: Backend API (FastAPI)
```bash
# Option A: From inside backend directory
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

# OR Option B: From project root directory
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
```
- **API URL**: [http://127.0.0.1:8001/](http://127.0.0.1:8001/)
- **Swagger Documentation**: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

### Terminal 2: Frontend UI (Next.js 16)
```bash
# Navigate to frontend and start Turbopack dev server
cd frontend
npm install
npm run dev
```
- **Web App**: [http://localhost:3000/](http://localhost:3000/)

---

## 🎬 2. The 3-Minute Live Demo Script (Hackathon Winning Flow)

Follow this exact sequence to demonstrate the platform to judges:

### Step 1: The Hook — Interactive Landing Page (`/`)
1. Open [http://localhost:3000/](http://localhost:3000/).
2. Scroll to the **Interactive Remediation Simulator**:
   - Point out the red-flagged original text (*"fastest cloud platform in the world"*, *"old version bottlenecks"*).
   - Click the **"⚡ 1-Click Brand Remediation"** button.
   - Watch the copy instantly transform into compliant, grounded text with verified citations (*"up to 80% reduction according to Inkloom Enterprise Study 2026"*).
3. Showcase the **Persona Quadrant Matrix** (Creators, Reviewers, Legal Admins).

### Step 2: Content Dashboard & Demo Data (`/dashboard`)
1. Click **"Dashboard"** in the top navigation bar ([http://localhost:3000/dashboard](http://localhost:3000/dashboard)).
2. If your database is empty, click **"⚡ Seed Demo Submissions"**.
3. Point out the live telemetry:
   - **4 KPI Counters**: Total Ingested Documents, Certified Approved, Pending Reviews, Violations Detected.
   - **Status Filtering**: Filter between *Pending Review*, *Approved*, and *Needs Revision*.
   - **Readability & WCAG Chips**: Instant visibility into reading ease (e.g. `78/100`) and contrast ratios.
   - **Cascading Delete**: Click the trash icon on any card to show safe deletion with confirmation.

### Step 3: Pre-Publication Brand Scanner (`/upload`)
1. Click **"Upload Content"** ([http://localhost:3000/upload](http://localhost:3000/upload)).
2. Click the quick preset button: **"⚠️ High-Risk Draft"**.
   - Notice how Title, Author, Format, and draft content auto-populate with superlative claims (*"unbeatable price"*, *"guaranteed 100% zero downtime"*).
3. *(Optional Multimodal Demo)*: Click **"Upload Image Banner"** and select any marketing image or sample banner.
   - The computer vision engine extracts the dominant HEX palette swatches.
   - Evaluates WCAG 2.1 AA text-over-image luminance contrast (e.g. `Fail (2.1:1)` or `Pass (5.4:1)`).
4. Click **"Scan Content Against Brand Guidelines"**.
5. The analysis finishes with an interactive results summary showing flagged findings, reading ease, and guideline citations.
6. Click **"Open in Collaborative Review Studio"**.

### Step 4: Multi-Persona Review Studio (`/review`)
1. You are now in the collaborative review workspace ([http://localhost:3000/review?id=...](http://localhost:3000/review?id=...)).
2. Demonstrate the **Persona Switcher** in the top ribbon:
   - Click **✍️ Content Creator**: Notice author perspective.
   - Click **🛡️ Brand Reviewer**: Reviewer actions unlocked.
   - Click **⚖️ Legal & Compliance**: Legal signoff perspective.
3. Test **1-Click Context Remediation**:
   - On the right-hand panel, find an issue (e.g., *Promotional Superlative*).
   - Click **"Wand: 1-Click Context Remediation"**.
   - The draft text on the left updates instantly, the issue flips to **"✅ Resolved"**, and the resolved counter increments!
4. Check **Version History**:
   - Click the **"Revisions"** tab to show that saving or remediating created an immutable snapshot (`v2`).
5. Add a **Threaded Comment**:
   - Type *"Legal approved with benchmark citation"* in the discussion box and click **Send**.
6. **Decision & Certification**:
   - Click **"Approve Publication"**.
   - Click the glowing **"🏆 View Compliance Certificate"** button.
   - Show the official **Brand Compliance Certificate modal** with the cryptographic SHA-256 verification hash, reviewer ID, timestamp, and the **"Print / Download Certificate"** button.

### Step 5: Knowledge Base & Enterprise Analytics (`/guidelines` & `/analytics`)
1. Head to **Guidelines & KB** ([http://localhost:3000/guidelines](http://localhost:3000/guidelines)):
   - Explore the 4 tabs: **Brand Policies**, **Approved Facts Library**, **Terminology Glossary**, and **Design Tokens**.
   - Search for *"latency"* or *"claims"*.
   - Click **"Add New Entry"** to show real-time persistence.
2. Head to **Analytics** ([http://localhost:3000/analytics](http://localhost:3000/analytics)):
   - Highlight the **Guideline Clarity Index (GCI)** which reveals which brand policies confuse teams the most.
   - View the severity breakdown and category distribution bars.
   - Click **"Export Audit Report (JSON)"** to download the machine-readable audit report.

---

## 🛠️ 3. Troubleshooting & Common Fixes

| Issue | Cause | Solution |
|---|---|---|
| `[Errno 10048] address already in use: 8001` | Stale uvicorn process running in background | Run `netstat -ano \| findstr :8001`, then kill the PID using `Stop-Process -Id <PID> -Force` |
| `Failed to fetch` on frontend | Backend is not running or CORS blocked | Ensure backend is running on `http://127.0.0.1:8001`. Check `frontend/src/lib/api.ts` |
| Missing demo data | Clean database initialization | Click **"⚡ Seed Demo Submissions"** on the `/dashboard` page |
| SQLite table errors | Out-of-sync schema during development | Delete `backend/brandsphere.db` and restart backend to reinitialize clean tables |
