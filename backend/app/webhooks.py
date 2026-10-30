"""
BrandSphere AI - Enterprise Headless Pre-Publication Webhooks & CI/CD Gateway
Supports headless CMS webhook payloads (HubSpot, WordPress, Contentful, GitHub Actions)
and enforces automated pre-publication governance gates.
"""

from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from .database import get_db
from .models import DocumentModel, IssueModel, AuditLogModel, GuidelineModel
from .governance_engine import analyze_content, compute_readability

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


class CMSWebhookPayload(BaseModel):
    source: str = Field(default="generic", description="CMS source: hubspot, wordpress, contentful, github_pr, strapi")
    event: Optional[str] = Field(default="content.publish_attempt", description="Webhook event trigger")
    content_id: Optional[str] = Field(default=None, description="External CMS content identifier")
    title: str = Field(..., min_length=1, description="Content title or headline")
    body: str = Field(..., min_length=1, description="Body copy to evaluate")
    author: Optional[str] = Field(default="Headless Publisher", description="Author or publishing service")
    strict_mode: Optional[bool] = Field(default=True, description="Block publication if any critical issue exists")


class WebhookGateResponse(BaseModel):
    compliant: bool
    gate_decision: str  # "APPROVED_FOR_PUBLICATION" | "BLOCKED"
    message: str
    total_issues: int
    critical_count: int
    moderate_count: int
    advisory_count: int
    readability_score: float
    scanned_at: str
    content_id: Optional[str] = None
    source: str
    issues: List[Dict[str, Any]]
    document_id: Optional[str] = None


@router.post("/scan", response_model=WebhookGateResponse, status_code=status.HTTP_200_OK)
def scan_cms_webhook(payload: CMSWebhookPayload, db: Session = Depends(get_db)):
    """
    Receives automated pre-publication webhooks from headless CMS or CI/CD pipelines.
    Evaluates claims, tone, and brand terminology against active policies.
    Returns a strict publish pass/fail gate decision.
    """
    raw_issues = analyze_content(payload.body, db)
    readability = compute_readability(payload.body)

    critical_count = sum(1 for i in raw_issues if i.get("severity") == "Critical")
    moderate_count = sum(1 for i in raw_issues if i.get("severity") == "Moderate")
    advisory_count = sum(1 for i in raw_issues if i.get("severity") == "Advisory")

    # Gate decision
    is_compliant = critical_count == 0 if payload.strict_mode else len(raw_issues) == 0
    decision = "APPROVED_FOR_PUBLICATION" if is_compliant else "BLOCKED"

    if is_compliant:
        msg = "Content passed enterprise pre-publication governance gates. Approved for release."
    else:
        msg = f"Publication blocked: {critical_count} critical brand violation(s) detected. Remediation required."

    # Store governance audit log in database
    doc_id = str(uuid.uuid4())
    doc = DocumentModel(
        id=doc_id,
        title=f"[{payload.source.upper()}] {payload.title}",
        content=payload.body,
        content_type="webhook",
        author=payload.author or "Headless CMS",
        status="approved" if is_compliant else "rejected",
        created_at=datetime.now(timezone.utc).isoformat(),
        version=1,
        readability_score=readability["flesch_reading_ease"],
        wcag_score=95.0
    )
    db.add(doc)

    for issue_data in raw_issues:
        iss = IssueModel(
            id=issue_data["id"],
            document_id=doc_id,
            type=issue_data["type"],
            severity=issue_data["severity"],
            description=issue_data["description"],
            guideline_reference=issue_data["guideline_reference"],
            suggestion=issue_data["suggestion"],
            citation=issue_data["citation"],
            location=issue_data["location"],
            resolved=False,
            original_text=issue_data.get("original_text")
        )
        db.add(iss)

    audit = AuditLogModel(
        id=str(uuid.uuid4()),
        document_id=doc_id,
        actor=payload.author or "Headless CMS",
        role="CI/CD Gateway",
        action="WEBHOOK_GATE_EVALUATED",
        details=f"Gate Decision: {decision}. Source: {payload.source}. {critical_count} critical / {len(raw_issues)} total issues.",
        created_at=datetime.now(timezone.utc).isoformat()
    )
    db.add(audit)
    db.commit()

    return WebhookGateResponse(
        compliant=is_compliant,
        gate_decision=decision,
        message=msg,
        total_issues=len(raw_issues),
        critical_count=critical_count,
        moderate_count=moderate_count,
        advisory_count=advisory_count,
        readability_score=readability["flesch_reading_ease"],
        scanned_at=datetime.now(timezone.utc).isoformat(),
        content_id=payload.content_id,
        source=payload.source,
        issues=raw_issues,
        document_id=doc_id
    )
