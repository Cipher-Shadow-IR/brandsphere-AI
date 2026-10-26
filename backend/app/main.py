import os
import uuid
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import engine, Base, get_db
from .models import DocumentModel, IssueModel, ReviewModel
from .schemas import (
    ContentUpload,
    ReviewRequest,
    DocumentUploadResult,
    DocumentDetailResult,
    DocumentsListResult,
    ReviewSubmitResult,
    ReviewsListResult,
    AnalyticsResult,
    GuidelinesListResult
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created/verified on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="BrandSphere AI API",
    description="Intelligent Pre-Publication Brand Governance Platform",
    version="1.1.0",
    lifespan=lifespan
)

# Robust CORS Configuration: Avoid wildcard with allow_credentials=True
configured_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://localhost:8001"
)
origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)


def analyze_content(content: str) -> List[Dict[str, Any]]:
    """
    Baseline brand governance policy scanner.
    Preserves existing rule heuristics while preparing for Phase 3 RAG integration.
    """
    issues = []
    content_lower = content.lower()

    if any(word in content_lower for word in ["fastest", "#1", "industry-first", "best-in-class"]):
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "claim",
            "severity": "Critical",
            "description": "Promotional superlative detected without verifiable citation",
            "guideline_reference": "Brand Claims Policy §3.2",
            "suggestion": "Replace with verifiable data or remove the claim. Example: 'Among top solutions in category X according to [Source Name]'.",
            "citation": "Approved Claims Guidelines - Section 3.2: All comparative/superlative claims must cite verified data from approved fact sheets.",
            "location": "Text content"
        })

    if "legacy" in content_lower or "old version" in content_lower:
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "terminology",
            "severity": "Moderate",
            "description": "Potentially outdated terminology detected",
            "guideline_reference": "Brand Terminology Guide v2.1",
            "suggestion": "Use current product terminology from the approved glossary.",
            "citation": "Terminology Guidelines: Refer to approved product names in the Brand Glossary v2.1",
            "location": "Text content"
        })

    if any(word in content_lower for word in ["awesome", "amazing", "totally"]):
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "tone",
            "severity": "Advisory",
            "description": "Informal tone may not be appropriate for enterprise communications",
            "guideline_reference": "Brand Voice Guide §1.3",
            "suggestion": "Consider more professional phrasing that aligns with enterprise brand voice.",
            "citation": "Brand Voice Guidelines: Enterprise communications should maintain a confident, professional tone.",
            "location": "Text content"
        })

    if len(content) > 100:
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "accessibility",
            "severity": "Advisory",
            "description": "Consider adding alt-text context for better accessibility",
            "guideline_reference": "Accessibility Standards WCAG 2.1",
            "suggestion": "Ensure all visual elements include descriptive alternative text.",
            "citation": "WCAG 2.1 Guidelines: Provide text alternatives for non-text content.",
            "location": "Document structure"
        })

    return issues


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
    doc_id = str(uuid.uuid4())
    raw_issues = analyze_content(doc.content)

    new_doc = DocumentModel(
        id=doc_id,
        title=doc.title,
        content=doc.content,
        content_type=doc.content_type,
        author=doc.author,
        status="pending_review",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(new_doc)

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
            location=issue_data["location"]
        )
        db.add(issue_model)

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


@app.post("/api/reviews/submit", response_model=ReviewSubmitResult)
async def submit_review(review: ReviewRequest, db: Session = Depends(get_db)):
    doc = db.query(DocumentModel).filter(DocumentModel.id == review.document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{review.document_id}' not found"
        )

    # Validated status: approved, rejected, or needs_revision
    doc.status = review.status.value

    review_entry = ReviewModel(
        id=str(uuid.uuid4()),
        document_id=review.document_id,
        reviewer_id=review.reviewer_id,
        status=review.status.value,
        comments=review.comments,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(review_entry)
    db.commit()
    db.refresh(review_entry)

    return {"review": review_entry.to_dict()}


@app.get("/api/reviews", response_model=ReviewsListResult)
async def get_reviews(db: Session = Depends(get_db)):
    all_reviews = db.query(ReviewModel).order_by(ReviewModel.created_at.desc()).all()
    return {"reviews": [r.to_dict() for r in all_reviews]}


@app.get("/api/analytics", response_model=AnalyticsResult)
async def get_analytics(db: Session = Depends(get_db)):
    total_docs = db.query(DocumentModel).count()
    approved_count = db.query(DocumentModel).filter(DocumentModel.status == "approved").count()
    pending_count = db.query(DocumentModel).filter(DocumentModel.status == "pending_review").count()
    rejected_count = db.query(DocumentModel).filter(DocumentModel.status == "rejected").count()

    total_issues = db.query(IssueModel).count()

    # Query issue distribution
    issue_counts = db.query(IssueModel.type, func.count(IssueModel.id)).group_by(IssueModel.type).all()
    issue_types: Dict[str, int] = {item[0]: item[1] for item in issue_counts}

    avg_issues = round(total_issues / total_docs, 2) if total_docs > 0 else 0.0

    guideline_insights = [
        {
            "guideline": "Brand Claims Policy §3.2",
            "frequency": issue_types.get("claim", 0),
            "recommendation": "Add more examples of compliant claim phrasing"
        },
        {
            "guideline": "Brand Voice Guide §1.3",
            "frequency": issue_types.get("tone", 0),
            "recommendation": "Provide industry-specific tone examples"
        },
        {
            "guideline": "Brand Terminology Guide v2.1",
            "frequency": issue_types.get("terminology", 0),
            "recommendation": "Create searchable glossary with deprecation notices"
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
        "guideline_clarity_insights": guideline_insights
    }


@app.get("/api/guidelines", response_model=GuidelinesListResult)
async def get_guidelines():
    default_guidelines = [
        {"id": "1", "name": "Brand Claims Policy", "version": "v1.2", "category": "claims"},
        {"id": "2", "name": "Brand Voice Guide", "version": "v2.0", "category": "tone"},
        {"id": "3", "name": "Visual Identity Guidelines", "version": "v1.5", "category": "visual"},
        {"id": "4", "name": "Accessibility Standards", "version": "WCAG 2.1", "category": "accessibility"},
        {"id": "5", "name": "Brand Terminology Guide", "version": "v2.1", "category": "terminology"}
    ]
    return {"guidelines": default_guidelines}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
