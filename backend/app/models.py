from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, ForeignKey
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

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "content_type": self.content_type,
            "author": self.author,
            "status": self.status,
            "created_at": self.created_at,
            "issues": [issue.to_dict() for issue in self.issues] if self.issues else []
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
            "location": self.location
        }


class ReviewModel(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(String(50), default=utc_now_iso, nullable=False)

    document = relationship("DocumentModel", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "reviewer_id": self.reviewer_id,
            "status": self.status,
            "comments": self.comments,
            "created_at": self.created_at
        }
