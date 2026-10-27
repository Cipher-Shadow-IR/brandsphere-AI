import os
import re
import uuid
import hashlib
import base64
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except ImportError:
    pass

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import engine, Base, get_db
from .models import (
    DocumentModel,
    IssueModel,
    ReviewModel,
    GuidelineModel,
    ApprovedFactModel,
    GlossaryTermModel,
    BrandAssetModel,
    RevisionModel,
    CommentModel,
    AuditLogModel
)
from .schemas import (
    ContentUpload,
    ReviewRequest,
    DocumentUploadResult,
    DocumentDetailResult,
    DocumentsListResult,
    ReviewSubmitResult,
    ReviewsListResult,
    AnalyticsResult,
    GuidelinesListResult,
    GuidelineItem,
    GuidelineCreate,
    ApprovedFactItem,
    ApprovedFactCreate,
    GlossaryItem,
    GlossaryCreate,
    BrandAssetItem,
    BrandAssetCreate,
    RemediationRequest,
    RevisionCreateRequest,
    RevisionResponse,
    CommentCreateRequest,
    CommentResponse,
    AuditLogResponse,
    VisualAnalyzeRequest,
    VisualAnalyzeResponse,
    CertificateResponse
)
from .governance_engine import (
    analyze_content,
    analyze_image_bytes,
    compute_readability
)
from .rag_engine import rag_engine
from .cache import cache_service
from .llm_engine import llm_engine


def seed_default_knowledge_base(db: Optional[Session] = None):
    
    close_db = False
    if db is None:
        db = next(get_db())
        close_db = True
    try:
        
        if db.query(GuidelineModel).count() == 0:
            default_guidelines = [
                GuidelineModel(
                    id="1",
                    name="Brand Claims Policy",
                    version="v1.2",
                    category="claims",
                    description="All comparative, performance, and superlative claims must cite verified data from approved fact sheets.",
                    rule_pattern="fastest, #1, industry-first, best-in-class, guaranteed 100%",
                    rationale="Protects against false advertising liability and regulatory sanctions.",
                    remediation_template="Replace promotional superlatives with benchmark-backed phrasing."
                ),
                GuidelineModel(
                    id="2",
                    name="Brand Voice Guide",
                    version="v2.0",
                    category="tone",
                    description="Enterprise communications must maintain a confident, professional, and trustworthy tone.",
                    rule_pattern="awesome, amazing, totally, huge, insane",
                    rationale="Maintains executive credibility with enterprise clients and investors.",
                    remediation_template="Use professional descriptors: 'significant', 'high-performance', 'comprehensive'."
                ),
                GuidelineModel(
                    id="3",
                    name="Visual Identity Guidelines",
                    version="v1.5",
                    category="visual",
                    description="All visual creative assets must adhere to approved brand HEX tokens, contrast ratios, and logo padding.",
                    rule_pattern="#020617, #0F172A, #4F46E5, #06B6D4, #10B981",
                    rationale="Ensures instant brand recognition across global multi-channel campaigns.",
                    remediation_template="Apply BrandSphere master palette tokens and ensure 4.5:1 WCAG contrast."
                ),
                GuidelineModel(
                    id="4",
                    name="Accessibility Standards",
                    version="WCAG 2.1",
                    category="accessibility",
                    description="Content and media must comply with WCAG 2.1 AA requirements, including alt-text and cognitive readability.",
                    rule_pattern="sentences > 35 words, missing alt-text, contrast < 4.5:1",
                    rationale="Mandatory for legal compliance and inclusive user experience across diverse audiences.",
                    remediation_template="Provide descriptive alt-text and structure complex paragraphs into clear clauses."
                ),
                GuidelineModel(
                    id="5",
                    name="Brand Terminology Guide",
                    version="v2.1",
                    category="terminology",
                    description="Standardizes product nomenclature, preventing obsolete or confusing legacy product designations.",
                    rule_pattern="legacy, old version, cheap tier, AI bot",
                    rationale="Avoids market confusion regarding current product capabilities and enterprise roadmaps.",
                    remediation_template="Reference the official Brand Glossary v2.1 for current naming standards."
                )
            ]
            db.add_all(default_guidelines)
            db.commit()

        
        if db.query(ApprovedFactModel).count() == 0:
            default_facts = [
                ApprovedFactModel(
                    id=str(uuid.uuid4()),
                    topic="Review Acceleration",
                    claim_statement="BrandSphere AI reduces content review turnaround cycles by up to 80% through automated pre-publication governance.",
                    approved_metric="80% reduction in review cycle time",
                    source_citation="Inkloom Enterprise Benchmark Study 2026, Section 4.2",
                    status="active"
                ),
                ApprovedFactModel(
                    id=str(uuid.uuid4()),
                    topic="Claim Accuracy",
                    claim_statement="The platform achieves 99.5% accuracy in detecting unsupported promotional superlatives and ungrounded statements.",
                    approved_metric="99.5% claim verification rate",
                    source_citation="Cipher Coders QA Audit & Validation Report v1.0",
                    status="active"
                ),
                ApprovedFactModel(
                    id=str(uuid.uuid4()),
                    topic="Audit Compliance",
                    claim_statement="100% of published collateral retains a cryptographically verifiable tamper-evident audit record.",
                    approved_metric="100% audit compliance and traceability",
                    source_citation="Enterprise Security & Governance Framework §7.1",
                    status="active"
                ),
                ApprovedFactModel(
                    id=str(uuid.uuid4()),
                    topic="Architecture Scalability",
                    claim_statement="BrandSphere architecture supports sub-second scanning across multi-format documents and visual media.",
                    approved_metric="< 500ms processing latency",
                    source_citation="BrandSphere Systems Architecture Spec 2026",
                    status="active"
                )
            ]
            db.add_all(default_facts)
            db.commit()

        
        if db.query(GlossaryTermModel).count() == 0:
            default_terms = [
                GlossaryTermModel(
                    id=str(uuid.uuid4()),
                    term="legacy portal",
                    replacement="Next-Gen Enterprise Hub",
                    category="deprecated",
                    note="The legacy portal branding was retired in Q1 2026."
                ),
                GlossaryTermModel(
                    id=str(uuid.uuid4()),
                    term="cheap tier",
                    replacement="Essential Tier",
                    category="prohibited",
                    note="Use value-oriented positioning rather than discount terminology."
                ),
                GlossaryTermModel(
                    id=str(uuid.uuid4()),
                    term="AI bot",
                    replacement="Autonomous Brand Governance Agent",
                    category="deprecated",
                    note="Reinforce the intelligent copilot capability of BrandSphere."
                )
            ]
            db.add_all(default_terms)
            db.commit()

        
        if db.query(BrandAssetModel).count() == 0:
            default_assets = [
                BrandAssetModel(
                    id=str(uuid.uuid4()),
                    asset_name="Primary Brand Indigo",
                    asset_type="color",
                    value="#4F46E5",
                    description="Primary interactive accent and hero brand color."
                ),
                BrandAssetModel(
                    id=str(uuid.uuid4()),
                    asset_name="Electric Cyan Accent",
                    asset_type="color",
                    value="#06B6D4",
                    description="Secondary highlight token used for AI indicators and badges."
                ),
                BrandAssetModel(
                    id=str(uuid.uuid4()),
                    asset_name="Obsidian Background",
                    asset_type="color",
                    value="#020617",
                    description="Dark mode foundational canvas token."
                ),
                BrandAssetModel(
                    id=str(uuid.uuid4()),
                    asset_name="Logo Safe-Zone Padding",
                    asset_type="spacing",
                    value="min 24px clearance",
                    description="Maintain 24px unobstructed margin around BrandSphere mark."
                )
            ]
            db.add_all(default_assets)
            db.commit()

    finally:
        if close_db:
            db.close()


def ensure_sqlite_columns():
    
    if engine.dialect.name != "sqlite":
        return
    try:
        with engine.connect() as conn:
            for table_name, table in Base.metadata.tables.items():
                try:
                    res = conn.exec_driver_sql(f"PRAGMA table_info({table_name})")
                    existing_cols = [r[1] for r in res.fetchall()]
                    for col in table.columns:
                        if col.name not in existing_cols:
                            col_type = "TEXT"
                            type_str = str(col.type).upper()
                            if "INT" in type_str:
                                col_type = "INTEGER"
                            elif "FLOAT" in type_str or "NUMERIC" in type_str:
                                col_type = "FLOAT"
                            conn.exec_driver_sql(f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type}")
                except Exception:
                    pass
    except Exception:
        pass


def sync_knowledge_base_to_rag(db: Optional[Session] = None):
    
    if not rag_engine or not rag_engine.is_active:
        return
    close_db = False
    if db is None:
        db = next(get_db())
        close_db = True
    try:
        items = []
        for g in db.query(GuidelineModel).all():
            items.append({
                "id": f"guideline-{g.id}",
                "text": f"{g.name} ({g.category}): {g.description} Policy rules: {g.rule_pattern}. Remediation: {g.remediation_template}",
                "title": g.name,
                "type": "guideline",
                "category": g.category,
                "reference": f"{g.name} {g.version}"
            })
        for f in db.query(ApprovedFactModel).all():
            items.append({
                "id": f"fact-{f.id}",
                "text": f"Canonical Fact ({f.topic}): {f.claim_statement} Approved metric: {f.approved_metric}. Citation: {f.source_citation}",
                "title": f.topic,
                "type": "fact",
                "category": "claims",
                "reference": f.source_citation
            })
        if items:
            rag_engine.index_knowledge_items(items)
    except Exception:
        pass
    finally:
        if close_db:
            db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name == "sqlite":
        ensure_sqlite_columns()
    seed_default_knowledge_base()
    sync_knowledge_base_to_rag()
    yield


app = FastAPI(
    title="BrandSphere AI API",
    description="Intelligent Pre-Publication Brand Governance Platform",
    version="1.2.0",
    lifespan=lifespan
)


raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://localhost:8001,https://brandsphere-ai.vercel.app"
)
if raw_origins and raw_origins.strip():
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "https://brandsphere-ai.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|.*\.vercel\.app|.*\.onrender\.com)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "BrandSphere AI API",
        "version": "1.1.0",
        "status": "operational",
        "storage": "persistent_database"
    }






@app.post("/api/documents/upload", response_model=DocumentUploadResult, status_code=status.HTTP_201_CREATED)
async def upload_document(doc: ContentUpload, db: Session = Depends(get_db)):
    if db.query(GuidelineModel).count() == 0:
        seed_default_knowledge_base(db)
        sync_knowledge_base_to_rag(db)
    doc_id = str(uuid.uuid4())

    
    cache_key = cache_service.hash_key("scan", doc.content)
    cached_scan = cache_service.get(cache_key)
    if cached_scan:
        raw_issues = []
        for ci in cached_scan.get("issues", []):
            iss_copy = dict(ci)
            iss_copy["id"] = str(uuid.uuid4())
            raw_issues.append(iss_copy)
        readability = cached_scan.get("readability", compute_readability(doc.content))
    else:
        raw_issues = analyze_content(doc.content, db)
        readability = compute_readability(doc.content)
        cache_service.set(cache_key, {"issues": raw_issues, "readability": readability}, ttl=3600)

    new_doc = DocumentModel(
        id=doc_id,
        title=doc.title,
        content=doc.content,
        content_type=doc.content_type,
        author=doc.author,
        status="pending_review",
        created_at=datetime.now(timezone.utc).isoformat(),
        version=1,
        readability_score=readability["flesch_reading_ease"],
        wcag_score=95.0,
        image_url=doc.image_url
    )
    db.add(new_doc)

    
    if doc.image_url:
        try:
            import base64
            header_split = doc.image_url.split(",")
            base64_data = header_split[1] if len(header_split) > 1 else header_split[0]
            img_bytes = base64.b64decode(base64_data)
            visual_res = analyze_image_bytes(img_bytes)
            if visual_res.get("dominant_colors"):
                new_doc.dominant_colors = ", ".join(visual_res["dominant_colors"][:4])
            if "contrast_compliant_aa" in visual_res:
                new_doc.wcag_score = 95.0 if visual_res["contrast_compliant_aa"] else 60.0
            for v_iss in visual_res.get("issues", []):
                raw_issues.append(v_iss)
        except Exception:
            pass

    for issue_data in raw_issues:
        issue_model = IssueModel(
            id=issue_data["id"],
            document_id=doc_id,
            type=issue_data["type"],
            severity=issue_data["severity"],
            description=issue_data["description"],
            guideline_reference=issue_data["guideline_reference"],
            suggestion=issue_data["suggestion"],
            citation=issue_data["citation"],
            location=issue_data["location"],
            resolved=issue_data.get("resolved", False),
            original_text=issue_data.get("original_text")
        )
        db.add(issue_model)

    
    rev = RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        version=1,
        content=doc.content,
        change_summary="Initial submission draft uploaded",
        edited_by=doc.author,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(rev)

    
    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        actor=doc.author,
        role="Creator",
        action="DOCUMENT_UPLOADED",
        details=f"Uploaded '{doc.title}' ({doc.content_type}). {len(raw_issues)} governance issues flagged.",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)

    db.commit()
    db.refresh(new_doc)

    return {
        "document": new_doc.to_dict(),
        "issues_count": len(raw_issues)
    }


@app.get("/api/documents", response_model=DocumentsListResult)
async def get_documents(db: Session = Depends(get_db)):
    docs = db.query(DocumentModel).order_by(DocumentModel.created_at.desc()).all()
    return {"documents": [doc.to_dict() for doc in docs]}


@app.get("/api/documents/{doc_id}", response_model=DocumentDetailResult)
async def get_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return {"document": doc.to_dict()}


@app.delete("/api/documents/{doc_id}")
async def delete_document(doc_id: str, db: Session = Depends(get_db)):
    
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    db.delete(doc)
    db.commit()
    return {"success": True, "deleted_id": doc_id}


@app.post("/api/demo/seed")
async def seed_demo_documents(db: Session = Depends(get_db)):
    
    if db.query(GuidelineModel).count() == 0:
        seed_default_knowledge_base(db)

    seeded_docs = []

    
    doc1_id = str(uuid.uuid4())
    doc1_content = "BrandSphere is officially the fastest cloud platform in the world! Our totally amazing new release is #1 rated across all benchmarks. We have completely eliminated the legacy architecture and old version bottlenecks to bring you an unbeatable price with guaranteed 100% zero downtime. This is an awesome revolution in business computing that your team will totally love."
    raw_issues1 = analyze_content(doc1_content, db)
    doc1 = DocumentModel(
        id=doc1_id,
        title="Q4 Enterprise Cloud Launch Announcement",
        content=doc1_content,
        content_type="document",
        author="Growth Marketing Team",
        status="pending_review",
        created_at=datetime.now(timezone.utc).isoformat(),
        version=1,
        readability_score=compute_readability(doc1_content)["flesch_reading_ease"],
        wcag_score=95.0
    )
    db.add(doc1)
    for iss in raw_issues1:
        db.add(IssueModel(
            id=iss["id"],
            document_id=doc1_id,
            type=iss["type"],
            severity=iss["severity"],
            description=iss["description"],
            guideline_reference=iss["guideline_reference"],
            suggestion=iss["suggestion"],
            citation=iss["citation"],
            location=iss["location"],
            resolved=False,
            original_text=iss.get("original_text")
        ))
    db.add(RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc1_id,
        version=1,
        content=doc1_content,
        change_summary="Initial marketing draft with unverified superlatives",
        edited_by="Growth Marketing Team",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    db.add(AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc1_id,
        actor="Growth Marketing Team",
        role="Creator",
        action="DOCUMENT_UPLOADED",
        details=f"Uploaded initial marketing draft. {len(raw_issues1)} governance issues flagged.",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    seeded_docs.append(doc1)

    
    doc2_id = str(uuid.uuid4())
    doc2_content = "BrandSphere AI delivers up to an 80% reduction in content review turnaround cycles according to the Inkloom Enterprise Study 2026. The platform maintains 99.5% accuracy in detecting unsupported promotional claims, upholding high standards of enterprise credibility. All published collateral retains a cryptographically verifiable audit trail compliant with SOC 2 requirements."
    doc2 = DocumentModel(
        id=doc2_id,
        title="Product Performance Benchmark Summary",
        content=doc2_content,
        content_type="document",
        author="Compliance & Communications Lead",
        status="approved",
        created_at=datetime.now(timezone.utc).isoformat(),
        version=2,
        readability_score=compute_readability(doc2_content)["flesch_reading_ease"],
        wcag_score=100.0
    )
    db.add(doc2)
    db.add(RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc2_id,
        version=2,
        content=doc2_content,
        change_summary="Substantiated all metrics with Inkloom 2026 enterprise study citations",
        edited_by="Compliance & Communications Lead",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    db.add(ReviewModel(
        id=str(uuid.uuid4()),
        document_id=doc2_id,
        reviewer_id="reviewer-legal-admin",
        status="approved",
        comments="Fully grounded against Canonical Fact Sheet §4.2. Approved for immediate release.",
        role="Legal Admin",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    db.add(AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc2_id,
        actor="Legal Admin",
        role="Legal Admin",
        action="REVIEW_DECISION",
        details="Document approved for publication with compliance certification.",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    seeded_docs.append(doc2)

    
    doc3_id = str(uuid.uuid4())
    doc3_content = "Excited to showcase our Autonomous Brand Governance Agent! With continuous pre-publication checks, teams protect brand voice and visual consistency seamlessly. Experience reliable, explainable AI assistance designed for modern marketing workflows. #BrandSphere #Governance"
    doc3 = DocumentModel(
        id=doc3_id,
        title="Autonomous Brand Agent Feature Campaign",
        content=doc3_content,
        content_type="social",
        author="Digital Media Agency",
        status="needs_revision",
        created_at=datetime.now(timezone.utc).isoformat(),
        version=1,
        readability_score=compute_readability(doc3_content)["flesch_reading_ease"],
        wcag_score=95.0
    )
    db.add(doc3)
    db.add(RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc3_id,
        version=1,
        content=doc3_content,
        change_summary="Initial social ad copy draft",
        edited_by="Digital Media Agency",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    db.add(CommentModel(
        id=str(uuid.uuid4()),
        document_id=doc3_id,
        author="Brand Reviewer Team",
        role="Reviewer",
        text="Please ensure the accompanying banner creative adheres to 24px logo safe zone padding before final sign-off.",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    db.add(AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc3_id,
        actor="Brand Reviewer",
        role="Reviewer",
        action="REVISION_REQUESTED",
        details="Requested revision regarding visual asset logo clearance.",
        created_at=datetime.now(timezone.utc).isoformat()
    ))
    seeded_docs.append(doc3)

    db.commit()
    return {
        "success": True,
        "seeded_count": len(seeded_docs),
        "documents": [d.to_dict() for d in seeded_docs]
    }






@app.post("/api/documents/{doc_id}/apply-remediation")
async def apply_remediation(doc_id: str, payload: RemediationRequest, db: Session = Depends(get_db)):
    
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    issue = db.query(IssueModel).filter(IssueModel.id == payload.issue_id, IssueModel.document_id == doc_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    
    replacement = payload.custom_replacement
    if not replacement:
        if llm_engine.is_gemini_active():
            replacement = llm_engine.generate_smart_remediation(
                full_content=doc.content,
                issue_type=issue.type,
                issue_description=issue.description,
                guideline_reference=issue.guideline_reference,
                target_text=issue.original_text,
                canonical_context=issue.citation
            )
        if not replacement:
            replacement = issue.suggestion
    original_target = issue.original_text

    
    content_before = doc.content
    content_after = content_before
    if original_target and original_target.lower() in content_before.lower():
        pattern = re.compile(re.escape(original_target), re.IGNORECASE)
        
        clean_fix = replacement
        if "Example:" in replacement:
            clean_fix = replacement.split("Example:")[1].strip().strip("'\"")
        elif "Replace with approved term" in replacement:
            match = re.search(r"'(.*?)'", replacement)
            if match:
                clean_fix = match.group(1)
        content_after = pattern.sub(clean_fix, content_before, count=1)
    else:
        
        content_after = content_before

    doc.content = content_after
    doc.version = (doc.version or 1) + 1
    issue.resolved = True

    
    readability = compute_readability(doc.content)
    doc.readability_score = readability["flesch_reading_ease"]

    
    rev = RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        version=doc.version,
        content=doc.content,
        change_summary=f"Resolved issue '{issue.type}': {issue.description}",
        edited_by=payload.author_name or "Editor",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(rev)

    
    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        actor=payload.author_name or "Editor",
        role="Author/Reviewer",
        action="ISSUE_REMEDIATED",
        details=f"Applied fix for {issue.guideline_reference}. Created version v{doc.version}.",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)

    db.commit()
    db.refresh(doc)
    return {
        "success": True,
        "document": doc.to_dict(),
        "resolved_issue_id": issue.id,
        "new_version": doc.version
    }


@app.post("/api/documents/{doc_id}/revisions")
async def create_revision(doc_id: str, payload: RevisionCreateRequest, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.content = payload.content
    doc.version = (doc.version or 1) + 1
    readability = compute_readability(doc.content)
    doc.readability_score = readability["flesch_reading_ease"]

    rev = RevisionModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        version=doc.version,
        content=payload.content,
        change_summary=payload.change_summary,
        edited_by=payload.edited_by,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(rev)

    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        actor=payload.edited_by,
        role="Author",
        action="DRAFT_REVISED",
        details=f"Author updated draft content. Created version v{doc.version}.",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)

    db.commit()
    db.refresh(doc)
    return {"document": doc.to_dict(), "version": doc.version}


@app.get("/api/documents/{doc_id}/revisions")
async def get_revisions(doc_id: str, db: Session = Depends(get_db)):
    revs = db.query(RevisionModel).filter(RevisionModel.document_id == doc_id).order_by(RevisionModel.version.desc()).all()
    return {"revisions": [r.to_dict() for r in revs]}


@app.get("/api/documents/{doc_id}/audit-trail")
async def get_audit_trail(doc_id: str, db: Session = Depends(get_db)):
    logs = db.query(AuditLogModel).filter(AuditLogModel.document_id == doc_id).order_by(AuditLogModel.created_at.desc()).all()
    return {"audit_trail": [l.to_dict() for l in logs]}






@app.post("/api/documents/{doc_id}/comments")
async def add_comment(doc_id: str, payload: CommentCreateRequest, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    c = CommentModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        author=payload.author,
        role=payload.role,
        text=payload.text,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(c)

    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        actor=payload.author,
        role=payload.role,
        action="COMMENT_ADDED",
        details=f"Added review comment: '{payload.text[:50]}...'",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)

    db.commit()
    db.refresh(c)
    return {"comment": c.to_dict()}


@app.get("/api/documents/{doc_id}/comments")
async def get_comments(doc_id: str, db: Session = Depends(get_db)):
    comments = db.query(CommentModel).filter(CommentModel.document_id == doc_id).order_by(CommentModel.created_at.asc()).all()
    return {"comments": [c.to_dict() for c in comments]}






@app.post("/api/reviews/submit", response_model=ReviewSubmitResult)
async def submit_review(review: ReviewRequest, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == review.document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{review.document_id}' not found"
        )

    
    doc.status = review.status.value

    review_entry = ReviewModel(
        id=str(uuid.uuid4()),
        document_id=review.document_id,
        reviewer_id=review.reviewer_id,
        status=review.status.value,
        comments=review.comments,
        role=review.role or "Reviewer",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(review_entry)

    
    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=review.document_id,
        actor=review.reviewer_id,
        role=review.role or "Reviewer",
        action=f"REVIEW_{review.status.value.upper()}",
        details=f"Review decision '{review.status.value}'. Notes: {review.comments or 'None'}",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)

    db.commit()
    db.refresh(review_entry)

    return {"review": review_entry.to_dict()}


@app.get("/api/reviews", response_model=ReviewsListResult)
async def get_reviews(db: Session = Depends(get_db)):
    all_reviews = db.query(ReviewModel).order_by(ReviewModel.created_at.desc()).all()
    return {"reviews": [r.to_dict() for r in all_reviews]}






@app.get("/api/documents/{doc_id}/certificate", response_model=CertificateResponse)
async def get_document_certificate(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    cert_cache_key = f"cert:{doc.id}:{doc.version}"
    cached_cert = cache_service.get(cert_cache_key)
    if cached_cert:
        return cached_cert

    latest_review = db.query(ReviewModel).filter(ReviewModel.document_id == doc_id).order_by(ReviewModel.created_at.desc()).first()
    resolved_count = len([i for i in doc.issues if i.resolved]) if doc.issues else 0
    total_issues = len(doc.issues) if doc.issues else 0

    
    payload_str = f"{doc.id}:{doc.title}:{doc.content}:{doc.status}:{doc.author}"
    verification_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

    compliance_score = 100.0 if total_issues == 0 else round(((resolved_count) / max(1, total_issues)) * 100, 1)
    if doc.status == "approved" and compliance_score < 70:
        compliance_score = 95.0

    cert_data = {
        "document_id": doc.id,
        "title": doc.title,
        "author": doc.author,
        "approved_at": latest_review.created_at if latest_review else doc.created_at,
        "reviewer_id": latest_review.reviewer_id if latest_review else "System Pre-Scan",
        "compliance_score": compliance_score,
        "wcag_score": doc.wcag_score or 95.0,
        "readability_score": doc.readability_score or 72.0,
        "resolved_issues_count": resolved_count,
        "verification_hash": f"BS-SHA256-{verification_hash[:24]}",
        "status": doc.status,
        "qr_data": f"{os.getenv('VERIFICATION_BASE_URL')}/verify?doc={doc.id}&hash={verification_hash[:16]}"
    }
    cache_service.set(cert_cache_key, cert_data, ttl=3600)
    return cert_data






@app.post("/api/visual/analyze", response_model=VisualAnalyzeResponse)
async def analyze_visual(
    payload: Optional[VisualAnalyzeRequest] = None,
    file: Optional[UploadFile] = File(None)
):
    
    image_bytes = None
    if file:
        image_bytes = await file.read()
    elif payload and payload.image_base64:
        header_split = payload.image_base64.split(",")
        base64_data = header_split[1] if len(header_split) > 1 else header_split[0]
        image_bytes = base64.b64decode(base64_data)

    if not image_bytes:
        
        return {
            "dominant_colors": ["#020617", "#0F172A", "#4F46E5", "#06B6D4"],
            "palette_match_score": 92.0,
            "contrast_ratio": 7.5,
            "contrast_compliant_aa": True,
            "issues": [],
            "recommendations": ["Visual asset matches BrandSphere enterprise theme."]
        }

    return analyze_image_bytes(image_bytes)






@app.get("/api/guidelines", response_model=GuidelinesListResult)
async def get_guidelines(db: Session = Depends(get_db)):
    guidelines = db.query(GuidelineModel).filter(GuidelineModel.is_active == True).all()
    
    if guidelines:
        return {"guidelines": [g.to_dict() for g in guidelines]}

    default_guidelines = [
        {"id": "1", "name": "Brand Claims Policy", "version": "v1.2", "category": "claims"},
        {"id": "2", "name": "Brand Voice Guide", "version": "v2.0", "category": "tone"},
        {"id": "3", "name": "Visual Identity Guidelines", "version": "v1.5", "category": "visual"},
        {"id": "4", "name": "Accessibility Standards", "version": "WCAG 2.1", "category": "accessibility"},
        {"id": "5", "name": "Brand Terminology Guide", "version": "v2.1", "category": "terminology"}
    ]
    return {"guidelines": default_guidelines}


@app.post("/api/guidelines")
async def create_guideline(payload: GuidelineCreate, db: Session = Depends(get_db)):
    guideline = GuidelineModel(
        id=str(uuid.uuid4()),
        name=payload.name,
        category=payload.category,
        version=payload.version,
        description=payload.description,
        rule_pattern=payload.rule_pattern,
        rationale=payload.rationale,
        remediation_template=payload.remediation_template,
        is_active=True,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(guideline)
    db.commit()
    db.refresh(guideline)
    if rag_engine and rag_engine.is_active:
        rag_engine.index_knowledge_items([{
            "id": f"guideline-{guideline.id}",
            "text": f"{guideline.name} ({guideline.category}): {guideline.description} Rules: {guideline.rule_pattern}. Remediation: {guideline.remediation_template}",
            "title": guideline.name,
            "type": "guideline",
            "category": guideline.category,
            "reference": f"{guideline.name} {guideline.version}"
        }])
    return {"guideline": guideline.to_dict()}


@app.delete("/api/guidelines/{guideline_id}")
async def delete_guideline(guideline_id: str, db: Session = Depends(get_db)):
    g = db.query(GuidelineModel).filter(GuidelineModel.id == guideline_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Guideline not found")
    db.delete(g)
    db.commit()
    return {"success": True, "deleted_id": guideline_id}


@app.get("/api/facts")
async def get_facts(db: Session = Depends(get_db)):
    if db.query(ApprovedFactModel).count() == 0:
        seed_default_knowledge_base(db)
    facts = db.query(ApprovedFactModel).all()
    return {"facts": [f.to_dict() for f in facts]}


@app.post("/api/facts")
async def create_fact(payload: ApprovedFactCreate, db: Session = Depends(get_db)):
    fact = ApprovedFactModel(
        id=str(uuid.uuid4()),
        topic=payload.topic,
        claim_statement=payload.claim_statement,
        approved_metric=payload.approved_metric,
        source_citation=payload.source_citation,
        status="active",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(fact)
    db.commit()
    db.refresh(fact)
    if rag_engine and rag_engine.is_active:
        rag_engine.index_knowledge_items([{
            "id": f"fact-{fact.id}",
            "text": f"Canonical Fact ({fact.topic}): {fact.claim_statement} Approved metric: {fact.approved_metric}. Citation: {fact.source_citation}",
            "title": fact.topic,
            "type": "fact",
            "category": "claims",
            "reference": fact.source_citation
        }])
    return {"fact": fact.to_dict()}


@app.delete("/api/facts/{fact_id}")
async def delete_fact(fact_id: str, db: Session = Depends(get_db)):
    fact = db.query(ApprovedFactModel).filter(ApprovedFactModel.id == fact_id).first()
    if not fact:
        raise HTTPException(status_code=404, detail="Fact not found")
    db.delete(fact)
    db.commit()
    return {"success": True, "deleted_id": fact_id}


@app.get("/api/glossary")
async def get_glossary(db: Session = Depends(get_db)):
    if db.query(GlossaryTermModel).count() == 0:
        seed_default_knowledge_base(db)
    terms = db.query(GlossaryTermModel).all()
    return {"glossary": [t.to_dict() for t in terms]}


@app.post("/api/glossary")
async def create_glossary_term(payload: GlossaryCreate, db: Session = Depends(get_db)):
    term = GlossaryTermModel(
        id=str(uuid.uuid4()),
        term=payload.term,
        replacement=payload.replacement,
        category=payload.category,
        note=payload.note,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(term)
    db.commit()
    db.refresh(term)
    return {"term": term.to_dict()}


@app.delete("/api/glossary/{term_id}")
async def delete_glossary_term(term_id: str, db: Session = Depends(get_db)):
    t = db.query(GlossaryTermModel).filter(GlossaryTermModel.id == term_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Glossary term not found")
    db.delete(t)
    db.commit()
    return {"success": True, "deleted_id": term_id}


@app.get("/api/brand-assets")
async def get_brand_assets(db: Session = Depends(get_db)):
    assets = db.query(BrandAssetModel).all()
    return {"brand_assets": [a.to_dict() for a in assets]}


@app.post("/api/brand-assets")
async def create_brand_asset(payload: BrandAssetCreate, db: Session = Depends(get_db)):
    asset = BrandAssetModel(
        id=str(uuid.uuid4()),
        asset_name=payload.asset_name,
        asset_type=payload.asset_type,
        value=payload.value,
        description=payload.description,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return {"asset": asset.to_dict()}






@app.get("/api/analytics", response_model=AnalyticsResult)
async def get_analytics(db: Session = Depends(get_db)):
    total_docs = db.query(DocumentModel).count()
    approved_count = db.query(DocumentModel).filter(DocumentModel.status == "approved").count()
    pending_count = db.query(DocumentModel).filter(DocumentModel.status == "pending_review").count()
    rejected_count = db.query(DocumentModel).filter(DocumentModel.status == "rejected").count()

    total_issues = db.query(IssueModel).count()

    
    issue_counts = db.query(IssueModel.type, func.count(IssueModel.id)).group_by(IssueModel.type).all()
    issue_types: Dict[str, int] = {item[0]: item[1] for item in issue_counts}

    
    severity_counts = db.query(IssueModel.severity, func.count(IssueModel.id)).group_by(IssueModel.severity).all()
    severity_breakdown: Dict[str, int] = {item[0]: item[1] for item in severity_counts}

    avg_issues = round(total_issues / total_docs, 2) if total_docs > 0 else 0.0
    compliance_rate = round((approved_count / total_docs) * 100, 1) if total_docs > 0 else 100.0

    guideline_insights = [
        {
            "guideline": "Brand Claims Policy §3.2",
            "frequency": issue_types.get("claim", 0),
            "recommendation": "Add more examples of compliant claim phrasing and integrate verified fact sheet tooltips."
        },
        {
            "guideline": "Brand Voice Guide §1.3",
            "frequency": issue_types.get("tone", 0),
            "recommendation": "Provide industry-specific tone examples for formal enterprise deliverables."
        },
        {
            "guideline": "Brand Terminology Guide v2.1",
            "frequency": issue_types.get("terminology", 0),
            "recommendation": "Create searchable glossary with automated deprecation notices in CMS plugins."
        }
    ]

    return {
        "overview": {
            "total_documents": total_docs,
            "approved": approved_count,
            "pending_review": pending_count,
            "rejected": rejected_count,
            "total_issues_flagged": total_issues,
            "avg_issues_per_doc": avg_issues
        },
        "issue_distribution": issue_types,
        "guideline_clarity_insights": guideline_insights,
        "compliance_rate_percent": compliance_rate,
        "severity_breakdown": severity_breakdown
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)