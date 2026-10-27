import uuid
import pytest
from fastapi import status


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "BrandSphere AI API"
    assert data["status"] == "operational"
    assert data["storage"] == "persistent_database"


def test_upload_document_success(client):
    payload = {
        "title": "Q4 Product Launch Announcement",
        "content": "This is our fastest product ever, featuring amazing new capabilities and totally awesome UX.",
        "content_type": "text",
        "author": "Marketing Team"
    }
    response = client.post("/api/documents/upload", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "document" in data
    assert data["issues_count"] > 0

    doc = data["document"]
    assert doc["title"] == payload["title"]
    assert doc["author"] == payload["author"]
    assert doc["status"] == "pending_review"
    assert len(doc["issues"]) == data["issues_count"]

    
    issue_types = [i["type"] for i in doc["issues"]]
    assert "claim" in issue_types
    assert "tone" in issue_types


def test_upload_document_validation_errors(client):
    
    response = client.post("/api/documents/upload", json={
        "title": "",
        "content": "Valid content",
        "author": "Alice"
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    
    response = client.post("/api/documents/upload", json={
        "title": "Title Only",
        "author": "Alice"
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_documents_list(client):
    
    client.post("/api/documents/upload", json={
        "title": "Doc 1",
        "content": "Content 1",
        "author": "Author 1"
    })
    client.post("/api/documents/upload", json={
        "title": "Doc 2",
        "content": "Content 2",
        "author": "Author 2"
    })

    response = client.get("/api/documents")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["documents"]) == 2


def test_get_document_by_id_success(client):
    upload_res = client.post("/api/documents/upload", json={
        "title": "Specific Doc",
        "content": "We are the #1 leader in cloud security.",
        "author": "PR Dept"
    })
    doc_id = upload_res.json()["document"]["id"]

    response = client.get(f"/api/documents/{doc_id}")
    assert response.status_code == status.HTTP_200_OK
    doc = response.json()["document"]
    assert doc["id"] == doc_id
    assert doc["title"] == "Specific Doc"
    assert len(doc["issues"]) >= 1


def test_get_document_nonexistent_returns_404(client):
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/documents/{random_id}")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Document not found"


def test_review_status_transitions(client):
    upload_res = client.post("/api/documents/upload", json={
        "title": "Review Workflow Test",
        "content": "Checking approval flow.",
        "author": "Editor"
    })
    doc_id = upload_res.json()["document"]["id"]
    assert upload_res.json()["document"]["status"] == "pending_review"

    
    rev_res = client.post("/api/reviews/submit", json={
        "document_id": doc_id,
        "reviewer_id": "rev-01",
        "status": "needs_revision",
        "comments": "Please refine the wording."
    })
    assert rev_res.status_code == status.HTTP_200_OK
    assert rev_res.json()["review"]["status"] == "needs_revision"

    doc_after_revision = client.get(f"/api/documents/{doc_id}").json()["document"]
    assert doc_after_revision["status"] == "needs_revision"

    
    appr_res = client.post("/api/reviews/submit", json={
        "document_id": doc_id,
        "reviewer_id": "rev-02",
        "status": "approved",
        "comments": "Looks compliant now."
    })
    assert appr_res.status_code == status.HTTP_200_OK
    assert appr_res.json()["review"]["status"] == "approved"

    doc_after_approval = client.get(f"/api/documents/{doc_id}").json()["document"]
    assert doc_after_approval["status"] == "approved"


def test_submit_review_nonexistent_document_returns_404(client):
    random_id = str(uuid.uuid4())
    response = client.post("/api/reviews/submit", json={
        "document_id": random_id,
        "reviewer_id": "rev-01",
        "status": "approved",
        "comments": "Should fail with 404"
    })
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert f"Document '{random_id}' not found" in response.json()["detail"]


def test_submit_review_invalid_status_returns_422(client):
    upload_res = client.post("/api/documents/upload", json={
        "title": "Validation Test",
        "content": "Content",
        "author": "Author"
    })
    doc_id = upload_res.json()["document"]["id"]

    response = client.post("/api/reviews/submit", json={
        "document_id": doc_id,
        "reviewer_id": "rev-01",
        "status": "invalid_status_choice",
        "comments": "Should fail with 422"
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_analytics_metrics(client):
    
    doc1 = client.post("/api/documents/upload", json={
        "title": "Doc 1",
        "content": "We are #1 in the market.",
        "author": "A"
    }).json()["document"]

    doc2 = client.post("/api/documents/upload", json={
        "title": "Doc 2",
        "content": "Simple text.",
        "author": "B"
    }).json()["document"]

    
    client.post("/api/reviews/submit", json={
        "document_id": doc1["id"],
        "reviewer_id": "rev-1",
        "status": "approved"
    })

    res = client.get("/api/analytics")
    assert res.status_code == status.HTTP_200_OK
    analytics = res.json()

    overview = analytics["overview"]
    assert overview["total_documents"] == 2
    assert overview["approved"] == 1
    assert overview["pending_review"] == 1
    assert overview["rejected"] == 0
    assert overview["total_issues_flagged"] >= 1
    assert overview["avg_issues_per_doc"] >= 0.5
    assert "claim" in analytics["issue_distribution"]
    assert len(analytics["guideline_clarity_insights"]) == 3


def test_guidelines_endpoint(client):
    res = client.get("/api/guidelines")
    assert res.status_code == status.HTTP_200_OK
    guidelines = res.json()["guidelines"]
    assert len(guidelines) == 5