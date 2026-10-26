import os
import tempfile
import uuid
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.models import DocumentModel, IssueModel, ReviewModel


def test_persistence_across_restarts():
    """
    Verifies that documents, issues, and reviews written in one session/process lifecycle
    persist on disk and are accurately retrieved after the engine/session is completely disposed.
    """
    temp_db_fd, temp_db_path = tempfile.mkstemp(suffix="_persist.db")
    os.close(temp_db_fd)
    db_url = f"sqlite:///{temp_db_path}"

    doc_id = str(uuid.uuid4())
    issue_id = str(uuid.uuid4())
    review_id = str(uuid.uuid4())

    try:
        # Phase 1: Engine 1 simulates the initial server run
        engine1 = create_engine(db_url, connect_args={"check_same_thread": False})
        Session1 = sessionmaker(bind=engine1)
        Base.metadata.create_all(bind=engine1)

        session1 = Session1()
        doc = DocumentModel(
            id=doc_id,
            title="Persistent Governance Document",
            content="Fastest engine with industry-first design.",
            content_type="text",
            author="Governance Lead",
            status="pending_review",
            created_at="2026-10-26T12:00:00Z"
        )
        session1.add(doc)

        issue = IssueModel(
            id=issue_id,
            document_id=doc_id,
            type="claim",
            severity="Critical",
            description="Superlative claim",
            guideline_reference="Brand Claims §3.2",
            suggestion="Add citations",
            citation="Fact Sheet #42",
            location="Text content"
        )
        session1.add(issue)

        review = ReviewModel(
            id=review_id,
            document_id=doc_id,
            reviewer_id="lead-auditor",
            status="approved",
            comments="Verified against updated fact sheet",
            created_at="2026-10-26T12:05:00Z"
        )
        session1.add(review)
        doc.status = "approved"

        session1.commit()
        session1.close()

        # Completely dispose engine1 (simulates application process termination)
        engine1.dispose()

        # Phase 2: Engine 2 simulates a fresh application restart pointing to the same DB
        engine2 = create_engine(db_url, connect_args={"check_same_thread": False})
        Session2 = sessionmaker(bind=engine2)

        session2 = Session2()
        loaded_doc = session2.query(DocumentModel).filter(DocumentModel.id == doc_id).first()

        assert loaded_doc is not None
        assert loaded_doc.title == "Persistent Governance Document"
        assert loaded_doc.status == "approved"
        assert loaded_doc.author == "Governance Lead"

        # Verify child relations survived restart
        assert len(loaded_doc.issues) == 1
        assert loaded_doc.issues[0].id == issue_id
        assert loaded_doc.issues[0].type == "claim"
        assert loaded_doc.issues[0].severity == "Critical"

        assert len(loaded_doc.reviews) == 1
        assert loaded_doc.reviews[0].id == review_id
        assert loaded_doc.reviews[0].reviewer_id == "lead-auditor"
        assert loaded_doc.reviews[0].comments == "Verified against updated fact sheet"

        session2.close()
        engine2.dispose()

    finally:
        if os.path.exists(temp_db_path):
            try:
                os.remove(temp_db_path)
            except OSError:
                pass
