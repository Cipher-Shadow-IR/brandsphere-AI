from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, ForeignKey, Integer, Boolean, Float
from sqlalchemy.orm import relationship
from .database import Base


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), default="text", nullable=False)
    author = Column(String(255), nullable=False)
    status = Column(String(50), default="pending_review", nullable=False, index=True)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    
    version = Column(Integer, default=1, nullable=False)
    readability_score = Column(Float, default=70.0, nullable=True)
    wcag_score = Column(Float, default=100.0, nullable=True)
    image_url = Column(Text, nullable=True)
    dominant_colors = Column(String(255), nullable=True)

    issues = relationship(
        "IssueModel",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="IssueModel.id"
    )
    reviews = relationship(
        "ReviewModel",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="ReviewModel.created_at.desc()"
    )
    revisions = relationship(
        "RevisionModel",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="RevisionModel.version.desc()"
    )
    comments = relationship(
        "CommentModel",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="CommentModel.created_at.asc()"
    )
    audit_logs = relationship(
        "AuditLogModel",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="AuditLogModel.created_at.desc()"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "content_type": self.content_type,
            "author": self.author,
            "status": self.status,
            "created_at": self.created_at,
            "version": self.version or 1,
            "readability_score": self.readability_score or 70.0,
            "wcag_score": self.wcag_score if self.wcag_score is not None else 100.0,
            "image_url": self.image_url,
            "dominant_colors": self.dominant_colors,
            "issues": [issue.to_dict() for issue in self.issues] if self.issues else [],
            "reviews": [review.to_dict() for review in self.reviews] if self.reviews else [],
            "revisions": [rev.to_dict() for rev in self.revisions] if self.revisions else [],
            "comments": [c.to_dict() for c in self.comments] if self.comments else []
        }


class IssueModel(Base):
    __tablename__ = "issues"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(100), nullable=False, index=True)
    severity = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    guideline_reference = Column(String(255), nullable=False)
    suggestion = Column(Text, nullable=False)
    citation = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    resolved = Column(Boolean, default=False, nullable=False)
    original_text = Column(Text, nullable=True)

    document = relationship("DocumentModel", back_populates="issues")

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "severity": self.severity,
            "description": self.description,
            "guideline_reference": self.guideline_reference,
            "suggestion": self.suggestion,
            "citation": self.citation,
            "location": self.location,
            "resolved": bool(self.resolved),
            "original_text": self.original_text
        }


class ReviewModel(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    comments = Column(Text, nullable=True)
    role = Column(String(50), default="Reviewer", nullable=False)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    document = relationship("DocumentModel", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "reviewer_id": self.reviewer_id,
            "status": self.status,
            "comments": self.comments,
            "role": self.role or "Reviewer",
            "created_at": self.created_at
        }


class GuidelineModel(Base):
    __tablename__ = "guidelines"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)  
    version = Column(String(50), default="v1.0", nullable=False)
    description = Column(Text, nullable=False)
    rule_pattern = Column(Text, nullable=True)
    rationale = Column(Text, nullable=True)
    remediation_template = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "version": self.version,
            "description": self.description,
            "rule_pattern": self.rule_pattern,
            "rationale": self.rationale,
            "remediation_template": self.remediation_template,
            "is_active": self.is_active,
            "created_at": self.created_at
        }


class ApprovedFactModel(Base):
    __tablename__ = "approved_facts"

    id = Column(String(36), primary_key=True, index=True)
    topic = Column(String(255), nullable=False, index=True)
    claim_statement = Column(Text, nullable=False)
    approved_metric = Column(String(255), nullable=False)
    source_citation = Column(String(255), nullable=False)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "claim_statement": self.claim_statement,
            "approved_metric": self.approved_metric,
            "source_citation": self.source_citation,
            "status": self.status,
            "created_at": self.created_at
        }


class GlossaryTermModel(Base):
    __tablename__ = "glossary_terms"

    id = Column(String(36), primary_key=True, index=True)
    term = Column(String(255), nullable=False, index=True)
    replacement = Column(String(255), nullable=False)
    category = Column(String(50), default="deprecated", nullable=False)  
    note = Column(Text, nullable=True)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "term": self.term,
            "replacement": self.replacement,
            "category": self.category,
            "note": self.note,
            "created_at": self.created_at
        }


class BrandAssetModel(Base):
    __tablename__ = "brand_assets"

    id = Column(String(36), primary_key=True, index=True)
    asset_name = Column(String(255), nullable=False)
    asset_type = Column(String(50), nullable=False)  
    value = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "asset_name": self.asset_name,
            "asset_type": self.asset_type,
            "value": self.value,
            "description": self.description,
            "created_at": self.created_at
        }


class RevisionModel(Base):
    __tablename__ = "revisions"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    version = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    change_summary = Column(Text, nullable=False)
    edited_by = Column(String(255), nullable=False)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    document = relationship("DocumentModel", back_populates="revisions")

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "version": self.version,
            "content": self.content,
            "change_summary": self.change_summary,
            "edited_by": self.edited_by,
            "created_at": self.created_at
        }


class CommentModel(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    author = Column(String(255), nullable=False)
    role = Column(String(50), default="Reviewer", nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    document = relationship("DocumentModel", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "author": self.author,
            "role": self.role,
            "text": self.text,
            "created_at": self.created_at
        }


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    actor = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    document = relationship("DocumentModel", back_populates="audit_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "actor": self.actor,
            "role": self.role,
            "action": self.action,
            "details": self.details,
            "created_at": self.created_at
        }